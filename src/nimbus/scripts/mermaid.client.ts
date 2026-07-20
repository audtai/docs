// Renders `pre.mermaid` blocks: lazy-loads mermaid only on pages that have a
// diagram, applies brand theme variables, and adds an expand-to-dialog modal
// and annotation footer. Adapted from cloudflare-docs (src/scripts/mermaid.ts);
// dark mode keys off `[data-mode="dark"]`.

let dialog: HTMLDialogElement | null = null;
let themeObserver: MutationObserver | null = null;
// Per-<pre> guard: capture source text once, before mermaid replaces innerHTML.
const captured = new WeakSet<HTMLPreElement>();

/**
 * Mermaid only accepts legacy sRGB color syntax, so this is the compact sRGB
 * projection of Judit's default Cobalt Ink theme. The values map to Judit's
 * default text, tint, interact, and danger tokens. Primary tints are derived
 * from kumo-button-primary over kumo-canvas (10% light / 20% dark).
 */
const JUDIT_MERMAID_PALETTE = {
	light: {
		background: "#fcf9fc",
		primaryTint: "#ece0fa",
		foreground: "#1f1a1f",
		surface: "#eee9ee",
		border: "#cec8ce",
		errorSurface: "#fdedec",
		errorText: "#9e2225",
	},
	dark: {
		background: "#080608",
		primaryTint: "#190536",
		foreground: "#f6f2f6",
		surface: "#2f292f",
		border: "#494349",
		errorSurface: "#4b1315",
		errorText: "#f0a9a2",
	},
} as const;

function uniqueMermaidId(): string {
	const random =
		globalThis.crypto?.randomUUID?.() ??
		`${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
	return `mermaid-${random}`;
}

function getDialog(): HTMLDialogElement {
	if (dialog) return dialog;

	dialog = document.createElement("dialog");
	dialog.className = "mermaid-dialog";
	dialog.innerHTML = `
    <div class="mermaid-dialog-body"></div>
    <button class="mermaid-dialog-close" aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;
	document.body.appendChild(dialog);

	function closeWithAnimation() {
		if (!dialog || !dialog.open) return;
		dialog.classList.add("closing");
		dialog.addEventListener(
			"animationend",
			() => {
				dialog!.classList.remove("closing");
				dialog!.close();
				document.documentElement.style.overflow = "";
			},
			{ once: true },
		);
	}

	dialog.addEventListener("click", (e) => {
		if (e.target === dialog) closeWithAnimation();
	});
	dialog
		.querySelector(".mermaid-dialog-close")
		?.addEventListener("click", () => {
			closeWithAnimation();
		});
	dialog.addEventListener("cancel", (e) => {
		e.preventDefault();
		closeWithAnimation();
	});

	return dialog;
}

function openDiagram(container: HTMLElement) {
	const d = getDialog();
	const clone = container.cloneNode(true) as HTMLElement;

	clone.querySelector(".mermaid-expand")?.remove();

	const svg = clone.querySelector("svg");
	if (svg) {
		svg.removeAttribute("style");
		svg.setAttribute("width", "100%");
		svg.setAttribute("height", "auto");
	}

	const body = d.querySelector(".mermaid-dialog-body");
	if (!body) return;
	body.replaceChildren(clone);

	clone.addEventListener("click", (e) => {
		const target = e.target as Element;
		const anchor = target.closest("a");
		const clickable = target.closest(".clickable");
		if (anchor || clickable) {
			d.close();
			document.documentElement.style.overflow = "";
		}
	});

	document.documentElement.style.overflow = "hidden";
	d.showModal();
}

function getFontFamily(): string {
	const computedStyle = getComputedStyle(document.documentElement);
	const font = computedStyle.getPropertyValue("--nb-font-sans").trim();
	return font || "system-ui, -apple-system, sans-serif";
}

function isLightTheme(): boolean {
	return document.documentElement.getAttribute("data-mode") !== "dark";
}

function getPageBackground(): string {
	const style = getComputedStyle(document.documentElement);
	const bg = style.getPropertyValue("--nb-background").trim();
	if (isMermaidSupportedColor(bg)) return bg;
	return isLightTheme()
		? JUDIT_MERMAID_PALETTE.light.background
		: JUDIT_MERMAID_PALETTE.dark.background;
}

function getThemeColor(name: string, fallback: string): string {
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim();
	return isMermaidSupportedColor(value) ? value : fallback;
}

function showRenderError(diagram: HTMLPreElement): void {
	captureDiagramSource(diagram);
	diagram.textContent = "Diagram failed to render.";
	diagram.setAttribute("data-error", "true");
	diagram.setAttribute("data-processed", "true");
}

function captureDiagramSource(diagram: HTMLPreElement): void {
	if (captured.has(diagram)) return;
	diagram.setAttribute("data-diagram", diagram.textContent as string);
	captured.add(diagram);
}

