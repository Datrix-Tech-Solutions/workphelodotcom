'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/landing/components/ui/button';
import { Input } from '@/landing/components/ui/input';
import { Label } from '@/landing/components/ui/label';
import { Loader2, CheckCircle2, User, Mail, Building2, Phone, ArrowRight, ChevronDown, Check } from 'lucide-react';
import { toast } from 'sonner';

const MODULES = [
  { value: 'hr', label: 'HR Management' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
  { value: 'all', label: 'All Modules' },
];

const waitlistFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.email('Please enter a valid email'),
  phone: z.string().min(1, 'Phone number is required'),
  company: z.string().optional(),
  module: z.array(z.string()).min(1, 'Please select at least one module'),
  website: z.string().optional(),
});

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

interface MultiSelectProps {
  selected: string[];
  onChange: (values: string[]) => void;
  triggerClassName: string;
}

function MultiSelect({ selected, onChange, triggerClassName }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateRect = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setRect({ top: r.bottom + 6, left: r.left, width: r.width });
    }
  }, []);

  function handleToggle() {
    updateRect();
    setOpen((o) => !o);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleScroll() { if (open) updateRect(); }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [open, updateRect]);

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  const displayText =
    selected.length === 0
      ? 'Select modules'
      : selected.length === MODULES.length
      ? 'All Modules'
      : selected.map((v) => MODULES.find((m) => m.value === v)?.label).join(', ');

  const dropdown =
    open && typeof document !== 'undefined' && rect
      ? createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: rect.top,
              left: rect.left,
              width: rect.width,
              zIndex: 9999,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              background: 'rgba(15, 20, 40, 0.55)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
          >
            {MODULES.map((mod) => {
              const checked = selected.includes(mod.value);
              return (
                <button
                  key={mod.value}
                  type="button"
                  onClick={() => toggle(mod.value)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 transition-colors duration-150"
                >
                  <span
                    className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors duration-150 ${
                      checked ? 'bg-orange-500 border-orange-500' : 'border-white/20 bg-transparent'
                    }`}
                  >
                    {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </span>
                  {mod.label}
                </button>
              );
            })}
          </div>,
          document.body
        )
      : null;

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`${triggerClassName} flex items-center justify-between w-full px-3`}
      >
        <span className={`truncate text-sm ${selected.length === 0 ? 'text-white/25' : 'text-white'}`}>
          {displayText}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-white/30 shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {dropdown}
    </div>
  );
}

interface WaitlistFormProps {
  variant?: 'hero' | 'section';
  className?: string;
}

export function WaitlistForm({ variant = 'hero', className = '' }: WaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: { fullName: '', email: '', phone: '', company: '', module: [], website: '' },
  });

  function handleModuleChange(values: string[]) {
    setSelectedModules(values);
    setValue('module', values);
  }

  const onSubmit = async (data: WaitlistFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, module: data.module?.join(', ') }),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || 'Something went wrong');
        return;
      }

      toast.success('Welcome aboard! You are on the waitlist.');
      setIsSuccess(true);
      reset();
      setSelectedModules([]);
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const heroTrigger =
    'h-12 bg-white/[0.06] border border-white/[0.1] text-white rounded-xl focus:border-orange-500/50 focus:ring-orange-500/15 transition-colors duration-200';
  const sectionTrigger =
    'h-12 bg-white/[0.06] border border-white/[0.1] text-white rounded-xl focus:border-orange-500/50 focus:ring-orange-500/15 transition-colors duration-200';

  const heroInput =
    'h-12 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/25 rounded-xl focus:border-orange-500/50 focus:ring-orange-500/15 pl-11 transition-colors duration-200';
  const sectionInput =
    'h-12 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/25 rounded-xl focus:border-orange-500/50 focus:ring-orange-500/15 pl-11 transition-colors duration-200';

  if (isSuccess) {
    return (
      <div className={`flex flex-col items-center gap-4 text-center py-6 ${className}`}>
        <div className="rounded-full bg-orange-500/10 p-4">
          <CheckCircle2 className="h-8 w-8 text-orange-400" />
        </div>
        <h4 className="text-lg font-bold text-foreground">You&apos;re on the list!</h4>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          We&apos;ll notify you as soon as Workphelo is ready. Thank you for your interest.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSuccess(false)}
          className="mt-1 rounded-full cursor-pointer"
        >
          Join with another email
        </Button>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={`w-full max-w-lg space-y-3.5 ${className}`}>
        <div className="hidden" aria-hidden="true">
          <Label htmlFor="hero-website">Website</Label>
          <Input
            id="hero-website"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-2">
            <Label htmlFor="hero-name" className="text-xs font-medium text-white/50">
              Full Name <span className="text-orange-400/80">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input id="hero-name" placeholder="Kwame Asante" {...register('fullName')} className={heroInput} />
            </div>
            {errors.fullName && <p className="text-xs text-red-400/80 mt-1">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-email" className="text-xs font-medium text-white/50">
              Work Email <span className="text-orange-400/80">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input id="hero-email" type="email" placeholder="kwame@company.com" {...register('email')} className={heroInput} />
            </div>
            {errors.email && <p className="text-xs text-red-400/80 mt-1">{errors.email.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-2">
            <Label htmlFor="hero-phone" className="text-xs font-medium text-white/50">
              Phone Number <span className="text-orange-400/80">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input id="hero-phone" type="tel" placeholder="+234(0) 567 8900" {...register('phone')} className={heroInput} />
            </div>
            {errors.phone && <p className="text-xs text-red-400/80 mt-1">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-company" className="text-xs font-medium text-white/50">
              Company <span className="text-orange-400/80">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input id="hero-company" placeholder="Your company" {...register('company')} className={heroInput} />
            </div>
            {errors.company && <p className="text-xs text-red-400/80 mt-1">{errors.company.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-white/50">
            Interested in <span className="text-orange-400/80">*</span>
          </Label>
          <MultiSelect
            selected={selectedModules}
            onChange={handleModuleChange}
            triggerClassName={heroTrigger}
          />
          {errors.module && <p className="text-xs text-red-400/80 mt-1">{errors.module.message}</p>}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold h-12 text-[15px] rounded-xl cursor-pointer shadow-lg shadow-orange-700/20 transition-all duration-200 active:scale-[0.98] mt-2"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Joining Waitlist...</>
          ) : (
            <>Get Early Access <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
        <p className="text-center text-xs text-white/25 pt-1">
          No spam. We&apos;ll only reach out when Workphelo is ready to launch.
        </p>
      </form>
    );
  }

  /* -- Section variant ----------------------------------------------- */
  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-3xl bg-white/5 backdrop-blur-sm border border-white/8 p-7 sm:p-10 space-y-4"
      >
        <div className="hidden" aria-hidden="true">
          <Label htmlFor="sec-website">Website</Label>
          <Input
            id="sec-website"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sec-name" className="text-white/50 text-sm font-medium">
              Full Name <span className="text-orange-400/80">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input id="sec-name" placeholder="Kwame Asante" {...register('fullName')} className={sectionInput} />
            </div>
            {errors.fullName && <p className="text-xs text-red-400/80">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sec-email" className="text-white/50 text-sm font-medium">
              Work Email <span className="text-orange-400/80">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input id="sec-email" type="email" placeholder="kwame@company.com" {...register('email')} className={sectionInput} />
            </div>
            {errors.email && <p className="text-xs text-red-400/80">{errors.email.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sec-phone" className="text-white/50 text-sm font-medium">
              Phone Number <span className="text-orange-400/80">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input id="sec-phone" type="tel" placeholder="+234(0) 567 8900" {...register('phone')} className={sectionInput} />
            </div>
            {errors.phone && <p className="text-xs text-red-400/80">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sec-company" className="text-white/50 text-sm font-medium">
              Company <span className="text-orange-400/80">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input id="sec-company" placeholder="Your company" {...register('company')} className={sectionInput} />
            </div>
            {errors.company && <p className="text-xs text-red-400/80">{errors.company.message}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-white/50 text-sm font-medium">
            Interested in <span className="text-orange-400/80">*</span>
          </Label>
          <MultiSelect
            selected={selectedModules}
            onChange={handleModuleChange}
            triggerClassName={sectionTrigger}
          />
          {errors.module && <p className="text-xs text-red-400/80">{errors.module.message}</p>}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl cursor-pointer shadow-lg shadow-orange-700/20 transition-all duration-200 active:scale-[0.98] min-h-12 px-8"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Joining...</>
          ) : (
            <>Get Early Access <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </form>
    </div>
  );
}
