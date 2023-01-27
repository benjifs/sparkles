import m from 'mithril'

import Alert from '../Components/Alert'
import { Box } from '../Components/Box'
import { Modal } from '../Components/Modal'
import Rating from '../Components/Rating'
import Proxy from '../Controllers/Proxy'
import { dateInRFC3339, ratingToStars } from '../utils'

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY
const IMDB_URL = 'https://imdb.com/title/'

const MovieEditor = () => {
	if (!OMDB_API_KEY) {
		return {
			view: () =>
				m('p', [
					'missing environment variable: ',
					m('code', 'VITE_OMDB_API_KEY')
				])
		}
	}

	let state = {}

	const buildEntry = () => {
		const rating = ratingToStars(state.rating)
		const summary = `${state.rewatched ? 'Rewatched' : 'Watched'} ${state.movie.Title}, (${state.movie.Year})${rating ? ' - ' + rating : ''}`
		const properties = {
			summary: [ summary ],
			featured: [ state.movie.Poster ],
			published: [ state.published || dateInRFC3339() ],
			...(state.content && { content: [ state.content ] }),
			'u-watch-of': [
				{
					'type': [ 'h-cite' ],
					'properties': {
						name: [ state.movie.Title ],
						photo: [ state.movie.Poster ],
						uid: [ `imdb:${state.movie.imdbID}` ],
						url: [ `${IMDB_URL}${state.movie.imdbID}` ],
						published: [ state.movie.Year ],
					}
				}
			],
			// custom properties
			...(state.rating > 0 && { rating: [ state.rating ] }),
			rewatch: [ state.rewatched === true ]
		}

		return {
			type: [ 'h-entry' ],
			properties: properties
		}
	}

	const post = async (e) => {
		e.preventDefault()

		const entry = buildEntry()
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
		state.movie = null

		const res = await m.request({
			method: 'GET',
			url: `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${state.search}&type=movie`
		})

		if (res && res.Response === 'True') {
			search = res.Search
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
				icon: '.fas.fa-film',
				title: 'Movie'
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
						search.map(mv =>
							m('div.item-tile', {
								onclick: () => state.movie = state.movie ? null : mv,
								hidden: state.movie && state.movie.imdbID != mv.imdbID
							}, m('div.item' + (state.movie && state.movie.imdbID == mv.imdbID ? '.selected' : ''), [
								m('h4', `${mv.Title} (${mv.Year})`),
								m('img', { src: mv.Poster })
							]))),
					state.searched && (!search || search.length === 0) && m('div', 'No results found')
				]),
				state.movie && m('form', {
					onsubmit: post
				}, [
					m('label', [
						'Watched on:',
						m('input', {
							type: 'date',
							onchange: e => state.published = e.target.value,
							value: state.published || dateInRFC3339()
						})
					]),
					m('label', [
						'Rewatched',
						m('input', {
							type: 'checkbox',
							onchange: e => state.rewatched = e && e.target && e.target.checked,
							checked: state.rewatched
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
					}),
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

export default MovieEditor
