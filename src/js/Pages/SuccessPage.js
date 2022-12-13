import m from 'mithril'

import Proxy from '../Controllers/Proxy'

const RETRY_TIMEOUT = 5 // in seconds
const MAX_CHECKS = 5

const SuccessPage = () => {
	const url = (new URLSearchParams(window.location.search)).get('url')
	let timeout, count = 0, found = false

	const checkURL = async () => {
		if (!url) {
			return m.route.set('/')
		}
		count++
		const found = await Proxy.redirect(url)
		if (!found && count < MAX_CHECKS) {
			timeout = setTimeout(() => {
				checkURL(url)
			}, RETRY_TIMEOUT * 1000)
		}
	}

	return {
		oninit: () => checkURL(),
		onremove: () => timeout && clearTimeout(timeout),
		view: () =>
			m('section.sp-content.text-center', [
				m('.sp-box', [
					m('.sp-box-content.text-center', [
						m('p', 'Post created successfully '),
						m('a', { href: url }, url),
						!found && m('p', [
							'Post is not live. ',
							count >= MAX_CHECKS && 'Exceeded amount of automatic checks. Post might be taking longer to show up.',
							count < MAX_CHECKS && `Checking again in ${RETRY_TIMEOUT} seconds `,
							count < MAX_CHECKS && m('i.fas.fa-spinner.fa-spin', { 'aria-hidden': 'true' })
						]),
						m(m.route.Link, { href: '/home' }, 'Go home')
					])
				])
			])
	}
}

export default SuccessPage