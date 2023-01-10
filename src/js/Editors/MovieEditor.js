import m from 'mithril'

import Alert from '../Components/Alert'
import { BoxHeader } from '../Components/Box'
import Rating from '../Components/Rating'
import Proxy from '../Controllers/Proxy'

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

	const ratingToStars = () => state.rate ? '★'.repeat(state.rating) + (state.rating % 1 != 0 ? '½' : '') : ''

	const post = async (e) => {
		e.preventDefault()

		if (state.rate && !state.rating) {
			return Alert.error('missing "rating"')
		}

		const rating = ratingToStars()
		const title = `${state.rewatched ? 'Rewatched' : 'Watched'} ${state.movie.Title}, (${state.movie.Year})${rating ? ' - ' + rating : ''}`
		const properties = {
			summary: [ title ],
			featured: [ state.movie.Poster ],
			'u-watch-of': [
				{
					'type': [ 'h-cite' ],
					'properties': {
						name: [ state.movie.Title ],
						photo: [ state.movie.Poster ],
						uid: [ `imdb:${state.movie.imdbID}` ],
						url: [ `${IMDB_URL}${state.movie.imdbID}` ],
						// custom properties
						year: [ state.movie.Year ],
						rewatch: [ state.rewatched === true ],
						...(state.rate && { rating: [ state.rating ] })
					}
				}
			]
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

	let timeout, search = []
	const submitMovieSearch = async (e) => {
		e && e.preventDefault()

		timeout && clearTimeout(timeout)

		if (!state.search || state.search.trim().length < 3) return

		state.searching = true
		state.searched = false

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

	const movieInputChange = async (e) => {
		state.search = e.target.value
		timeout && clearTimeout(timeout)
		timeout = setTimeout(submitMovieSearch, 2000)
	}

	return {
		view: () =>
			m('section.sp-content.text-center', [
				m('.sp-box', [
					m(BoxHeader, {
						icon: '.fas.fa-film',
						name: 'Movie'
					}),
					m('.sp-box-content.text-center', [
						m('form', {
							onsubmit: submitMovieSearch
						}, [
							m('input', {
								type: 'text',
								placeholder: 'Search',
								oninput: e => movieInputChange(e),
								value: state.search || ''
							})
						]),
						m('div.movie-list', [
							state.searching && m('i.fas.fa-spinner.fa-spin', { 'aria-hidden': 'true' }),
							state.searched && search && search.length > 0 &&
								search.map(mv =>
									m('div.movie-tile', {
										onclick: () => state.movie = state.movie ? null : mv,
										hidden: state.movie && state.movie.imdbID != mv.imdbID
									}, m('div.movie' + (state.movie && state.movie.imdbID == mv.imdbID ? '.selected' : ''), [
										m('h4', `${mv.Title} (${mv.Year})`),
										m('img', { src: mv.Poster })
									]))),
							state.searched && (!search || search.length === 0) && m('div', 'No results found')
						]),
						state.movie && m('form', {
							onsubmit: post
						}, [
							m('label', [
								'Rewatched',
								m('input', {
									type: 'checkbox',
									onchange: e => state.rewatched = e && e.target && e.target.checked,
									checked: state.rewatched
								})
							]),
							m('label', [
								'Rate',
								m('input', {
									type: 'checkbox',
									onchange: e => state.rate = e && e.target && e.target.checked,
									checked: state.rate
								})
							]),
							state.rate && m(Rating, {
								onchange: val => state.rating = val,
								value: state.rating
							}),
							m('button', {
								type: 'submit',
								disabled: state.submitting
							}, state.submitting ? m('i.fas.fa-spinner.fa-spin', { 'aria-hidden': 'true' }) : 'Post')
						])
					])
				])
			])
	}
}

export default MovieEditor
