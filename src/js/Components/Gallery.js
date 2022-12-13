import m from 'mithril'

import { fetchMediaConfig } from '../Controllers/Helpers'
import Proxy from '../Controllers/Proxy'
import Store from '../Models/Store'
import { currentTime } from '../utils'

const PAGE_SIZE = 10

const Gallery = () => {
	const cache = Store.getCache()
	let loading = false, page = 0, images = cache.media || []
	const mediaEndpoint = Store.getSession('media-endpoint')
	let mediaConfig = Store.getSession('mediaConfig')

	const loadGallery = async (force) => {
		if (cache.mediaFetched > 0 && cache.mediaFetched > currentTime() - 1800 && force !== true) return

		loading = true

		await fetchMediaConfig()
		mediaConfig = Store.getSession('mediaConfig')

		if (mediaConfig && mediaConfig.includes('source')) {
			const { response } = await Proxy.media({
				params: { q: 'source' }
			})
			images = (response && response.items) || []
			Store.addToCache({ media: images, mediaFetched: currentTime() })
		}
		loading = false
	}

	return {
		oninit: () => loadGallery(),
		view: () => {
			if (!mediaEndpoint) return null
			if (loading && !images.length) return m('i.fas.fa-spinner.fa-spin', { 'aria-hidden': 'true' })
			if (!mediaConfig || !mediaConfig.includes('source')) return m('h5', 'q=source for media-endpoint not found')

			return [
				m('button', {
					title: 'refresh',
					type: 'button',
					onclick: () => loadGallery(true)
				}, loading ?
					m('i.fas.fa-spinner.fa-spin', { 'aria-hidden': 'true' })
					:
					m('i.fas.fa-rotate-right')),
				m('.sp-gallery', [
					images.slice(0, (page + 1) * PAGE_SIZE).map(i => m('img', { src: i.url }))
				]),
				images.length > (page + 1) * PAGE_SIZE && m('button', { type: 'button', onclick: () => page++ }, 'load more')
			]
		}
	}
}

export default Gallery