import m from 'mithril'

import { Modal } from '../Components/Modal'

const EntryPreview = {
	view: ({ attrs: { buildPreview } }) =>
		buildPreview && m('div.text-center', m('a', {
			onclick: () => Modal(m('pre', JSON.stringify(buildPreview(), null, 4)))
		}, 'preview'))
}

export default EntryPreview