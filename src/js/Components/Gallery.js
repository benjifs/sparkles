import m from 'mithril'

import Icon from './Icon'
import { fetchMediaSource } from '../Controllers/Helpers'
import Store from '../Models/Store'

const PAGE_SIZE = 10

const Gallery = () => {
	const cache = Store.getCache()
	let loading = false, page = 0, images = cache.media || []
	const mediaEndpoint = Store.getSession('media-endpoint')

	const loadGallery = async (force) => {
		loading = true
		const mediaSource = await fetchMediaSource(force)
		if (mediaSource) {
			images = mediaSource.media
			cache.mediaFetched = mediaSource.mediaFetched
		}
		loading = false
		if (!mediaSource) m.redraw()
	}

	return {
		oninit: () => loadGallery(),
		view: () => {
			if (!mediaEndpoint) return null
			if (loading && !images.length) return m(Icon, { name: 'spinner', className: 'spin' })
			if (cache.mediaFetched < 0) return m('h5', [
				'q=source for media-endpoint not found ',
				m('a', { href: 'https://github.com/indieweb/micropub-extensions/issues/14', target: '_blank' },
					m(Icon, { name: 'question', label: 'media endpoint source discussion' }))
			])

			return [
				m('button', {
					title: 'refresh',
					type: 'button',
					onclick: () => loadGallery(true)
				}, loading ?
					m(Icon, { name: 'spinner', className: 'spin' })
					:
					m(Icon, { name: 'arrow-clockwise', label: 'refresh' })),
				m('.sp-gallery', [
					images.slice(0, (page + 1) * PAGE_SIZE).map(i =>
						m(m.route.Link, { class: 'icon', href: `/new/photo?image=${i.url}` }, m('img', { src: i.url })))
				]),
				images.length > (page + 1) * PAGE_SIZE && m('button', { type: 'button', onclick: () => page++ }, 'load more')
			]
		}
	}
}

export default Gallery