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
		heading: "Get started",
		headingIcon: "heading-get-started",
		nodes: [
			link("Overview", "/"),
			link("API", "/api/"),
			link("Agent Setup", "/agent-setup/"),
			link("Directory", "/directory/"),
			link("Changelog", "/changelog/"),
			{
				type: "group",
				label: "Resources",
				collapsed: true,
				nodes: [
					link(
						"Learning paths",
						"/resources/?filter-pcx_content_type=learning-path",
					),
					link("Use cases", "/use-cases/", "use-cases"),
					link(
						"Reference architecture",
						"/reference-architecture/",
						"reference-architecture",
					),
				],
			},
			{
				type: "group",
				label: "API & IaC",
				collapsed: true,
				nodes: [
					link("API reference", "/api/"),
					link("Terraform", "/terraform/", "terraform"),
					link("Pulumi", "/pulumi/", "pulumi"),
					link("SDKs", "/fundamentals/api/reference/sdks/"),
				],
			},
			link("Support", "/support/", "support"),
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
					link("Catálogo de Produtos", "/e-commerce/catalogo-de-produtos/"),
					link("Estoque de Produtos", "/e-commerce/estoque-de-produtos/"),
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
					{
						type: "group",
						label: "Google",
						collapsed: true,
						nodes: [
							link("Overview", "/conectores/google/"),
							link("Google Ads", "/conectores/google/google-ad/"),
							link("Google Analytics", "/conectores/google/google-analytics/"),
							link("BigQuery", "/conectores/google/bigquery/"),
						],
					},
					{
						type: "group",
						label: "Meta Ads",
						collapsed: true,
						nodes: [
							link("Overview", "/conectores/meta-ads/"),
							link("Facebook Ads", "/conectores/meta-ads/facebook-ads/"),
						],
					},
				],
			},
			{
				type: "group",
				label: "Governança e LGPD",
				icon: "ph:shield-check",
				mount: "governanca-e-lgpd",
				collapsed: true,
				nodes: [
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
					link("Overview", "/mcp/"),
					link("Conecte com Claude", "/mcp/conecte-com-claude/"),
					link("Conecte com ChatGPT", "/mcp/conecte-com-chatgpt/"),
				],
			},
		],
	},
	{
		heading: "Build",
		headingIcon: "heading-build",
		nodes: [
			{
				type: "group",
				label: "Compute",
				icon: "workers",
				collapsed: true,
				nodes: [
					link("Workers", "/workers/", "workers"),
					link("Containers", "/containers/", "containers"),
					link("Durable Objects", "/durable-objects/", "durable-objects"),
					link("Queues", "/queues/", "queues"),
					link("Workflows", "/workflows/", "workflows"),
					link("Flagship", "/flagship/", "flagship"),
					link("Browser Run", "/browser-run/", "browser-run"),
					link("Workers VPC", "/workers-vpc/", "workers-vpc"),
					link(
						"Cloudflare for Platforms",
						"/cloudflare-for-platforms/",
						"cloudflare-for-platforms",
					),
					link("Email Service", "/email-service/", "email-service"),
				],
			},
			{
				type: "group",
				label: "AI",
				icon: "workers-ai",
				collapsed: true,
				nodes: [
					link("Models", "/ai/models/", "ai"),
					link("Workers AI", "/workers-ai/", "workers-ai"),
					link("AI Gateway", "/ai-gateway/", "ai-gateway"),
					link("Agents", "/agents/", "agents"),
					link("Agent Memory", "/agent-memory/", "agent-memory"),
					link("Sandbox SDK", "/sandbox/", "sandbox"),
					link("Vectorize", "/vectorize/", "vectorize"),
					link("AI Search", "/ai-search/", "ai-search"),
					link("AI Crawl Control", "/ai-crawl-control/", "ai-crawl-control"),
				],
			},
			{
				type: "group",
				label: "Storage & Database",
				icon: "kv",
				collapsed: true,
				nodes: [
					link("R2", "/r2/", "r2"),
					link("R2 Data Catalog", "/r2/data-catalog/"),
					link("R2 SQL", "/r2-sql/", "r2-sql"),
					link("Pipelines", "/pipelines/", "pipelines"),
					link("D1", "/d1/", "d1"),
					link("KV", "/kv/", "kv"),
					link("Postgres & MySQL (Hyperdrive)", "/hyperdrive/", "hyperdrive"),
				],
			},
		],
	},
	{
		heading: "Protect & Connect",
		headingIcon: "heading-protect-connect",
		nodes: [
			{
				type: "group",
				label: "Application Security",
				icon: "waf",
				collapsed: true,
				nodes: [link("WAF", "/waf/", "waf")],
			},
			{
				type: "group",
				label: "Domains & DNS",
				icon: "dns",
				collapsed: true,
				nodes: [
					link("DNS", "/dns/", "dns"),
					link("1.1.1.1", "/1.1.1.1/", "1.1.1.1"),
					link("Registrar", "/registrar/", "registrar"),
					link("Email Routing", "/email-service/"),
					link("DMARC Management", "/dmarc-management/", "dmarc-management"),
				],
			},
			{
				type: "group",
				label: "Networking",
				icon: "network",
				collapsed: true,
				nodes: [
					link("Tunnel", "/tunnel/", "tunnel"),
					link("Mesh", "/mesh/", "mesh"),
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
