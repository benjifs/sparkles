import m from 'mithril'

import Alert from '../Components/Alert'
import { Box } from '../Components/Box'
import Icon from '../Components/Icon'
import EntryPreview from './EntryPreview'
import AdvancedOptions from './AdvancedOptions'
import Proxy from '../Controllers/Proxy'
import Store from '../Models/Store'
import FormCache from '../Models/FormCache'
import EditorTypes from './EditorTypes'

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
	const mediaEndpoint = Store.getSession('media-endpoint')

	let state = {}
	// Init state
	state['mp-syndicate-to'] = syndicateTo
		.filter(element => element.checked)
		.map(element => element.uid)
	for (const c of attrs.components) {
		if (c.type === 'name') {
			state[c.type] = params.title || ''
		} else if (['bookmark-of', 'in-reply-to', 'like-of'].includes(c.type)) {
			state[c.type] = params.url || ''
		}
	}
	if (params.image) {
		state.photo = params.image
		const cacheable = ['name', 'alt', 'content', 'category']
		cacheable.forEach(key => state[key] = FormCache.get(key))
	} else {
		FormCache.clear()
	}

	const buildEntry = () => {
		let properties = {}

		for (const [key, value] of Object.entries(state)) {
			if (!['category', 'alt', 'photo'].includes(key) && value && value.length) {
				properties[key] = Array.isArray(value) ? value : [ value ]
			}
		}
		if (state.photo) {
			properties.photo = [
				state.alt ? {
					value: state.photo,
					alt: state.alt
				} : state.photo
			]
		}
		if (state.category) {
			// Split by comma, trim whitespace and get rid of empty items from array
			const categories = state.category.split(',').map(c => c.trim()).filter(c => c)
			if (categories && categories.length > 0) {
				properties.category = categories
			}
		}
		return {
			type: [ 'h-entry' ],
			properties: properties
		}
	}

	const post = async (e) => {
		e && e.preventDefault()

		const entry = buildEntry()
		// Just in case?
		for (const c of attrs.components) {
			if (c.required && !entry.properties[c.type]) {
				return Alert.error(`missing "${c.type}"`)
			}
		}
		state.submitting = true
		const res = await Proxy.micropub({
			method: 'POST',
			body: entry
		})

		state.submitting = false
		if (res && [201, 202].includes(res.status)) {
			if (res.headers.location) {
				m.route.set('/success?url=' + res.headers.location)
			} else {
				Alert.error('location header missing')
			}
		} else if (!res || res.status >= 400) {
			Alert.error(res)
		} else {
			console.error(res.status, res)
		}
	}

	const postType = postTypes.find(item => item.type == attrs.title.toLowerCase())

	const handleInput = (key, value) => {
		state[key] = value
		FormCache.put(key, value)
	}

	return {
		view: () =>
			m(Box, {
				icon: attrs.icon, // 'note',
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
							oninput: e => handleInput(c.type, e.target.value),
							value: state[c.type] || '',
							required: c.required
						})
					case 'photo':
						return m('ul', [
							m('li', [
								m('input', {
									type: 'url',
									placeholder: c.label || 'Photo URL',
									oninput: e => state[c.type] = e.target.value,
									value: state[c.type] || '',
									required: c.required
								}),
								m(m.route.Link, {
									selector: 'button.xs',
									href: '/new/image',
									disabled: !mediaEndpoint,
									title: !mediaEndpoint ? 'media-endpoint not found' : 'upload'
								}, m(Icon, { name: 'cloud-arrow-up', label: 'upload' }))
							]),
							m('li', m('input', {
								type: 'text',
								placeholder: 'Alt text',
								oninput: e => handleInput('alt', e.target.value),
								value: state.alt || ''
							}))
						])
					case 'content':
						return m('textarea', {
							rows: 5,
							placeholder: c.label || 'Content goes here...',
							oninput: e => handleInput(c.type, e.target.value),
							value: state[c.type] || '',
							required: c.required
						})
					case 'bookmark-of':
					case 'in-reply-to':
					case 'like-of':
						return m('ul', [
							m('li', [
								m('input', {
									type: 'url',
									placeholder: c.label || 'URL',
									oninput: e => state[c.type] = e.target.value,
									value: state[c.type] || '',
									required: c.required
								}),
								c.search && m('button', {
									class: 'xs',
									title: 'fetch title',
									onclick: async (e) => {
										e && e.preventDefault()
										state.fetching = true
										try {
											const res = await m
												.request({
													method: 'GET',
													url: '/api/opengraph',
													params: { url: state[c.type] }
												})
											state.name = res.title
										} catch(err) {
											Alert.error(err)
										}
										state.fetching = false
									},
									disabled: !state[c.type] || state.fetching
								}, state.fetching ? m(Icon, { name: 'spinner', className: 'spin' }) : m(Icon, { name: 'magnifying-glass', label: 'get page title' }))
							])
						])
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
							oninput: e => handleInput(c.type, e.target.value),
							value: state[c.type] || '',
							required: c.required
						})
					}
				}),
				m(AdvancedOptions, {
					state: state,
					syndicateTo: syndicateTo,
					onchange: (key, val) => state[key] = val
				}),
				m('div.text-center', m('button', {
					type: 'submit',
					disabled: state.submitting
				}, state.submitting ? m(Icon, { name: 'spinner', clasName: 'spin' }) : 'Post')),
				m(EntryPreview, { buildPreview: buildEntry })
			]))
	}
}

const NoteEditor = { view: () => m(Editor, EditorTypes.Note) }
const PhotoEditor = { view: () => m(Editor, EditorTypes.Photo) }
const ArticleEditor = { view: () => m(Editor, EditorTypes.Article) }
const BookmarkEditor = { view: () => m(Editor, EditorTypes.Bookmark) }
const ReplyEditor = { view: () => m(Editor, EditorTypes.Reply) }
const RSVPEditor = { view: () => m(Editor, EditorTypes.RSVP) }
const LikeEditor = { view: () => m(Editor, EditorTypes.Like) }

export {
	NoteEditor,
	PhotoEditor,
	ArticleEditor,
	BookmarkEditor,
	ReplyEditor,
	RSVPEditor,
	LikeEditor
}
