import m from 'mithril'

const Modal = content => {
	const modalContainer = document.createElement('dialog')
	modalContainer.onclick = e => {
		if (e.target === modalContainer) {
			modalContainer.classList.add('close') // To animate out
			setTimeout(() => {
				modalContainer.remove()
			}, 300)
		}
	}
	document.body.appendChild(modalContainer)
	m.render(modalContainer, m('.sp-modal-content', content))
	modalContainer.showModal()
}

export { Modal }
