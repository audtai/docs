import type { StarlightPageProps } from "@astrojs/starlight/props";
import { siteSidebarSections, type SiteSidebarNode } from "./site-sidebar";

type StarlightSidebar = NonNullable<StarlightPageProps["sidebar"]>;
type StarlightSidebarItem = StarlightSidebar[number];

function nodeToConfig(node: SiteSidebarNode): StarlightSidebarItem {
	if (node.type === "link") {
		return { label: node.label, link: node.href };
	}

	return {
		label: node.label,
		collapsed: node.collapsed ?? true,
		badge: node.icon
			? {
					text: node.icon,
					variant: "default",
					class: "sidebar-group-icon",
				}
			: undefined,
		items: node.nodes.map(nodeToConfig),
	};
}

/** Sidebar config consumed by the custom Starlight homepage. */
export const starlightSiteSidebar: StarlightSidebar = siteSidebarSections.map(
	(section) => ({
		label: section.heading,
		collapsed: false,
		badge: {
			text: section.headingIcon,
			variant: "default",
			class: "sidebar-heading",
		},
		items: section.nodes.map(nodeToConfig),
	}),
);
