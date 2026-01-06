import fetch from 'node-fetch'

import { Error as ErrorMessage, Response } from './lib/utils'

import tmdb from './providers/movies/tmdb'
import openLibrary from './providers/books/openLibrary'
import appleMusic from './providers/music/appleMusic'
import igdb from './providers/games/igdb'

const providers = {
	movie: tmdb,
	book: openLibrary,
	artist: appleMusic,
	album: appleMusic,
	song: appleMusic,
	game: igdb,
}

export const handler = async (e) => {
	const { type } = e.queryStringParameters
	const provider = providers[type]
	if (!provider) return Response.error(ErrorMessage.NOT_SUPPORTED, 'Search type not supported')

	try {
		const req = await provider.buildRequest(e.queryStringParameters)
		const res = await fetch(req.url, req.options)
		const json = await res.json()
		if (!res.ok) throw new Error(provider.handleError(res.status, json))
		return Response.success(provider.parseResponse(json, e.queryStringParameters))
	} catch (e) {
		return Response.error(ErrorMessage.INVALID, e.message)
	}
}
