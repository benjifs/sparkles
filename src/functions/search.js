import fetch from 'node-fetch'

import { Error, Response } from './lib/utils'

const types = {
	movie: {
		url: 'https://www.omdbapi.com',
		buildParams: ({ query, year, page }) => ({
			apikey: process.env.OMDB_API_KEY,
			type: 'movie',
			s: query,
			year: year,
			page: page
		}),
		buildError: ({ status, response }) => Response.error({ statusCode: status }, response.Error),
		parseResponse: res => ({
			totalResults: res?.totalResults || 0,
			results: res?.Search?.map(m => ({
				id: `imdb:${m.imdbID}`,
				title: m.Title,
				image: m.Poster,
				year: m.Year,
				url: `https://imdb.com/title/${m.imdbID}`
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
		url: 'https://ws.audioscrobbler.com/2.0/',
		buildParams: ({ type, query, page }) => ({
			api_key: process.env.LASTFM_API_KEY,
			limit: 10,
			format: 'json',
			method: `${type}.search`,
			[type]: query,
			page: page
		}),
		buildError: ({ status, response }) => Response.error({
			statusCode: status,
			error: response.error
		}, response.message),
		parseResponse: (res, category) => ({
			totalResults: parseInt(res?.results['opensearch:totalResults'] || 0),
			results: res.results[`${category}matches`][category]
				.map(r => ({
					...(r.mbid && { id: `mbid:${r.mbid}` }),
					title: r.name,
					artist: r.artist,
					...(category == 'album' && { image: r.image?.pop()['#text'] }),
					url: r.url
				}))
		})
	},
	game: {
		url: 'https://www.giantbomb.com/api/search/',
		buildParams: ({ query, page }) => ({
			api_key: process.env.GIANTBOMB_API_KEY,
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
	if (!['movie', 'book', 'artist', 'album', 'track', 'game'].includes(type)) {
		return Response.error(Error.NOT_SUPPORTED, 'Search type not supported')
	}

	const opts = types[['artist', 'album', 'track'].includes(type) ? 'music' : type]
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
