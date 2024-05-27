import fetch from 'node-fetch'

import { isValidURL, Response, Error } from './lib/utils'

export const handler = async (e) => {
	const { url } = e.queryStringParameters
	if (!isValidURL(url)) {
		return Response.error(Error.INVALID, 'Invalid URL')
	}

	try {
		const res = await fetch(`https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}`)
		if (res.status == 200) {
			const response = await res.json()
			return Response.success({
				id: response.entityUniqueId,
				url: response.pageUrl
			})
		}
		return Response.error({ statusCode: res.status }, res.statusText)
	} catch (e) {
		console.error('[ERROR]', err && err.message)
	}

	return Response.error(Error.INVALID)
}
