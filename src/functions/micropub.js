import fetch from 'node-fetch'
import { Error, Response } from './lib/utils'

exports.handler = async e => {
	const endpoint = e.headers['x-micropub-endpoint']
	if (!endpoint) {
		return Response.error(Error.INVALID, 'Missing micropub endpoint')
	}

	const authorization = e.headers.authorization
	const params = new URLSearchParams(e.queryStringParameters)

	let body
	try {
		body = e.body ? JSON.parse(e.body) : null
	} catch {
		// return Response.error(Error.INVALID, 'Could not parse request body')
	}

	console.log(`⇒ ${e.httpMethod}: ${endpoint}`, body)
	const res = await fetch(endpoint + (Array.from(params).length > 0 ? '?' + params : ''), {
		method: e.httpMethod,
		...(body && { body: JSON.stringify(body) }),
		headers: {
			'Accept': 'application/json',
			...(authorization && { 'Authorization': authorization }),
			'Content-Type': e.headers['content-type']
		}
	})

	const response = await res.text()
	console.log(`  [${res.status}]`, res.headers, response)
	const location = res.headers.get('location')
	const contentType = res.headers.get('content-type')

	return {
		statusCode: res.status,
		headers: {
			...Response.DEFAULT_HEADERS,
			'Content-Type': contentType,
			...(location && { 'Location': location })
		},
		body: response
	}
}
