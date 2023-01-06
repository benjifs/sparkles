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

const fetchMediaSource = async (force) => {
	const mediaFetched = Store.getCache('mediaFetched')
	if ((mediaFetched < 0 || mediaFetched > currentTime() - 1800) && force !== true) return

	const { response } = await Proxy.media({
		params: { q: 'source' }
	})
	const mediaSource = {
		media: (response && response.items) || [],
		mediaFetched: !response || !response.error ? currentTime() : -1
	}
	Store.addToCache(mediaSource)
	return mediaSource
}

export {
	fetchMicropubConfig,
	fetchMediaSource
}