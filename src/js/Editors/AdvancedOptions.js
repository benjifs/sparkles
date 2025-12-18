import m from 'mithril'

import Icon from '../Components/Icon'
import SyndicateToOptions from './SyndicateToOptions'

const AdvancedOptions = {
	view: ({ attrs: { state, syndicateTo, onchange } }) =>
		m('details',
			m('summary', 'Advanced'),
			m('ul', [
				m('li', m('label', [
					m('span', [
						'slug ',
						m('a', {
							href: 'https://indieweb.org/Micropub-extensions#Slug',
							target: '_blank',
							title: 'experimental property to suggest a slug to the micropub endpoint',
						}, m(Icon, { name: 'question' }))
					]),
					m('input.w200', {
						type: 'text',
						placeholder: 'Slug',
						oninput: e => onchange('mp-slug', e.target.value),
						value: state['mp-slug'] || ''
					})
				])),
				m('li', m('label', [
					'status',
					m('select', {
						oninput: e => onchange('post-status', e.target.value),
						value: state['post-status'] || ''
					},
					['', 'published', 'draft']
						.map(o => m('option', { value: o }, o)))
				])),
				// https://github.com/indieweb/micropub-extensions/issues/11
				m('li', m('label', [
					'visibility',
					m('select', {
						oninput: e => onchange('visibility', e.target.value),
						value: state['visibility'] || ''
					},
					['', 'public', 'unlisted', 'private']
						.map(o => m('option', { value: o }, o)))
				]))
			]),
			m(SyndicateToOptions, {
				syndicateTo: syndicateTo,
				onchange: onchange
			})
		)
}

export default AdvancedOptions