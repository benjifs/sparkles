import m from 'mithril'

import Alert from '../Components/Alert'
import Proxy from '../Controllers/Proxy'
import Store from '../Models/Store'
import { generateRandomString, generateCodeChallenge } from '../utils/crypt'

const Login = () => {
	let loading = false
	let url = ''

	const canSubmit = () => url && url !== ''

	const onLogin = async e => {
		e.preventDefault()
		loading = true

		try {
			const data = await Proxy.discover(url)

			/* eslint-disable camelcase */
			const { issuer, authorization_endpoint, token_endpoint, code_challenge_methods_supported, micropub } = data
			if (!(authorization_endpoint && token_endpoint && micropub)) throw Error(`Missing rels for ${url}`)

			const state = generateRandomString(23)
			const verifier = generateRandomString(56)
			Store.setSession({ authorization_endpoint, token_endpoint, micropub, me: issuer || url, state, verifier })

			// https://indieauth.spec.indieweb.org/#authorization-request
			const code_challenge_method = Array.isArray(code_challenge_methods_supported) ? code_challenge_methods_supported[0] : 'S256'
			const code_challenge = await generateCodeChallenge(verifier)

			const params = new URLSearchParams({
				'response_type': 'code',
				'client_id': window.location.origin,
				'redirect_uri': `${window.location.origin}/callback`,
				'state': state,
				'code_challenge': code_challenge,
				'code_challenge_method': code_challenge_method,
				'scope': 'create',
				'me': issuer || url
			})

			window.location.href = `${authorization_endpoint}?${params.toString()}`
			/* eslint-enable camelcase */
		} catch(err) {
			Alert.error(err)
		}

		loading = false
	}

	Store.clear()

	return {
		view: () =>
			m('section', [
				m('.sp-title', 'sparkles'),
				m('.sp-box', [
					m('form.sp-box-content.text-center', {
						onsubmit: onLogin
					}, [
						m('input', {
							type: 'url',
							placeholder: 'https://',
							oninput: e => url = e.target.value,
							value: url
						}),
						m('button', {
							type: 'submit',
							disabled: !canSubmit() || loading
						}, loading ? m('i.fas.fa-spinner.fa-spin') : 'login')
					])
				])
			])
	}
}

export default Login
