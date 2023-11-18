import m from 'mithril'

import Tile from '../Components/Tile'

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY

const NoteTile = {
	view: ({ attrs }) => m(Tile, {
		href: '/new/note',
		icon: '.far.fa-note-sticky',
		name: attrs?.name || 'Note'
	})
}

const ArticleTile = {
	view: ({ attrs }) => m(Tile, {
		href: '/new/article',
		icon: '.fas.fa-newspaper',
		name: attrs?.name || 'Article'
	})
}

const LikeTile = {
	view: ({ attrs }) =>
		m(Tile, {
			href: `/new/like${attrs.params ? '?' + attrs.params : ''}`,
			icon: '.fas.fa-heart',
			name: attrs?.name || 'Like'
		})
}

const ReplyTile = {
	view: ({ attrs }) =>
		m(Tile, {
			href: `/new/reply${attrs.params ? '?' + attrs.params : ''}`,
			icon: '.fas.fa-reply',
			name: attrs?.name || 'Reply'
		})
}

const ImageTile = {
	view: () => m(Tile, {
		href: '/new/image',
		icon: '.far.fa-image',
		name: 'Image'
	})
}

const RSVPTile = {
	view: ({ attrs }) => m(Tile, {
		href: `/new/rsvp${attrs.params ? '?' + attrs.params : ''}`,
		icon: '.far.fa-calendar-check',
		name: attrs?.name || 'RSVP'
	})
}

const BookmarkTile = {
	view: ({ attrs }) =>
		m(Tile, {
			href: `/new/bookmark${attrs.params ? '?' + attrs.params : ''}`,
			icon: '.far.fa-bookmark',
			name: attrs?.name || 'Bookmark'
		})
}

const RecipeTile = {
	view: ({ attrs }) => m(Tile, {
		href: '/new/recipe',
		icon: '.fas.fa-utensils',
		name: attrs?.name || 'Recipe',
		disabled: true
	})
}

const MovieTile = {
	view: ({ attrs }) => m(Tile, {
		href: '/new/movie',
		icon: '.fas.fa-film',
		name: attrs?.name || 'Movie'
	})
}

const BookTile = {
	view: ({ attrs }) => m(Tile, {
		href: '/new/book',
		icon: '.fas.fa-book',
		name: attrs?.name || 'Book'
	})
}

const PostTypes = {
	note: NoteTile,
	image: ImageTile,
	reply: ReplyTile,
	bookmark: BookmarkTile,
	like: LikeTile,
	article: ArticleTile,
	rsvp: RSVPTile,
	watch: OMDB_API_KEY ? MovieTile : null,
	read: BookTile
}

const Tiles = (types, defaultTiles) => {
	if (!defaultTiles || !defaultTiles.length) {
		defaultTiles = [ 'note', 'image', 'reply', 'bookmark', 'like', 'article', 'rsvp', 'watch', 'read' ]
	}
	if (!types || !types.length) {
		types = defaultTiles.map(t => ({ type: t }))
	}
	const tiles = types
		.filter(pt => PostTypes[pt.type] && defaultTiles.includes(pt.type))
		.map(pt => m(PostTypes[pt.type], { name: pt.name })) || []

	return {
		view: () =>
			tiles && tiles.length ? m('.sp-tiles', tiles) : [
				m('h3', 'no available tiles'),
				m('p', [
					'unsupported post types ',
					m('a', { href: 'https://github.com/indieweb/micropub-extensions/issues/1', target: '_blank' },
					m('i.far.fa-circle-question', { title: 'query for supported vocabulary discussion' }))
				])
			]
	}
}

export default Tiles
