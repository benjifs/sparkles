import fetch from 'node-fetch'
import { Response } from './lib/utils'

exports.handler = async e => {
	// eslint-disable-next-line camelcase
	const { code, client_id, redirect_uri, token_endpoint, code_verifier } = e.queryStringParameters

	// https://indieauth.spec.indieweb.org/#request
	const params = new URLSearchParams()
	params.append('grant_type', 'authorization_code')
	params.append('code', code)
	params.append('client_id', client_id)
	params.append('redirect_uri', redirect_uri)
	// eslint-disable-next-line camelcase
	code_verifier && params.append('code_verifier', code_verifier)

	const response = await fetch(token_endpoint, {
		method: 'POST',
		body: params,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
	const body = await response.json()

	return Response.success(body)
}
