import m from 'mithril'

import Alert from '../Components/Alert'
import { Box } from '../Components/Box'
import Proxy from '../Controllers/Proxy'
import Store from '../Models/Store'

const EditorTypes = {
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
			{ type: 'bookmark-of', required: true },
			{ type: 'name', required: true },
			{ type: 'content' },
			{ type: 'category' }
		]
	},
	Reply: {
		title: 'Reply',
		icon: '.fas.fa-reply',
		components: [
			{ type: 'in-reply-to', required: true },
			{ type: 'content', required: true },
			{ type: 'category' }
		]
	},
	RSVP: {
		title: 'RSVP',
		icon: '.far.fa-calendar-check',
		components: [
			{ type: 'in-reply-to', label: 'RSVP to', required: true },
			{ type: 'rsvp', required: true },
			{ type: 'content' },
			{ type: 'category' }
		]
	},
	Like: {
		title: 'Like',
		icon: '.fas.fa-heart',
		components: [
			{ type: 'like-of', required: true },
			{ type: 'category' }
		]
	}
}

const Editor = ({ attrs }) => {
	const parameterList = new URLSearchParams(window.location.search)
	const postTypes = Store.getSession('post-types') || []
	const params = {
		title: parameterList.get('title'),
		text: parameterList.get('text'),
		url: parameterList.get('url'),
		image: parameterList.get('image')
	}

	const syndicateTo = Store.getSession('syndicate-to') || []

	let state = {}
	// Init state
	for (const c of attrs.components) {
		if (c.type === 'name') {
			state[c.type] = params.title || ''
		} else if (['bookmark-of', 'in-reply-to', 'like-of'].includes(c.type)) {
			state[c.type] = params.url || ''
		}
	}
	if (params.image) {
		state.content = `![](${params.image.replace(' ', '%20')})`
	}

	const post = async (e) => {
		e.preventDefault()

		let properties = {}

		const mpSyndicateTo = e.target.querySelectorAll('.mp-syndicate-to')
		if (mpSyndicateTo) {
			state['mp-syndicate-to'] = [...mpSyndicateTo]
				.filter(element => element.checked)
				.map(element => element.value)
		}

		for (const [key, value] of Object.entries(state)) {
			if (key != 'category' && value && value.length) {
				properties[key] = Array.isArray(value) ? value : [ value ]
			}
		}
		if (state.category) {
			// Split by comma, trim whitespace and get rid of empty items from array
			const categories = state.category.split(',').map(c => c.trim()).filter(c => c)
			if (categories && categories.length > 0) {
				properties.category = categories
			}
		}

		// Just in case?
		for (const c of attrs.components) {
			if (c.required && !properties[c.type]) {
				return Alert.error(`missing "${c.type}"`)
			}
		}

		state.submitting = true

		const res = await Proxy.micropub({
			method: 'POST',
			body: {
				type: [ 'h-entry' ],
				properties: properties
			}
		})

		state.submitting = false
		if (res && res.status === 201) {
			if (res.headers.location) {
				m.route.set('/success?url=' + res.headers.location)
			} else {
				Alert.error('location header missing')
			}
		} else if (!res || res.status >= 400) {
			Alert.error(res)
		}
	}

	const postType = postTypes.find(item => item.type == attrs.title.toLowerCase())

	return {
		view: () =>
			m(Box, {
				icon: attrs.icon, // '.far.fa-note-sticky',
				title: postType?.name || attrs.title // 'Note'
			}, m('form', {
				onsubmit: post
			}, [
				attrs.components && attrs.components.map(c => {
					switch(c.type) {
					case 'name':
						return m('input', {
							type: 'text',
							placeholder: c.label || 'Title',
							oninput: e => state[c.type] = e.target.value,
							value: state[c.type] || '',
							required: c.required
						})
					case 'content':
						return m('textarea', {
							rows: 5,
							placeholder: c.label || 'Content goes here...',
							oninput: e => state[c.type] = e.target.value,
							value: state[c.type] || '',
							required: c.required
						})
					case 'bookmark-of':
						return m('input', {
							type: 'url',
							placeholder: c.label || 'Bookmark of',
							oninput: e => state[c.type] = e.target.value,
							value: state[c.type] || '',
							required: c.required
						})
					case 'in-reply-to':
						return m('input', {
							type: 'url',
							placeholder: c.label || 'Reply to',
							oninput: e => state[c.type] = e.target.value,
							value: state[c.type] || '',
							required: c.required
						})
					case 'like-of':
						return m('input', {
							type: 'url',
							placeholder: c.label || 'Like of',
							oninput: e => state[c.type] = e.target.value,
							value: state[c.type] || '',
							required: c.required
						})
					case 'rsvp':
						return m('select', {
							oninput: e => state[c.type] = e.target.value,
							value: state[c.type] = state[c.type] || 'yes',
							required: c.required
						}, [
							['yes', 'no', 'maybe', 'interested']
								.map(o => m('option', { value: o }, o))
						])
					case 'category':
						return m('input', {
							type: 'text',
							placeholder: 'Tags',
							oninput: e => state[c.type] = e.target.value,
							value: state[c.type] || '',
							required: c.required
						})
					}
				}),
				m('details',
					m('summary', 'Advanced'),
					m('ul', [
						// https://github.com/indieweb/micropub-extensions/issues/19
						m('li', m('label', [
							'status',
							m('select', {
								oninput: e => state['post-status'] = e.target.value,
								value: state['post-status'] || ''
							},
							['', 'published', 'draft']
								.map(o => m('option', { value: o }, o)))
						])),
						// https://github.com/indieweb/micropub-extensions/issues/11
						m('li', m('label', [
							'visibility',
							m('select', {
								oninput: e => state['visibility'] = e.target.value,
								value: state['visibility'] || ''
							},
							['', 'public', 'unlisted', 'private']
								.map(o => m('option', { value: o }, o)))
						]))
					]),
					syndicateTo && syndicateTo.length > 0 && [
						m('h5', 'Syndication Targets'),
						m('ul', [
							syndicateTo.map(s =>
								m('li', [
									m('label', [
										s.name,
										m('input.mp-syndicate-to', {
											type: 'checkbox',
											checked: s.checked,
											value: s.uid,
											onchange: e => s.checked = e.target.checked
										})
									])
								]))
						])
					]
				),
				m('div.text-center', m('button', {
					type: 'submit',
					disabled: state.submitting
				}, state.submitting ? m('i.fas.fa-spinner.fa-spin', { 'aria-hidden': 'true' }) : 'Post'))
			]))
	}
}

const NoteEditor = { view: () => m(Editor, EditorTypes.Note) }
const ArticleEditor = { view: () => m(Editor, EditorTypes.Article) }
const BookmarkEditor = { view: () => m(Editor, EditorTypes.Bookmark) }
const ReplyEditor = { view: () => m(Editor, EditorTypes.Reply) }
const RSVPEditor = { view: () => m(Editor, EditorTypes.RSVP) }
const LikeEditor = { view: () => m(Editor, EditorTypes.Like) }

export {
	NoteEditor,
	ArticleEditor,
	BookmarkEditor,
	ReplyEditor,
	RSVPEditor,
	LikeEditor
}
