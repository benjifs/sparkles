import m from 'mithril'

import Icon from './Icon'

const StarIcon = {
	view: () => m(Icon, { name: 'star', width: 24, height: 24 })
}
const StarHalfIcon = {
	view: () => m(Icon, { name: 'star-half', width: 12, height: 24 })
}

// Starting point:
// https://codepen.io/andreacrawford/pen/NvqJXW
const Rating = {
	view: ({ attrs }) =>
		m('div.rating',
			m('fieldset.rating-group', [
				m('label.clear-rating', {
					title: 'clear',
					for: 'rating-0'
				}, m(Icon, { name: 'xmark', label: 'clear' })),
				m('input', {
					id: 'rating-0',
					type: 'radio',
					value: 0,
					name: 'rating',
					onchange: e => {
						attrs && attrs.onchange && attrs.onchange(e.target.value)
					},
					checked: !attrs.value || attrs.value == 0
				}),
				[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(r => [
					m('label', {
						title: `${r} stars`,
						class: r % 1 === 0 ? 'full' : 'half',
						for: `rating-${r}`
					}, r % 1 === 0 ? m(StarIcon) : m(StarHalfIcon)),
					m('input', {
						id: `rating-${r}`,
						type: 'radio',
						value: r,
						name: 'rating',
						onchange: e => {
							attrs && attrs.onchange && attrs.onchange(e.target.value)
						},
						checked: attrs.value == r
					})
				])
			]))
}

export default Rating