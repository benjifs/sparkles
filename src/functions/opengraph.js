import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { isValidURL, Response, Error } from './lib/utils'

const getOGValue = ($, property) => $ && property ? $(`meta[property="og:${property}"]`).attr('content') : null

exports.handler = async e => {
	const { url } = e.queryStringParameters
	if (!isValidURL(url)) return Response.error(Error.INVALID, 'Invalid URL')

	try {
		const response = await fetch(url)
		const body = await response.text()
		const $ = cheerio.load(body)

		return Response.success({
			title: getOGValue($, 'title') || $('title').text(),
			description: getOGValue($, 'description'),
			image: getOGValue($, 'image')
		})
	} catch (err) {
		console.error('[ERROR]', err && err.message)
	}

	return Response.error(Error.NOT_FOUND)
}
