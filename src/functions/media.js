import fetch from 'node-fetch'
import { Error, Response } from './lib/utils'

exports.handler = async e => {
	const endpoint = e.headers['x-media-endpoint']
	if (!endpoint) {
		return Response.error(Error.INVALID, 'Missing media-endpoint')
	}

	const authorization = e.headers.authorization
	const params = new URLSearchParams(e.queryStringParameters)

	let body
	if (e.body) {
		if (e.headers['content-type'] === 'application/json') {
			try {
				body = e.body ? JSON.parse(e.body) : null
			} catch (err) {
				// return Response.error(Error.INVALID, 'Could not parse request body')
			}
		} else if (e.headers['content-type'].indexOf('multipart/form-data') >= 0) {
			body = Buffer.from(e.body, 'base64')
		}
	}

	const res = await fetch(endpoint + (Array.from(params).length > 0 ? '?' + params : ''), {
		method: e.httpMethod,
		body: body,
		headers: {
			...(authorization && { 'Authorization': authorization }),
			...(body && { 'Content-Type': e.headers['content-type'] })
		}
	})

	console.log(`⇒ [${res.status}]`, res.headers)
	const location = res.headers.get('location')

	return {
		statusCode: res.status,
		headers: {
			...Response.DEFAULT_HEADERS,
			...(location && { 'Location': location })
		},
		body: await res.text()
	}
}
