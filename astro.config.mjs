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
					href: 'https://github.com/Ellf/teachable-api-wrapper',
				},
			],
			plugins: [
				starlightTypeDoc({
					entryPoints: ['../teachable-api-wrapper/src/index.ts'],
					tsconfig: '../teachable-api-wrapper/tsconfig.json',
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