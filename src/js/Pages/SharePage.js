import m from 'mithril'

import { BoxHeader } from '../Components/Box'
import {
	LikeTile,
	ReplyTile,
	RSVPTile,
	BookmarkTile
} from '../Editors/Tiles'

const SharePage = () => {
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
			m('section.sp-content.text-center', [
				m('.sp-box', [
					m(BoxHeader, {
						icon: '.fas.fa-share-nodes',
						name: 'Share Target'
					}),
					m('.sp-box-content.text-center', [
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
						m('.sp-tiles', [
							m(ReplyTile, { params: parameterList.toString() }),
							m(BookmarkTile, { params: parameterList.toString() }),
							m(LikeTile, { params: parameterList.toString() }),
							m(RSVPTile, { params: parameterList.toString() })
						])
					])
				])
			])
	}
}

export default SharePage