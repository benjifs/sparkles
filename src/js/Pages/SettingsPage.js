import m from 'mithril'

import { BoxHeader } from '../Components/Box'
import { fetchMediaConfig, fetchMicropubConfig } from '../Controllers/Helpers'
import Store from '../Models/Store'

import { formatDate } from '../utils'

const SettingsPage = () => {
	let micropubConfigFetched,
		syndicateTargets,
		mediaConfigFetched,
		mediaEndpoint,
		mediaConfig

	const loadFetchedValues = () => {
		micropubConfigFetched = Store.getCache('micropubConfigFetched')
		syndicateTargets = Store.getSession('syndicate-to')

		mediaConfig = Store.getSession('mediaConfig')
		mediaConfigFetched = Store.getCache('mediaConfigFetched')
		mediaEndpoint = Store.getSession('media-endpoint')
	}

	loadFetchedValues()

	const loadMicropubConfig = async () => {
		await fetchMicropubConfig(true)
		loadFetchedValues()
	}

	const loadMediaConfig = async () => {
		await fetchMediaConfig(true)
		loadFetchedValues()
	}

	return {
		view: () =>
			m('section.sp-content.text-center', [
				m('.sp-box', [
					m(BoxHeader, {
						icon: '.fas.fa-gear',
						name: 'Settings'
					}),
					m('.sp-box-content', [
						m('h5', [
							m('i.fas.fa-triangle-exclamation'),
							' testing ',
							m('i.fas.fa-triangle-exclamation')
						]),
						m('ul', [
							m('li', [
								m('span', `Config loaded: ${formatDate(micropubConfigFetched)}`),
								m('button', { onclick: loadMicropubConfig }, 'refresh')
							]),
							!mediaEndpoint && m('li',
								m('div', [
									m('code', 'media-endpoint'),
									' not found'
								])
							),
							mediaEndpoint && m('li', [
								m('span', `Media Config: ${mediaConfigFetched > 0 ? formatDate(mediaConfigFetched) : 'Not fetched'}`),
								m('button', { onclick: loadMediaConfig }, 'refresh')
							]),
							mediaConfig && mediaConfig.includes('source') && m('li', m('div', [
								m('code', 'media-endpoint?q=source'),
								' is available'
							])),
							syndicateTargets && syndicateTargets.length && [
								m('li', m('h5', 'Syndication Targets')),
								syndicateTargets.map(s =>
									m('li', [
										m('label', [
											s.name
										])
									]))
							]
						])
					])
				])
			])
	}
}

export default SettingsPage