import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import LinkHeader from 'http-link-header'
import { isValidURL, Response, Error } from './lib/utils'

const requiredRels = ['authorization_endpoint', 'token_endpoint', 'micropub']

const getRelURL = ($, rel) => $ && rel ? $(`[rel='${rel}']`).attr('href') : null
const absoluteURL = (url, baseURL) => url ? new URL(url, baseURL).href : null

exports.handler = async e => {
	const urlString = e.queryStringParameters.url
	if (!isValidURL(urlString)) {
		return Response.error(Error.INVALID, 'Invalid URL')
	}

	try {
		const response = await fetch(urlString)
		const link = response.headers.get('link')
		const body = await response.text()
		const $ = cheerio.load(body)

		let json
		// RFC 5988
		if (link) {
			const parsedLink = LinkHeader.parse(link)
			if (Array.isArray(parsedLink?.refs)) {
				json = parsedLink.refs.reduce((map, obj) => {
					map[obj.rel] = absoluteURL(obj.uri, urlString)
					return map
				}, {})
			}
		}

		if (!json || (json && json['indieauth-metadata'])) {
			// https://indieauth.spec.indieweb.org/#discovery-by-clients
			let metadataURL
			if (!json) {
				metadataURL = absoluteURL(getRelURL($, 'indieauth-metadata'), urlString)
			}

			if (json && json['indieauth-metadata']) {
				metadataURL = json['indieauth-metadata']
			}

			if (metadataURL) {
				try {
					const res = await fetch(metadataURL)
					json = await res.json()
				} catch (err) {
					const original = err && err.message
					const message = `Could not retrieve metadata from ${metadataURL} ${original}`
					console.error('[ERROR]', message)
					return Response.error(Error.INVALID, message)
				}
			} else {
				json = {
					'authorization_endpoint': absoluteURL(getRelURL($, 'authorization_endpoint'), urlString),
					'token_endpoint': absoluteURL(getRelURL($, 'token_endpoint'), urlString),
				}
			}
		}

		if (json) {
			json['micropub'] = absoluteURL(getRelURL($, 'micropub'), urlString)
		}

		for (const k of requiredRels) {
			if (!json || !json[k]) {
				return Response.error(Error.INVALID, `Could not find rel=${k}`)
			}
		}

		return Response.success(json)
	} catch (err) {
		console.error('[ERROR]', err && err.message)
	}

	return Response.error(Error.NOT_FOUND)
}
