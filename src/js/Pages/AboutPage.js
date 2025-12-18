import m from 'mithril'

import { Box } from '../Components/Box'
import Icon from '../Components/Icon'

import { version } from '/package.json'

const AboutPage = {
	view: () =>
		m(Box, {
			className: '.text-center',
			icon: 'question',
			title: 'About'
		}, [
			m('p', [
				'sparkles is a ',
				m('a', { href: 'https://micropub.net/', target: '_blank' }, 'micropub'),
				' client. You can create posts from here to add to your micropub compatible website.'
			]),
			m('p', [
				'For more detailed information about sparkles, read the ',
				m('a', { href: 'https://benji.dog/articles/sparkles/', target: '_blank' }, 'announcement'),
				' post.'
			]),
			m('p', [
				'Built with ',
				m('a', { href: 'https://mithril.js.org', target: '_blank' }, 'MithrilJS'),
				', ',
				m('a', { href: 'https://sass-lang.com', target: '_blank' }, 'SCSS'),
				', and ',
				m('a', { href: 'https://phosphoricons.com/', target: '_blank' }, 'Phosphor Icons'),
				'. Deployed to ',
				m('a', { href: 'https://netlify.app', target: '_blank' }, 'Netlify'),
				'.'
			]),
			m('p', [
				'Source Code and Issues: ',
				m('a', { href: 'https://github.com/benjifs/sparkles', target: '_blank' }, m(Icon, { name: 'github-logo', label: 'Github' }))
			]),
			m('a', { href: 'https://github.com/benjifs/sparkles/blob/main/CHANGELOG.md' }, 'Changelog'),
			m('p', [
				'By ',
				m('a', { href: 'https://benji.dog', target: '_blank' }, 'benji')
			]),
			m('p', [
				`v${version}`
			])
		])
}

export default AboutPage