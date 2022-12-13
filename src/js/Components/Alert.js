import m from 'mithril'

const Alert = {
	show: (type, content, timeout) => {
		const view = [
			m('.sp-alert-content', content)
		]

		const modalContainer = document.createElement('div')
		modalContainer.className = 'sp-alert show'
		document.body.appendChild(modalContainer)
		m.render(modalContainer, view)

		setTimeout(() => {
			modalContainer.remove()
		}, timeout || 3000)
	},
	error: err => {
		let error
		if (err && err.response) {
			error = err.response.error_description || err.response.error
		} else if (err) {
			error = err.message || err
		}
		Alert.show('error', error || 'An unexpected error has occurred')
	}
}

export default Alert
