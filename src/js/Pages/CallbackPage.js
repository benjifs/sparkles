import m from 'mithril'

import Alert from '../Components/Alert'
import Proxy from '../Controllers/Proxy'
import Store from '../Models/Store'

const CallbackPage = {
	oninit: async () => {
		const parameterList = new URLSearchParams(window.location.search)
		const params = {
			code: parameterList.get('code'),
			state: parameterList.get('state'),
			iss: parameterList.get('iss')
		}

		try {
			const state = Store.getSession('state')
			if (params.state != state) throw new Error('"state" value does not match')
			if (!params.code) throw new Error('missing "code" param')

			/* eslint-disable camelcase */
			const { access_token, scope, token_type } = await Proxy.validate(params)
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