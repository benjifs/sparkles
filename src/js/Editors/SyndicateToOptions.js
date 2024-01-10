import m from 'mithril'

const SyndicateToOptions = {
	view: ({ attrs: { syndicateTo, onchange } }) =>
		syndicateTo && syndicateTo.length > 0 && [
			m('h5', 'Syndication Targets'),
			m('ul', [
				syndicateTo.map(s =>
					m('li', [
						m('label', [
							s.name,
							m('input.mp-syndicate-to', {
								type: 'checkbox',
								checked: s.checked,
								value: s.uid,
								onchange: e => {
									s.checked = e.target.checked
									onchange && onchange('mp-syndicate-to', syndicateTo
										.filter(element => element.checked)
										.map(element => element.uid))
								}
							})
						])
					]))
			])
		]
}

export default SyndicateToOptions