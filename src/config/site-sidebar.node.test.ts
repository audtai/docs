import { describe, expect, test } from "vitest";

import {
	getSiteSidebarMountCount,
	isSiteSidebarProduct,
	siteSidebarSections,
	type SiteSidebarNode,
} from "./site-sidebar";

function collectMounts(nodes: SiteSidebarNode[]): string[] {
	return nodes.flatMap((node) => [
		...(node.mount ? [node.mount] : []),
		...(node.type === "group" ? collectMounts(node.nodes) : []),
	]);
}

describe("customer site sidebar", () => {
	test("gives each mounted product one unambiguous insertion point", () => {
		const mounts = siteSidebarSections.flatMap((section) =>
			collectMounts(section.nodes),
		);

		expect(new Set(mounts).size).toBe(mounts.length);
		for (const mount of mounts) {
			expect(getSiteSidebarMountCount(mount)).toBe(1);
		}
	});

	test("recognizes mounted products and preserves fallback collections", () => {
		expect(isSiteSidebarProduct("e-commerce")).toBe(true);
		expect(isSiteSidebarProduct("conectores")).toBe(true);
		expect(isSiteSidebarProduct("governanca-e-lgpd")).toBe(true);
		expect(isSiteSidebarProduct("mcp")).toBe(true);
		expect(isSiteSidebarProduct("browser-run")).toBe(true);
		expect(isSiteSidebarProduct("email-service")).toBe(true);
		expect(isSiteSidebarProduct("fundamentals")).toBe(false);
	});

	test("places the Audt platform section immediately above Build", () => {
		const platformIndex = siteSidebarSections.findIndex(
			(section) => section.heading === "Plataforma Audt",
		);
		expect(platformIndex).toBeGreaterThan(-1);
		expect(siteSidebarSections[platformIndex + 1]?.heading).toBe("Build");
	});
});
