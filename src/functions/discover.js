import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { isValidURL, Response, Error } from './lib/utils'

const requiredRels = ['authorization_endpoint', 'token_endpoint', 'micropub']

const getRelURL = ($, rel) => $ && rel ? $(`[rel='${rel}']`).attr('href') : null
const absoluteURL = (url, baseURL) => url && !url.match(/^https?:\/\//) ? `${baseURL}${url}` : url

exports.handler = async e => {
	const urlString = e.queryStringParameters.url
	if (!isValidURL(urlString)) {
		return Response.error(Error.INVALID, 'Invalid URL')
	}

	try {
		const response = await fetch(urlString)
		const body = await response.text()
		const $ = cheerio.load(body)

		let json
		// https://indieauth.spec.indieweb.org/#discovery-by-clients
		const metadataURL = absoluteURL(getRelURL($, 'indieauth-metadata'), urlString)
		if (metadataURL) {
			const res = await fetch(metadataURL)
			json = await res.json()
		} else {
			json = {
				'authorization_endpoint': absoluteURL(getRelURL($, 'authorization_endpoint'), urlString),
				'token_endpoint': absoluteURL(getRelURL($, 'token_endpoint'), urlString),
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
