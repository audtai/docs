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
			{
				type: "group",
				label: "Media",
				icon: "images",
				collapsed: true,
				nodes: [
					link("Images", "/images/", "images"),
					link("Stream", "/stream/", "stream"),
					link("Realtime", "/realtime/", "realtime"),
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
				nodes: [
					link("WAF", "/waf/", "waf"),
					link("DDoS Protection", "/ddos-protection/", "ddos-protection"),
					link("SSL/TLS", "/ssl/", "ssl"),
					link("Bots", "/bots/", "bots"),
					link("API Shield", "/api-shield/", "api-shield"),
					link("Page Shield", "/page-shield/", "page-shield"),
					link("Turnstile", "/turnstile/", "turnstile"),
					link("Security Center", "/security-center/", "security-center"),
				],
			},
			{
				type: "group",
				label: "Cloudflare One",
				icon: "cloudflare-one",
				mount: "cloudflare-one",
				collapsed: true,
				nodes: [
					link("Overview", "/cloudflare-one/"),
					link("Insights & Logs", "/cloudflare-one/insights/"),
					link("Team & Resources", "/cloudflare-one/team-and-resources/"),
					link("Networks", "/cloudflare-one/networks/"),
					link("Access controls", "/cloudflare-one/access-controls/"),
					link("Traffic policies", "/cloudflare-one/traffic-policies/"),
					link(
						"Cloud & SaaS findings",
						"/cloudflare-one/cloud-and-saas-findings/",
					),
					link("Email security", "/cloudflare-one/email-security/"),
					link("Data loss prevention", "/cloudflare-one/data-loss-prevention/"),
					link(
						"Browser isolation",
						"/cloudflare-one/remote-browser-isolation/",
					),
					link("Reusable components", "/cloudflare-one/reusable-components/"),
					link("Integrations", "/cloudflare-one/integrations/"),
				],
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
					link("Magic Transit", "/magic-transit/", "magic-transit"),
					link("Cloudflare WAN", "/cloudflare-wan/", "cloudflare-wan"),
					link(
						"Cloudflare Network Firewall",
						"/cloudflare-network-firewall/",
						"cloudflare-network-firewall",
					),
					link(
						"Network Interconnect",
						"/network-interconnect/",
						"network-interconnect",
					),
					link("Spectrum", "/spectrum/", "spectrum"),
					link("BYOIP", "/byoip/", "byoip"),
				],
			},
			{
				type: "group",
				label: "Delivery & Performance",
				icon: "speed",
				collapsed: true,
				nodes: [
					link("Cache", "/cache/", "cache"),
					link("Speed", "/speed/", "speed"),
					link("Load Balancing", "/load-balancing/", "load-balancing"),
					link("Waiting Room", "/waiting-room/", "waiting-room"),
					link(
						"Argo Smart Routing",
						"/argo-smart-routing/",
						"argo-smart-routing",
					),
					link("Zaraz", "/zaraz/", "zaraz"),
				],
			},
		],
	},
	{
		heading: "Manage & Observe",
		headingIcon: "heading-other",
		nodes: [
			{
				type: "group",
				label: "Observe",
				icon: "analytics",
				collapsed: true,
				nodes: [
					link("Analytics", "/analytics/", "analytics"),
					link("Web Analytics", "/web-analytics/", "web-analytics"),
					link("Logs", "/logs/", "logs"),
					link("Log Explorer", "/log-explorer/", "log-explorer"),
					link("Health Checks", "/health-checks/", "health-checks"),
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
