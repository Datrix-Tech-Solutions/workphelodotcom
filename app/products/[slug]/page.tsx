import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Button from "@/components/atoms/Button";
import Hero from "@/components/organisms/Hero";
import ProductSections from "@/components/organisms/ProductSections";
import { getProductPage, productPages } from "@/lib/productPages";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return productPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const page = getProductPage((await params).slug);
  if (!page) return {};
  return {
    title: `${page.heading} ${page.headingAccent} | Workphelo`,
    description: page.intro,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const page = getProductPage((await params).slug);
  if (!page) notFound();

  return (
    <>
      <Hero
        size="compact"
        title={page.heading}
        titleAccent={page.headingAccent}
        subtext={page.intro}
        showSearch={false}
      />
      <ProductSections slug={page.slug} sections={page.sections} />
      <section className="product-cta">
        <h2 className="product-cta__title">Ready to get started?</h2>
        <Button href="/pricing" variant="solid">
          See pricing list
        </Button>
      </section>
    </>
  );
}
