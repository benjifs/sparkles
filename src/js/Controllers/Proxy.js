import m from 'mithril'

import Store from '../Models/Store'

const CLIENT = window.location.origin

const Proxy = {
	discover: url =>
		m
			.request({
				method: 'GET',
				url: '/.netlify/functions/discover',
				params: { url: url }
			}),
	validate: params => {
		const session = Store.getSession()
		if (!session) throw new Error('session not found')
		const { code } = params
		if (!code) throw new Error('missing "code"')

		return m
			.request({
				method: 'GET',
				url: '/.netlify/functions/token',
				params: {
					'token_endpoint': session.token_endpoint,
					'code': code,
					'client_id': `${CLIENT}/`,
					'redirect_uri': `${CLIENT}/callback`,
					...(session.verifier && { 'code_verifier': session.verifier })
				}
			})
	},
	micropub: ({ method, params, body }) => {
		const session = Store.getSession()
		if (!session) throw new Error('session not found')
		if (!session.access_token) throw new Error('access_token not found')

		return m
			.request({
				method: method || 'GET',
				url: '/.netlify/functions/micropub',
				headers: {
					// ...(body && { 'Content-Type': 'application/json' }),
					'Authorization': `Bearer ${session.access_token}`,
					'x-micropub-endpoint': session.micropub
				},
				params: params,
				body: body || null,
				extract: Proxy.extractResponse
			})
	},
	media: ({ method, params, body }) => {
		const session = Store.getSession()

		return m
			.request({
				method: method || 'GET',
				url: '/.netlify/functions/media',
				headers: {
					'Authorization': `Bearer ${session.access_token}`,
					'x-media-endpoint': session['media-endpoint']
				},
				params: params,
				body: body || null,
				extract: Proxy.extractResponse
			})
	},
	extractResponse: xhr => {
		let responseBody
		try {
			responseBody = JSON.parse(xhr.responseText)
		} catch {
			responseBody = xhr.responseText
		}
		return {
			status: xhr.status,
			headers: {
				location: xhr.getResponseHeader('location')
			},
			response: responseBody
		}
	},
	redirect: async url => {
		try {
			await m.request({
				method: 'GET',
				url: `/.netlify/functions/redirect?url=${url}`
			})
			return true
		} catch {
			console.error(`could not fetch ${url}`)
		}
		return false
	}
}

export default Proxy