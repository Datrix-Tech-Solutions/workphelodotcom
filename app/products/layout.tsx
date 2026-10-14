import Footer from "@/components/organisms/Footer";
import Navbar from "@/components/organisms/Navbar";

// New products: built up section by section from here; /old-products is the frozen baseline.
export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
