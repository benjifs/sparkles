import m from 'mithril'

import { BoxHeader } from '../Components/Box'

const AboutPage = {
	view: () =>
		m('section.sp-content.text-center', [
			m('.sp-box', [
				m(BoxHeader, {
					icon: '.far.fa-question-circle',
					name: 'About'
				}),
				m('.sp-box-content.text-center', [
					m('p', [
						'Built with ',
						m('a', { href: 'https://mithriljs.org' }, 'MithrilJS'),
						', ',
						m('a', { href: 'https://sass-lang.com' }, 'SCSS'),
						', and ',
						m('a', { href: 'https://fontawesome.com' }, 'FontAwesome'),
						'. Deployed to ',
						m('a', { href: 'https://netlify.app' }, 'Netlify')
					]),
					m('p', [
						'Source on ',
						m('a.icon', { href: 'https://github.com/benjifs/sparkles' }, m('i.fab.fa-github', { title: 'Github' }))
					]),
					m('p', [
						'By ',
						m('a', { href: 'https://benji.dog' }, 'benji')
					])
				])
			])
		])
}

export default AboutPage