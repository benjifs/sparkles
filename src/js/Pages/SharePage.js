import m from 'mithril'

import { Box } from '../Components/Box'
import Tiles from '../Editors/Tiles'
import Store from '../Models/Store'

const SharePage = () => {
	const postTypes = Store.getSession('post-types') || []
	const parameterList = new URLSearchParams(window.location.search)
	const params = {
		title: parameterList.get('title'),
		text: parameterList.get('text'),
		url: parameterList.get('url')
	}

	if (!parameterList.has('url')) {
		parameterList.set('url', parameterList.get('text'))
		parameterList.delete('text')
	}

	return {
		view: () =>
			m(Box, {
				className: '.text-center',
				icon: 'share-network',
				title: 'Share Target'
			}, [
				m('p', [
					'How would you like to share this content?',
					m('br'),
					m('b', 'title:'),
					params.title,
					m('br'),
					m('b', 'text:'),
					params.text,
					m('br'),
					m('b', 'url:'),
					params.url
				]),
				m(Tiles(postTypes, [ 'reply', 'bookmark', 'like', 'rsvp' ], parameterList.toString()))
			])
	}
}

export default SharePage