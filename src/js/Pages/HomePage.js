import m from 'mithril'

import { Box } from '../Components/Box'
import { fetchMicropubConfig } from '../Controllers/Helpers'
import {
	NoteTile,
	ImageTile,
	ReplyTile,
	BookmarkTile,
	LikeTile,
	ArticleTile,
	RSVPTile,
	MovieTile,
	BookTile
} from '../Editors/Tiles'
import Store from '../Models/Store'

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY

const HomePage = () => {
	const me = Store.getMe()
	const postTypes = Store.getSession('post-types') || []

	const getPostType = (type) => {
		return postTypes.find(item => item.type === type)
	}

	const postTypeTile = (type, tile) => {
		if (!postTypes) {
			return m(tile)
		}

		const postType = getPostType(type)
		return postType ? m(tile, { name: postType.name }) : null
	}

	return {
		oninit: () => fetchMicropubConfig(),
		view: () => [
			m(Box, [
				m('.sp-tiles', [
					postTypeTile('note', NoteTile),
					m(ImageTile),
					postTypeTile('reply', ReplyTile),
					postTypeTile('bookmark', BookmarkTile),
					postTypeTile('like', LikeTile),
					postTypeTile('article', ArticleTile),
					postTypeTile('rsvp', RSVPTile),
					OMDB_API_KEY
						? postTypeTile('watch', MovieTile)
						: null,
					postTypeTile('read', BookTile)
				])
			]),
			m('section', [
				m('p', [
					'Logged in as ',
					m('a', { href: me }, me),
					' ',
					m(m.route.Link, { class: 'icon', href: '/logout' }, m('i.fas.fa-right-from-bracket', { title: 'logout' }))
				])
			])
		]
	}
}

export default HomePage
