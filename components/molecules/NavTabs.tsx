import GlassPanel from "@/components/atoms/GlassPanel";
import NavLink from "@/components/atoms/NavLink";
import { navTabs } from "@/lib/navigation";

export default function NavTabs() {
  return (
    <GlassPanel className="nav-tabs">
      <ul className="nav-tabs__list">
        {navTabs.map((tab) => (
          <li key={tab.href}>
            <NavLink href={tab.href}>{tab.label}</NavLink>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
