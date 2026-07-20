/**
 * Framework-neutral customer navigation.
 *
 * The Starlight and Nimbus shells both adapt this small curated taxonomy to
 * their own sidebar primitives. Product documentation is injected at render
 * time only for the active product, so the full Cloudflare corpus is never
 * shipped in a single page's navigation DOM.
 */

export interface SiteSidebarLink {
	type: "link";
	label: string;
	href: string;
	/** Top-level docs collection directory mounted under this leaf. */
	mount?: string;
}

export interface SiteSidebarGroup {
	type: "group";
	label: string;
	/** Product icon name from `src/icons/`. */
	icon?: string;
	/** Top-level docs collection directory mounted by this whole group. */
	mount?: string;
	collapsed?: boolean;
	nodes: SiteSidebarNode[];
}

export type SiteSidebarNode = SiteSidebarLink | SiteSidebarGroup;

export interface SiteSidebarSection {
	heading: string;
	/** Starlight heading icon name. */
	headingIcon: string;
	nodes: SiteSidebarNode[];
}

const link = (
	label: string,
	href: string,
	mount?: string,
): SiteSidebarLink => ({
	type: "link",
	label,
	href,
	mount,
});

export const siteSidebarSections: SiteSidebarSection[] = [
	{
		heading: "Comece aqui",
		headingIcon: "heading-get-started",
		nodes: [
			link("Visão geral", "/"),
			link("Como integrar", "/conectores/"),
			link("Contrato de dados", "/e-commerce/"),
			link("Segurança e privacidade", "/governanca-e-lgpd/"),
		],
	},
	{
		heading: "Plataforma Audt",
		headingIcon: "heading-audt-platform",
		nodes: [
			{
				type: "group",
				label: "E-commerce",
				icon: "ph:shopping-cart",
				mount: "e-commerce",
				collapsed: true,
				nodes: [
					link("Visão geral", "/e-commerce/"),
					link("Catálogo de produtos", "/e-commerce/catalogo-de-produtos/"),
					link("Estoque de produtos", "/e-commerce/estoque-de-produtos/"),
					link("Pedidos", "/e-commerce/pedidos/"),
				],
			},
			{
				type: "group",
				label: "Conectores",
				icon: "ph:plugs-connected",
				mount: "conectores",
				collapsed: true,
				nodes: [
					link("Visão geral", "/conectores/"),
					{
						type: "group",
						label: "Google",
						collapsed: true,
						nodes: [
							link("Visão geral", "/conectores/google/"),
							link("Google Ads", "/conectores/google/google-ad/"),
							link(
								"Google Analytics 4",
								"/conectores/google/google-analytics/",
							),
							link("BigQuery", "/conectores/google/bigquery/"),
						],
					},
					{
						type: "group",
						label: "Meta Ads",
						collapsed: true,
						nodes: [
							link("Visão geral", "/conectores/meta-ads/"),
							link("Meta Ads", "/conectores/meta-ads/facebook-ads/"),
						],
					},
					link("VTEX", "/conectores/vtex/"),
				],
			},
			{
				type: "group",
				label: "Governança e LGPD",
				icon: "ph:shield-check",
				mount: "governanca-e-lgpd",
				collapsed: true,
				nodes: [
					link("Visão geral", "/governanca-e-lgpd/"),
					link("Segurança", "/governanca-e-lgpd/seguranca/"),
					link("Auditoria", "/governanca-e-lgpd/auditoria/"),
				],
			},
			{
				type: "group",
				label: "MCP",
				icon: "ph:robot",
				mount: "mcp",
				collapsed: true,
				nodes: [
					link("Visão geral", "/mcp/"),
					link("Conecte com Claude", "/mcp/conecte-com-claude/"),
					link("Conecte com ChatGPT", "/mcp/conecte-com-chatgpt/"),
				],
			},
		],
	},
];

/** Number of explicit insertion points for a product root. */
export function getSiteSidebarMountCount(product: string): number {
	function count(nodes: SiteSidebarNode[]): number {
		return nodes.reduce(
			(total, node) =>
				total +
				(node.mount === product ? 1 : 0) +
				(node.type === "group" ? count(node.nodes) : 0),
			0,
		);
	}

	return siteSidebarSections.reduce(
		(total, section) => total + count(section.nodes),
		0,
	);
}

/** Whether the curated navigation has one unambiguous product insertion point. */
export function isSiteSidebarProduct(product: string): boolean {
	return getSiteSidebarMountCount(product) === 1;
}
