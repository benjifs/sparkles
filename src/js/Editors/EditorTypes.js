export default {
	Note: {
		title: 'Note',
		icon: 'note',
		components: [
			// SAMPLE
			// { type: 'content', label: 'change label', required: true }
			{ type: 'content', required: true },
			{ type: 'category' }
		]
	},
	Photo: {
		title: 'Photo',
		icon: 'image',
		components: [
			{ type: 'photo', required: true },
			{ type: 'name' },
			{ type: 'content' },
			{ type: 'category' }
		]
	},
	Article: {
		title: 'Article',
		icon: 'article',
		components: [
			{ type: 'name', required: true },
			{ type: 'content', required: true },
			{ type: 'category' }
		]
	},
	Bookmark: {
		title: 'Bookmark',
		icon: 'bookmark-simple',
		components: [
			{ type: 'bookmark-of', required: true, label: 'Bookmark of', search: true },
			{ type: 'name', required: true },
			{ type: 'content' },
			{ type: 'category' }
		]
	},
	Reply: {
		title: 'Reply',
		icon: 'arrow-bend-up-left',
		components: [
			{ type: 'in-reply-to', required: true, label: 'Reply to' },
			{ type: 'content', required: true },
			{ type: 'category' }
		]
	},
	RSVP: {
		title: 'RSVP',
		icon: 'calendar-check',
		components: [
			{ type: 'in-reply-to', required: true, label: 'RSVP to' },
			{ type: 'rsvp', required: true },
			{ type: 'content' },
			{ type: 'category' }
		]
	},
	Like: {
		title: 'Like',
		icon: 'heart',
		components: [
			{ type: 'like-of', required: true, label: 'Like of', search: true },
			{ type: 'name' },
			{ type: 'content' },
			{ type: 'category' }
		]
	}
}