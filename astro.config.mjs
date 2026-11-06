import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc'

// Google Tag Manager container for useoptio.dev. It sends page views to GA4 (G-9MRGSF6TL7).
// Container IDs are public (they show in the page source), so this is fine in git.
const GTM_CONTAINER_ID = 'GTM-TKLK8DVP';

export default defineConfig({
	site: 'https://useoptio.dev',
	integrations: [
		starlight({
			title: 'Optio Docs',
			description: 'Documentation for the Teachable API wrapper.',
			head: [
				{
					// Google's standard GTM loader: tells GTM the page has loaded, then fetches the container.
					tag: 'script',
					content: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`,
				},
			],
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/Ellf/optio-teachable',
				},
			],
			plugins: [
				starlightTypeDoc({
					entryPoints: ['../optio-teachable/src/index.ts'],
					tsconfig: '../optio-teachable/tsconfig.json',
					typeDoc: {
						expandObjects: true,
						excludeNotDocumented: true,
						excludeNotDocumentedKinds: ['Variable', 'TypeAlias']
					},
				})
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'introduction' },
						{ label: 'Quick Start', slug: 'quickstart' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Working with Webhooks', slug: 'guides/webhooks' },
						{ label: 'Why Read-Only?', slug: 'guides/read-only' },
						{ label: 'Pagination', slug: 'guides/pagination' },
					],
				},
				typeDocSidebarGroup,
			],
		}),
	],
});