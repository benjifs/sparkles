import fetch from 'node-fetch'

import { Error, Response } from './lib/utils'

import tmdb from './providers/movies/tmdb'
import openLibrary from './providers/books/openLibrary'
import appleMusic from './providers/music/appleMusic'
import giantBomb from './providers/games/giantBomb'

const types = {
	movie: tmdb,
	book: openLibrary,
	music: appleMusic,
	game: giantBomb,
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
	const error = opts.handleError(res.status, response)
	if (error) return Response.error({ statusCode: error.statusCode }, error.description)

	return Response.success(opts.parseResponse(response, type))
}
