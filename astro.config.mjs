import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc'

export default defineConfig({
	site: 'https://useoptio.dev',
	integrations: [
		starlight({
			title: 'Optio Docs',
			description: 'Documentation for the Teachable API wrapper.',
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
				typeDocSidebarGroup,
			],
		}),
	],
});