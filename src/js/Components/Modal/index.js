import m from 'mithril'

const Modal = content => {
	const view = [
		m('.sp-modal-bg', { onclick: () => {
			modalContainer.classList.remove('show')
			setTimeout(() => {
				modalContainer.remove()
			}, 500)
		} }),
		// header
		m('.sp-modal-content', content)
	]

	const modalContainer = document.createElement('div')
	modalContainer.className = 'sp-modal show'
	document.body.appendChild(modalContainer)
	m.render(modalContainer, view)
}

export { Modal }
