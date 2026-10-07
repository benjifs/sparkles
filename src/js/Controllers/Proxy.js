import m from 'mithril'

import Store from '../Models/Store'

const CLIENT = window.location.origin

const Proxy = {
	refreshIfExpired: async (force) => {
		const session = Store.getSession()
		if (session.expires - Date.now() > 5 * 60 * 1000 && !force) return
		// Refresh token if it expires in 5 mins or less
		const res = await m.request({
			method: 'POST',
			url: '/.netlify/functions/token',
			params: {
				'client_id': `${CLIENT}/id`,
				'token_endpoint': session.token_endpoint,
				'refresh_token': session.refresh_token,
			}
		})
		/* eslint-disable camelcase */
		const { access_token, refresh_token, scope, token_type, expires_in } = res
		const expires = refresh_token && expires_in ? Date.now() + expires_in * 1000 : null
		Store.addToSession({ access_token, refresh_token, scope, token_type, expires })
		/* eslint-enable camelcase */
		console.log('Token refreshed')
	},
	discover: url => m.request({
		method: 'GET',
		url: '/.netlify/functions/discover',
		params: { url: url }
	}),
	validate: params => {
		const session = Store.getSession()
		if (!session) throw new Error('session not found')
		const { code } = params
		if (!code) throw new Error('missing "code"')

		return m.request({
			method: 'GET',
			url: '/.netlify/functions/token',
			params: {
				'token_endpoint': session.token_endpoint,
				'code': code,
				'client_id': `${CLIENT}/id`,
				'redirect_uri': `${CLIENT}/callback`,
				...(session.verifier && { 'code_verifier': session.verifier })
			}
		})
	},
	micropub: async ({ method, params, body }) => {
		await Proxy.refreshIfExpired()
		const session = Store.getSession()
		if (!session) throw new Error('session not found')
		if (!session.access_token) throw new Error('access_token not found')

		return m.request({
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
	media: async ({ method, params, body }) => {
		await Proxy.refreshIfExpired()
		const session = Store.getSession()
		if (!session) throw new Error('session not found')
		if (!session.access_token) throw new Error('access_token not found')

		return m.request({
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
		let response
		try {
			response = JSON.parse(xhr.responseText)
		} catch {
			response = xhr.responseText
		}
		if (![200, 201, 202].includes(xhr.status)) {
			const error = new Error(response?.error_description || response?.error || response || `HTTP ${xhr.status}`)
			error.response = response
			error.status = xhr.status
			throw error
		}
		return {
			status: xhr.status,
			headers: {
				location: xhr.getResponseHeader('location')
			},
			response
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