function isMermaidSupportedColor(value: string): boolean {
	return (
		/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value) ||
		/^rgba?\(\s*\d+(?:\.\d+)?%?\s*,\s*\d+(?:\.\d+)?%?\s*,\s*\d+(?:\.\d+)?%?(?:\s*,\s*(?:0|1|0?\.\d+|\d+(?:\.\d+)?%))?\s*\)$/i.test(
			value,
		) ||
		/^hsla?\(\s*-?\d+(?:\.\d+)?(?:deg|rad|turn)?\s*,\s*\d+(?:\.\d+)?%\s*,\s*\d+(?:\.\d+)?%(?:\s*,\s*(?:0|1|0?\.\d+|\d+(?:\.\d+)?%))?\s*\)$/i.test(
			value,
		)
	);
}

function wrapDiagram(diagram: HTMLPreElement, title: string | null) {
	if (diagram.parentElement?.classList.contains("mermaid-container")) {
		return;
	}

	const container = document.createElement("div");
	container.className = "mermaid-container";

	diagram.parentNode?.insertBefore(container, diagram);
	container.appendChild(diagram);

	const expandBtn = document.createElement("button");
	expandBtn.className = "mermaid-expand";
	expandBtn.setAttribute("aria-label", "Expand diagram");
	expandBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15 3 21 3 21 9"></polyline>
    <polyline points="9 21 3 21 3 15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>`;
	expandBtn.addEventListener("click", () => openDiagram(container));
	container.appendChild(expandBtn);

	if (title) {
		const footer = document.createElement("div");
		footer.className = "mermaid-annotation";

		const titleSpan = document.createElement("span");
		titleSpan.className = "mermaid-annotation-title";
		titleSpan.textContent = title;

		const logo = document.createElement("img");
		logo.src = "/logo.svg";
		logo.alt = "Cloudflare";
		logo.className = "mermaid-annotation-logo";

		footer.appendChild(titleSpan);
		footer.appendChild(logo);
		container.appendChild(footer);
	}
}

async function render() {
	const diagrams = document.querySelectorAll<HTMLPreElement>("pre.mermaid");
	if (diagrams.length === 0) return;

	diagrams.forEach(captureDiagramSource);

	let mermaid: typeof import("mermaid").default;
	try {
		({ default: mermaid } = await import("mermaid"));
	} catch (e) {
		diagrams.forEach(showRenderError);
		console.error("Mermaid load failed:", e);
		return;
	}

	const isLight = isLightTheme();
	const fontFamily = getFontFamily();
	const pageBg = getPageBackground();
	const accent = getThemeColor("--nb-primary", "#5c00ec");
	const palette = isLight
		? JUDIT_MERMAID_PALETTE.light
		: JUDIT_MERMAID_PALETTE.dark;

	const themeVariables = {
		fontFamily,
		primaryColor: palette.primaryTint,
		primaryBorderColor: accent,
		primaryTextColor: palette.foreground,
		secondaryColor: palette.surface,
		secondaryBorderColor: palette.border,
		secondaryTextColor: palette.foreground,
		tertiaryColor: palette.surface,
		tertiaryBorderColor: palette.border,
		tertiaryTextColor: palette.foreground,
		lineColor: accent,
		textColor: palette.foreground,
		mainBkg: palette.primaryTint,
		background: pageBg,
		errorBkgColor: palette.errorSurface,
		errorTextColor: palette.errorText,
		edgeLabelBackground: pageBg,
		labelBackground: pageBg,
	};

	try {
		mermaid.initialize({
			startOnLoad: false,
			theme: "base",
			themeVariables,
			flowchart: {
				htmlLabels: true,
				useMaxWidth: true,
				curve: "linear",
			},
		});
	} catch (e) {
		diagrams.forEach(showRenderError);
		console.error("Mermaid initialize failed:", e);
		return;
	}

	for (const diagram of diagrams) {
		try {
			const def = diagram.getAttribute("data-diagram") as string;

			const { svg } = await mermaid.render(uniqueMermaidId(), def);
			diagram.innerHTML = svg;
			diagram.removeAttribute("data-error");

			const svgElement = diagram.querySelector("svg");
			const titleElement = svgElement?.querySelector("title");
			const title = titleElement?.textContent?.trim() || null;

			wrapDiagram(diagram, title);
			diagram.setAttribute("data-processed", "true");
		} catch (e) {
			showRenderError(diagram);
			console.error("Mermaid render failed:", e);
		}
	}
}

function setup() {
	const diagrams = document.querySelectorAll<HTMLPreElement>("pre.mermaid");
	if (diagrams.length === 0) return;

	if (!themeObserver) {
		themeObserver = new MutationObserver(() => render());
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-mode"],
		});
	}

	render();
}

setup();
