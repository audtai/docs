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

	test("recognizes only the curated Audt collections", () => {
		expect(isSiteSidebarProduct("e-commerce")).toBe(true);
		expect(isSiteSidebarProduct("conectores")).toBe(true);
		expect(isSiteSidebarProduct("governanca-e-lgpd")).toBe(true);
		expect(isSiteSidebarProduct("mcp")).toBe(true);
		expect(isSiteSidebarProduct("browser-run")).toBe(false);
		expect(isSiteSidebarProduct("email-service")).toBe(false);
		expect(isSiteSidebarProduct("fundamentals")).toBe(false);
	});

	test("keeps onboarding before the Audt platform navigation", () => {
		expect(siteSidebarSections.map((section) => section.heading)).toEqual([
			"Comece aqui",
			"Plataforma Audt",
		]);
	});
});
