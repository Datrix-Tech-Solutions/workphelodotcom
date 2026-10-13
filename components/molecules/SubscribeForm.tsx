import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

export default function SubscribeForm() {
  return (
    <form method="get" className="subscribe-form">
      <label htmlFor="subscribe-email" className="sr-only">
        Email address
      </label>
      <Input
        id="subscribe-email"
        name="email"
        type="email"
        className="input--dark"
        placeholder="Enter your email"
        autoComplete="email"
        required
      />
      <Button>Subscribe</Button>
    </form>
  );
}
