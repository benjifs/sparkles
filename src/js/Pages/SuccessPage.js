import m from 'mithril'

import { Box } from '../Components/Box'
import Icon from '../Components/Icon'
import Proxy from '../Controllers/Proxy'
import Store from '../Models/Store'

const RETRY_TIMEOUT = 5 // in seconds
const MAX_CHECKS = 5

const SuccessPage = () => {
	let timeout, count = 0, found = false
	let url = (new URLSearchParams(window.location.search)).get('url')
	const baseURL = Store.getSession('me')
	// Just in case the url received is not an absolute URL
	try {
		url = new URL(url, baseURL).href
	} catch (e) {
		console.error(e)
	}

	const checkURL = async () => {
		if (!url) {
			return m.route.set('/')
		}
		count++
		const found = await Proxy.redirect(url)
		if (found) {
			window.location.href = url
		} else if (count < MAX_CHECKS) {
			timeout = setTimeout(() => {
				checkURL(url)
			}, RETRY_TIMEOUT * 1000)
		}
	}

	return {
		oninit: () => checkURL(),
		onremove: () => timeout && clearTimeout(timeout),
		view: () =>
			m(Box, { className: '.text-center' }, [
				m('p', 'Post created successfully '),
				m('a', { href: url }, url),
				!found && m('p', [
					'Post is not live. ',
					count >= MAX_CHECKS && 'Exceeded amount of automatic checks. Post might be taking longer to show up.',
					count < MAX_CHECKS && `Checking again in ${RETRY_TIMEOUT} seconds `,
					count < MAX_CHECKS && m(Icon, { name: 'spinner', className: 'spin' }),
				]),
				m(m.route.Link, { href: '/home' }, 'Go home')
			])
	}
}

export default SuccessPage