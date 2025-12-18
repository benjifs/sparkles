import m from 'mithril'

import Alert from '../Components/Alert'
import { Box } from '../Components/Box'
import Gallery from '../Components/Gallery'
import Icon from '../Components/Icon'
import Proxy from '../Controllers/Proxy'
import Store from '../Models/Store'
import { currentTime } from '../utils'

const ImageEditor = () => {
	let loading = false, image, preview, uploaded
	const mediaEndpoint = Store.getSession('media-endpoint')

	const loadImage = e => {
		const [ file ] = e.target.files
		if (file) {
			if (file.size > 2621440) {
				preview = image = null
				return Alert.error('max file size is 2MB')
			}
			image = file
			preview = URL.createObjectURL(file)
			uploaded = null
		}
	}

	const uploadImage = async () => {
		if (!image.name) {
			// maybe not necessary?
			image.name = `${currentTime()}.${image.type.split('/').pop()}`
		}

		loading = true
		const formData = new FormData()
		formData.append('file', image)
		const res = await Proxy.media({
			method: 'POST',
			body: formData
		})
		if (res && res.status === 201) {
			if ((res.response && res.response.url) || res.headers.location) {
				uploaded = res.response.url || res.headers.location
				let media = Store.getCache('media') || []
				media.unshift({ url: uploaded })
				Store.addToCache({ media })
			} else {
				uploaded = null
				Alert.error('media-endpoint returned 201 but URL not found')
			}
			preview = null
		} else if (!res || res.status >= 400) {
			uploaded = null
			Alert.error(res)
		}
		loading = false
	}

	return {
		view: () =>
			m(Box, {
				className: '.text-center',
				icon: 'image',
				title: 'Image'
			}, m('form',
				mediaEndpoint ? [
					m('input', {
						type: 'file',
						onchange: loadImage,
						accept: 'image/*'
					}),
					preview && m('div', [
						m('img', { src: preview }),
						m('div', [
							m('button', {
								type: 'button',
								onclick: uploadImage,
								disabled: loading
							}, loading ? m(Icon, { name: 'spinner', className: 'spin' }) : [
								'upload',
								m(Icon, { name: 'upload'}),
							])
						])
					]),
					uploaded && m('div', [
						m('div', 'Image uploaded successfully'),
						m('img', { src: uploaded }),
						m('div', m('a', { href: uploaded, target: '_blank' }, uploaded)),
						m('div', [
							m(m.route.Link, {
								href: `/new/photo?image=${uploaded}`,
								selector: 'button'
							}, 'post image')
						])
					]),
					m('hr'),
					m(Gallery)
				]
					:
					m('h5', 'media-endpoint not found')
			))
	}
}

export default ImageEditor
