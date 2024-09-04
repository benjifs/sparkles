export default {
	Note: {
		title: 'Note',
		icon: '.far.fa-note-sticky',
		components: [
			// SAMPLE
			// { type: 'content', label: 'change label', required: true }
			{ type: 'content', required: true },
			{ type: 'category' }
		]
	},
	Photo: {
		title: 'Photo',
		icon: '.far.fa-image',
		components: [
			{ type: 'photo', required: true },
			{ type: 'name' },
			{ type: 'content' },
			{ type: 'category' }
		]
	},
	Article: {
		title: 'Article',
		icon: '.fas.fa-newspaper',
		components: [
			{ type: 'name', required: true },
			{ type: 'content', required: true },
			{ type: 'category' }
		]
	},
	Bookmark: {
		title: 'Bookmark',
		icon: '.far.fa-bookmark',
		components: [
			{ type: 'bookmark-of', required: true, label: 'Bookmark of', search: true },
			{ type: 'name', required: true },
			{ type: 'content' },
			{ type: 'category' }
		]
	},
	Reply: {
		title: 'Reply',
		icon: '.fas.fa-reply',
		components: [
			{ type: 'in-reply-to', required: true, label: 'Reply to', search: true },
			{ type: 'name' },
			{ type: 'content', required: true },
			{ type: 'category' }
		]
	},
	RSVP: {
		title: 'RSVP',
		icon: '.far.fa-calendar-check',
		components: [
			{ type: 'in-reply-to', required: true, label: 'RSVP to' },
			{ type: 'rsvp', required: true },
			{ type: 'content' },
			{ type: 'category' }
		]
	},
	Like: {
		title: 'Like',
		icon: '.fas.fa-heart',
		components: [
			{ type: 'like-of', required: true, label: 'Like of', search: true },
			{ type: 'name' },
			{ type: 'content' },
			{ type: 'category' }
		]
	}
}