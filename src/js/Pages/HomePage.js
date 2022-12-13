import m from 'mithril'

import { fetchMicropubConfig } from '../Controllers/Helpers'
import {
	NoteTile,
	ImageTile,
	ReplyTile,
	BookmarkTile,
	LikeTile,
	ArticleTile,
	RSVPTile,
	MovieTile
} from '../Editors/Tiles'
import Store from '../Models/Store'

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY

const HomePage = () => {
	const me = Store.getMe()

	return {
		oninit: () => fetchMicropubConfig(),
		view: () => [
			m('section.text-center', [
				m('.sp-box', [
					m('.sp-tiles.sp-box-content', [
						m(NoteTile),
						m(ImageTile),
						m(ReplyTile),
						m(BookmarkTile),
						m(LikeTile),
						m(ArticleTile),
						m(RSVPTile),
						OMDB_API_KEY ? m(MovieTile) : null
					])
				])
			]),
			m('section', [
				m('p', [
					'Logged in as ',
					m('a', { href: me }, me),
					' ',
					m(m.route.Link, { href: '/logout' }, m('i.fas.fa-right-from-bracket', { title: 'logout' }))
				])
			])
		]
	}
}

export default HomePage
