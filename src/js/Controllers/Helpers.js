import Proxy from './Proxy'
import Alert from '../Components/Alert'
import Store from '../Models/Store'

import { currentTime } from '../utils'

const fetchMicropubConfig = async (force) => {
	const micropubConfigFetched = Store.getCache('micropubConfigFetched')
	if (micropubConfigFetched > 0 && !force) return
	try {
		const { response } = await Proxy.micropub({
			params: {
				q: 'config'
			}
		})
		Store.addToSession(response)
		Store.addToCache({ micropubConfigFetched: currentTime() })
	} catch(err) {
		Alert.error(err)
	}
}

export {
	fetchMicropubConfig
}