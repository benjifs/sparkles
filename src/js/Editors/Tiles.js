import m from 'mithril'

import Tile from '../Components/Tile'

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

export {
	NoteTile,
	ArticleTile,
	ReplyTile,
	BookmarkTile,
	LikeTile,
	ImageTile,
	RSVPTile,
	RecipeTile,
	MovieTile,
	BookTile
}
