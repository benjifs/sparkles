import fetch from 'node-fetch'
import { isValidURL, Error, Response } from './lib/utils'

exports.handler = async e => {
	const { url } = e.queryStringParameters

	if (!isValidURL(url)) {
		return Response.error(Error.INVALID, 'Invalid URL')
	}

	const res = await fetch(url)
	return {
		statusCode: res.status,
		body: res.status === 200 ? 'success' : 'not found'
	}
}
