import m from 'mithril'

import Alert from '../Components/Alert'
import Icon from '../Components/Icon'
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

			// RFC9207 - https://www.rfc-editor.org/rfc/rfc9207
			const issuer = Store.getSession('issuer')
			if (!issuer && params.iss) console.warn('"issuer" is missing from metadata but "iss" is returned from authorization-endpoint')
			if (issuer && params.iss && params.iss != issuer) throw new Error('"iss" does not match "issuer"')

			/* eslint-disable camelcase */
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
			m(Icon, { name: 'spinner', className: 'spin' }),
		])
}

export default CallbackPage