import m from 'mithril'

import Alert from '../Components/Alert'
import Proxy from '../Controllers/Proxy'
import Store from '../Models/Store'

const CallbackPage = {
	oninit: async () => {
		// https://indieauth.spec.indieweb.org/#authorization-response
		const parameterList = new URLSearchParams(window.location.search)
		const params = {
			code: parameterList.get('code'),
			state: parameterList.get('state'),
			// indieauth.com does not return `iss`
			iss: parameterList.get('iss')
		}

		try {
			const state = Store.getSession('state')
			if (params.state != state) throw new Error('"state" value does not match')
			if (!params.code) throw new Error('missing "code" param')

			// From the spec, this should be checked and fail
			// to support legacy, skip this check for now
			/* eslint-disable camelcase */
			// const authorization_endpoint = Store.getSession('authorization_endpoint')
			// if (params.iss != authorization_endpoint) throw new Error('"iss" does not match "authorization_endpoint"')

			// https://indieauth.spec.indieweb.org/#redeeming-the-authorization-code
			const { access_token, scope, token_type } = await Proxy.validate(params)
			// https://indieauth.spec.indieweb.org/#access-token-response
			Store.addToSession({ access_token, scope, token_type })
			/* eslint-enable camelcase */
			m.route.set('/home')
		} catch(err) {
			Alert.error(err)
			m.route.set('/login')
		}
	},
	view: () =>
		m('p', [
			'Validating token ',
			m('i.fas.fa-spinner.fa-spin', { 'aria-hidden': 'true' })
		])
}

export default CallbackPage