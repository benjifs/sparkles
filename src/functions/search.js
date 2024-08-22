import fetch from 'node-fetch'

import { Error, Response } from './lib/utils'

const types = {
	movie: {
		url: 'https://api.themoviedb.org/3/search/movie',
		buildParams: ({ query, year, page }) => ({
			api_key: process.env.TMDB_API_KEY, // eslint-disable-line camelcase
			query: query,
			year: year,
			page: page
		}),
		buildError: ({ status, response }) => Response.error({ statusCode: status }, response.Error),
		parseResponse: res => ({
			totalResults: res?.total_results || 0,
			results: res?.results?.map(m => ({
				id: `tmdb:${m.id}`,
				title: m.original_title,
				image: `https://image.tmdb.org/t/p/original${m.poster_path}`,
				year: (m.release_date || '').split('-')[0],
				description: m.overview,
				url: `https://themoviedb.org/movie/${m.id}`
			}))
		})
	},
	book: {
		url: 'https://openlibrary.org/search.json',
		buildParams: ({ query, page }) => ({
			limit: 10,
			q: query,
			page: page
		}),
		buildError: ({ status, response }) => Response.error({ statusCode: status }, response.error),
		parseResponse: res => ({
			totalResults: res?.num_found || 0,
			results: res?.docs.map(b => ({
				id: `olid:${b.key.replace('/works/', '')}`,
				title: b.title,
				author: b.author_name ? b.author_name.join(', ') : '',
				image: `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`,
				year: b.first_publish_year,
				url: `https://openlibrary.org${b.key}`
			}))
		})
	},
	music: {
		url: 'https://itunes.apple.com/search',
		buildParams: ({ type, query }) => ({
			media: 'music',
			entity: type == 'artist' ? 'musicArtist' : type,
			term: query
		}),
		parseResponse: res => ({
			totalResults: res?.resultCount || 0,
			results: res?.results.map(r => ({
				id: `itunes:${r.wrapperType}:${r.trackId || r.collectionId || r.artistId}`,
				title: r.trackName || r.collectionName,
				author: r.artistName,
				image: r.artworkUrl100,
				...(r.releaseDate && { year: r.releaseDate.substr(0, 4) }),
				url: r.trackViewUrl || r.collectionViewUrl || r.artistLinkUrl
			}))
		})
	},
	game: {
		url: 'https://www.giantbomb.com/api/search/',
		buildParams: ({ query, page }) => ({
			api_key: process.env.GIANTBOMB_API_KEY, // eslint-disable-line camelcase
			limit: 10,
			format: 'json',
			resources: 'game',
			query: query,
			page: page
		}),
		buildError: ({ status, response }) => Response.error({ statusCode: status }, response.error),
		parseResponse: res => ({
			totalResults: res?.number_of_total_results || 0,
			results: res?.results.map(g => ({
				id: `gbid:${g.guid}`,
				title: g.name,
				image: g.image.original_url,
				year: g.original_release_date ? new Date(g.original_release_date).getFullYear() : null,
				url: g.site_detail_url
			}))
		})
	},
}

export const handler = async (e) => {
	const { type } = e.queryStringParameters
	if (!['movie', 'book', 'artist', 'album', 'song', 'game'].includes(type)) {
		return Response.error(Error.NOT_SUPPORTED, 'Search type not supported')
	}

	const opts = types[['artist', 'album', 'song'].includes(type) ? 'music' : type]
	const params = new URLSearchParams(opts.buildParams(e.queryStringParameters))
	const res = await fetch(`${opts.url}?${params.toString()}`)
	const response = await res.json()
	if (res.status !== 200) {
		return opts.buildError({ status: res.status, response })
	} else if (type == 'game' && response.error != 'OK') {
		return opts.buildError({ status: 400, response})
	}

	return Response.success(opts.parseResponse(response, type))
}
