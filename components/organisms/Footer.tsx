import Reveal from "@/components/atoms/Reveal";
import Divider from "@/components/atoms/Divider";
import FooterLegal from "@/components/molecules/FooterLegal";
import FooterLinkGroup from "@/components/molecules/FooterLinkGroup";
import FooterBrand from "@/components/molecules/FooterBrand";
import SubscribeForm from "@/components/molecules/SubscribeForm";
import {
  jobSeekerLinks,
  productLinks,
  resourceLinks,
  socialLinks,
} from "@/lib/navigation";

export default function Footer() {
  return (
    <footer className="footer">
      <Reveal className="footer__newsletter">
        <div className="footer__copy">
          <h2 className="footer__headline">Never miss an opportunity</h2>
          <p className="footer__subtext">
            Received personalized job recommendations and career insights every
            week
          </p>
        </div>
        <SubscribeForm />
      </Reveal>
      <Divider />
      <Reveal className="footer__main">
        <FooterBrand />
        <div className="footer__links">
          <FooterLinkGroup title="Job seekers" links={jobSeekerLinks} />
          <FooterLinkGroup title="Resources" links={resourceLinks} />
          <FooterLinkGroup title="Products" links={productLinks} />
          <FooterLinkGroup title="Connect with us" links={socialLinks} />
        </div>
      </Reveal>
      <Divider />
      <FooterLegal />
    </footer>
  );
}
