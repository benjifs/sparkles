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
						m('a', { href: 'https://mithriljs.org', target: '_blank' }, 'MithrilJS'),
						', ',
						m('a', { href: 'https://sass-lang.com', target: '_blank' }, 'SCSS'),
						', and ',
						m('a', { href: 'https://fontawesome.com', target: '_blank' }, 'FontAwesome'),
						'. Deployed to ',
						m('a', { href: 'https://netlify.app', target: '_blank' }, 'Netlify'),
						'.'
					]),
					m('p', [
						'Source Code and Issues: ',
						m('a.icon', { href: 'https://github.com/benjifs/sparkles', target: '_blank' }, m('i.fab.fa-github', { title: 'Github' }))
					]),
					m('p', [
						'By ',
						m('a', { href: 'https://benji.dog', target: '_blank' }, 'benji')
					])
				])
			])
		])
}

export default AboutPage