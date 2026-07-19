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
		expect(isSiteSidebarProduct("browser-run")).toBe(true);
		expect(isSiteSidebarProduct("email-service")).toBe(true);
		expect(isSiteSidebarProduct("fundamentals")).toBe(false);
	});
});
