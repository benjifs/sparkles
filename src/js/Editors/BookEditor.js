import m from 'mithril'

import Alert from '../Components/Alert'
import { Box } from '../Components/Box'
import { Modal } from '../Components/Modal'
import Rating from '../Components/Rating'
import Proxy from '../Controllers/Proxy'
import { dateInRFC3339, ratingToStars } from '../utils'

const OPENLIBRARY_URL = 'https://openlibrary.org'
const PROGRESS_OPTIONS = [
	{ key: 'want', label: 'Want to Read' },
	{ key: 'started', label: 'Reading' },
	{ key: 'finished', label: 'Read' }
]
const DEFAULT_PROGRESS = 'finished'

const getStatusForProgress = key => PROGRESS_OPTIONS.find(p => p.key == key).label

const getOpenLibraryImage = id => id ? `https://covers.openlibrary.org/b/id/${id}-M.jpg` : ''

const BookEditor = () => {
	let state = {
		progress: DEFAULT_PROGRESS
	}

	const buildEntry = () => {
		const rating = ratingToStars()
		const status = getStatusForProgress(state.progress)
		if (!status) return Alert.error('invalid "status" selected')
		const shouldRate = state.progress == DEFAULT_PROGRESS

		const authors = state.book.author_name.join(', ')
		const summary = `${status}: ${state.book.title} by ${authors}${shouldRate && rating ? ' - ' + rating : ''}`

		const image = getOpenLibraryImage(state.book.cover_i)

		const properties = {
			summary: [ summary ],
			featured: [ image ],
			...(shouldRate && { published: [ state.published || dateInRFC3339() ] }),
			...(shouldRate && state.content && { content: [ state.content ] }),
			'read-of': [
				{
					'type': [ 'h-cite' ],
					'properties': {
						name: [ state.book.title ],
						author: [ authors ],
						photo: [ image ],
						uid: [ `olid:${state.book.key.replace('/works/', '')}` ],
						url: [ `${OPENLIBRARY_URL}${state.book.key}` ],
						published: [ state.book.first_publish_year ]
					}
				}
			],
			// custom properties
			progress: [ state.progress ],
			...(shouldRate && state.rating > 0 && { rating: [ state.rating ] }),
		}

		return {
			type: [ 'h-entry' ],
			properties: properties
		}
	}

	const post = async (e) => {
		e.preventDefault()

		const entry = buildEntry()
		if (!entry) return
		state.submitting = true
		const res = await Proxy.micropub({
			method: 'POST',
			body: entry
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

	let timeout, search = []
	const submitSearch = async (e) => {
		e && e.preventDefault()

		timeout && clearTimeout(timeout)

		if (!state.search || state.search.trim().length < 3) return

		state.searching = true
		state.searched = false
		state.book = null

		const res = await m.request({
			method: 'GET',
			url: `${OPENLIBRARY_URL}/search.json?q=${state.search}&limit=10`
		})

		if (res && res.num_found > 0) {
			search = res.docs
		} else {
			Alert.error(res && res.Error)
			search = null
		}

		state.searching = false
		state.searched = true
	}

	const inputChange = async (e) => {
		state.search = e.target.value
		timeout && clearTimeout(timeout)
		timeout = setTimeout(submitSearch, 2000)
	}

	return {
		view: () =>
			m(Box, {
				icon: '.fas.fa-book',
				title: 'Book'
			}, [
				m('form', {
					onsubmit: submitSearch
				}, [
					m('input', {
						type: 'text',
						placeholder: 'Search',
						oninput: e => inputChange(e),
						value: state.search || ''
					})
				]),
				m('div.item-list.text-center', [
					state.searching && m('i.fas.fa-spinner.fa-spin', { 'aria-hidden': 'true' }),
					state.searched && search && search.length > 0 &&
						search.map(b =>
							m('div.item-tile', {
								onclick: () => state.book = state.book ? null : b,
								hidden: state.book && state.book.key != b.key
							}, m('div.item' + (state.book && state.book.key == b.key ? '.selected' : ''), [
								m('img', { src: getOpenLibraryImage(b.cover_i) }),
								m('div', [
									m('h4', b.title),
									m('h5', b.author_name ? b.author_name.join(', ') : '')
								])
							]))),
					state.searched && (!search || search.length === 0) && m('div', 'No results found')
				]),
				state.book && m('form', {
					onsubmit: post
				}, [
					m('label', [
						'Status',
						m('select', {
							oninput: e => state.progress = e.target.value,
							value: state.progress = state.progress || DEFAULT_PROGRESS
						}, PROGRESS_OPTIONS.map(({key, label}) => m('option', { value: key }, label)))
					]),
					state.progress == DEFAULT_PROGRESS && [
						m('label', [
							'Read on:',
							m('input', {
								type: 'date',
								onchange: e => state.published = e.target.value,
								value: state.published || dateInRFC3339()
							})
						]),
						m('div.label', [
							'Rate',
							m(Rating, {
								onchange: val => state.rating = val,
								value: state.rating
							})
						]),
						m('textarea', {
							rows: 3,
							placeholder: 'Add your review...',
							oninput: e => state.content = e.target.value,
							value: state.content || ''
						})
					],
					m('div.text-center', m('button', {
						type: 'submit',
						disabled: state.submitting
					}, state.submitting ? m('i.fas.fa-spinner.fa-spin', { 'aria-hidden': 'true' }) : 'Post')),
					m('div.text-center', m('a', {
						onclick: () => Modal(m('pre', JSON.stringify(buildEntry(), null, 4)))
					}, 'preview'))
				])
			])
	}
}

export default BookEditor
