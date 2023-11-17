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

	const getPostTypeName = (type) => {
		const postType = postTypes.find(item => item.type === type)
		return postType ? postType.name : false
	}

	return {
		oninit: () => fetchMicropubConfig(),
		view: () => [
			m(Box, [
				m('.sp-tiles', [
					m(NoteTile, { name: getPostTypeName('note') }),
					m(ImageTile),
					m(ReplyTile, { name: getPostTypeName('note') }),
					m(BookmarkTile, { name: getPostTypeName('bookmark') }),
					m(LikeTile, { name: getPostTypeName('like') }),
					m(ArticleTile, { name: getPostTypeName('article') }),
					m(RSVPTile, { name: getPostTypeName('rsvp') }),
					OMDB_API_KEY
						? m(MovieTile, { name: getPostTypeName('watch') })
						: null,
					m(BookTile, { name: getPostTypeName('read') })
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
