import m from 'mithril'

import Tile from '../Components/Tile'

const NoteTile = {
	view: () => m(Tile, {
		href: '/new/note',
		icon: '.far.fa-note-sticky',
		name: 'Note'
	})
}

const ArticleTile = {
	view: () => m(Tile, {
		href: '/new/article',
		icon: '.fas.fa-newspaper',
		name: 'Article'
	})
}

const LikeTile = {
	view: ({ attrs }) =>
		m(Tile, {
			href: `/new/like${attrs.params ? '?' + attrs.params : ''}`,
			icon: '.fas.fa-heart',
			name: 'Like'
		})
}

const ReplyTile = {
	view: ({ attrs }) =>
		m(Tile, {
			href: `/new/reply${attrs.params ? '?' + attrs.params : ''}`,
			icon: '.fas.fa-reply',
			name: 'Reply'
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
		name: 'RSVP'
	})
}

const BookmarkTile = {
	view: ({ attrs }) =>
		m(Tile, {
			href: `/new/bookmark${attrs.params ? '?' + attrs.params : ''}`,
			icon: '.far.fa-bookmark',
			name: 'Bookmark'
		})
}

const RecipeTile = {
	view: () => m(Tile, {
		href: '/new/recipe',
		icon: '.fas.fa-utensils',
		name: 'Recipe',
		disabled: true
	})
}

const MovieTile = {
	view: () => m(Tile, {
		href: '/new/movie',
		icon: '.fas.fa-film',
		name: 'Movie'
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
	MovieTile
}
