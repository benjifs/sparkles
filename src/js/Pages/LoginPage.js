import m from 'mithril'

import Alert from '../Components/Alert'
import { Box } from '../Components/Box'
import Proxy from '../Controllers/Proxy'
import Store from '../Models/Store'
import { canonicalURL } from '../utils'
import { generateRandomString, generateCodeChallenge, getCodeChallengeMethod } from '../utils/crypt'

const CLIENT = window.location.origin
const { DEV } = import.meta.env

const Login = () => {
	let loading = false
	let urlString = ''
	let state = {
		loading: null,
		micropubURL: '',
		accessToken: ''
	}

	const canSubmit = () => urlString && urlString !== ''
	const canSubmitAdvanced = () => state.micropubURL && state.micropubURL.trim() !== '' && state.accessToken && state.accessToken.trim() !== ''

	const onLogin = async e => {
		e.preventDefault()
		loading = true

		try {
			const url = canonicalURL(urlString)
			if (!url) throw new Error('could not convert to canonical URL')

			const data = await Proxy.discover(url)

			/* eslint-disable camelcase */
			const { authorization_endpoint, token_endpoint, code_challenge_methods_supported, micropub } = data
			if (!(authorization_endpoint && token_endpoint && micropub)) throw Error(`Missing rels for ${url}`)

			const state = generateRandomString(23)
			const verifier = generateRandomString(56)
			Store.setSession({ authorization_endpoint, token_endpoint, micropub, me: url, state, verifier })

			// https://indieauth.spec.indieweb.org/#authorization-request
			const code_challenge_method = getCodeChallengeMethod(code_challenge_methods_supported)
			const code_challenge = await generateCodeChallenge(code_challenge_method, verifier)

			const params = new URLSearchParams({
				'response_type': 'code',
				'client_id': `${CLIENT}/`,
				'redirect_uri': `${CLIENT}/callback`,
				'state': state,
				'code_challenge': code_challenge,
				'code_challenge_method': code_challenge_method,
				'scope': 'create',
				'me': url
			})

			window.location.href = `${authorization_endpoint}?${params.toString()}`
			/* eslint-enable camelcase */
		} catch(err) {
			Alert.error(err)
		}

		loading = false
	}

	const advancedLogin = async e => {
		e.preventDefault()
		state.loading = true

		Store.setSession({ micropub: state.micropubURL, access_token: state.accessToken })
		m.route.set('/home')
	}

	Store.clearSession()
	Store.clearCache()

	return {
		view: () => [
			m('section', m('.sp-title', 'sparkles')),
			m(Box, { className: '.no-pad' }, [
				m('form.text-center', { onsubmit: onLogin }, [
					m('input', {
						type: 'url',
						placeholder: 'https://',
						oninput: e => urlString = e.target.value,
						value: urlString
					}),
					m('button', {
						type: 'submit',
						disabled: !canSubmit() || loading
					}, loading ? m('i.fas.fa-spinner.fa-spin') : 'login')
				]),
				DEV && m('form', { onsubmit: advancedLogin },
					m('details', [
						m('summary', 'test mode'),
						m('section.text-center', [
							m('hr'),
							m('input', {
								type: 'url',
								placeholder: 'Micropub Endpoint',
								oninput: e => state.micropubURL = e.target.value,
								value: state.micropubURL
							}),
							m('textarea', {
								placeholder: 'Access Token',
								oninput: e => state.accessToken = e.target.value,
								value: state.accessToken
							}),
							m('button', {
								type: 'submit',
								disabled: !canSubmitAdvanced() || state.loading
							}, state.loading ? m('i.fas.fa-spinner.fa-spin') : 'login'),
						])
					])
				)
			])
		]
	}
}

export default Login
