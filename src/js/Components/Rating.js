import m from 'mithril'

// Starting point:
// https://codepen.io/andreacrawford/pen/NvqJXW
const Rating = {
	view: ({ attrs }) =>
		m('div.rating',
			m('fieldset.rating-group', [
				m('input', {
					id: 'rating-0',
					type: 'radio',
					value: 0,
					name: 'rating',
					checked: !attrs.value
				}),
				[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(r => [
					m('label', {
						title: `${r} stars`,
						class: r % 1 === 0 ? 'full' : 'half',
						for: `rating-${r}`
					}, m('i.fas' + (r % 1 === 0 ? '.fa-star' : '.fa-star-half'))),
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