import m from 'mithril'

import Icon from '../Components/Icon'
import Tile from '../Components/Tile'

const NoteTile = {
	view: ({ attrs }) => m(Tile, {
		href: '/new/note',
		icon: 'note',
		name: attrs?.name || 'Note'
	})
}

const ArticleTile = {
	view: ({ attrs }) => m(Tile, {
		href: '/new/article',
		icon: 'article',
		name: attrs?.name || 'Article'
	})
}

const LikeTile = {
	view: ({ attrs }) =>
		m(Tile, {
			href: `/new/like${attrs.params ? '?' + attrs.params : ''}`,
			icon: 'heart',
			name: attrs?.name || 'Like'
		})
}

const ReplyTile = {
	view: ({ attrs }) =>
		m(Tile, {
			href: `/new/reply${attrs.params ? '?' + attrs.params : ''}`,
			icon: 'arrow-bend-up-left',
			name: attrs?.name || 'Reply'
		})
}

const PhotoTile = {
	view: () => m(Tile, {
		href: '/new/photo',
		icon: 'image',
		name: 'Photo'
	})
}

const RSVPTile = {
	view: ({ attrs }) => m(Tile, {
		href: `/new/rsvp${attrs.params ? '?' + attrs.params : ''}`,
		icon: 'calendar-check',
		name: attrs?.name || 'RSVP'
	})
}

const BookmarkTile = {
	view: ({ attrs }) =>
		m(Tile, {
			href: `/new/bookmark${attrs.params ? '?' + attrs.params : ''}`,
			icon: 'bookmark-simple',
			name: attrs?.name || 'Bookmark'
		})
}

const MovieTile = {
	view: ({ attrs }) => m(Tile, {
		href: '/new/movie',
		icon: 'film-strip',
		name: attrs?.name || 'Movie'
	})
}

const BookTile = {
	view: ({ attrs }) => m(Tile, {
		href: '/new/book',
		icon: 'books',
		name: attrs?.name || 'Book'
	})
}

const ListenTile = {
	view: ({ attrs }) => m(Tile, {
		href: '/new/listen',
		icon: 'music-notes',
		name: attrs?.name || 'Listen'
	})
}

const GameTile = {
	view: ({ attrs }) => m(Tile, {
		href: '/new/game',
		icon: 'game-controller',
		name: attrs?.name || 'Game'
	})
}

const PostTypes = {
	note: NoteTile,
	photo: PhotoTile,
	reply: ReplyTile,
	bookmark: BookmarkTile,
	like: LikeTile,
	article: ArticleTile,
	rsvp: RSVPTile,
	watch: MovieTile,
	read: BookTile,
	listen: ListenTile,
	game: GameTile
}

const Tiles = (types, defaultTiles, params) => {
	if (!defaultTiles || !defaultTiles.length) {
		defaultTiles = [ 'note', 'photo', 'reply', 'bookmark', 'like', 'article', 'rsvp', 'watch', 'read', 'listen', 'game' ]
	}
	if (!types || !types.length) {
		types = defaultTiles.map(t => ({ type: t }))
	}
	const tiles = types
		.filter(pt => PostTypes[pt.type] && defaultTiles.includes(pt.type))
		.map(pt => m(PostTypes[pt.type], { name: pt.name, params })) || []

	return {
		view: () =>
			tiles && tiles.length ? m('.sp-tiles', tiles) : [
				m('h3', 'no available tiles'),
				m('p', [
					'unsupported post types ',
					m('a', {
						href: 'https://github.com/indieweb/micropub-extensions/issues/1',
						target: '_blank',
						title: 'query for supported vocabulary discussion'
					 }, m(Icon, { name: 'question', })),
				])
			]
	}
}

export default Tiles
