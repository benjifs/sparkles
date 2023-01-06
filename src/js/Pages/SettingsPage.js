import m from 'mithril'

import { BoxHeader } from '../Components/Box'
import { fetchMicropubConfig, fetchMediaSource } from '../Controllers/Helpers'
import Store from '../Models/Store'

import { formatDate } from '../utils'

const SettingsPage = () => {
	let micropubConfigFetched,
		syndicateTargets,
		mediaEndpoint,
		mediaFetched,
		state = {}

	const loadFetchedValues = () => {
		micropubConfigFetched = Store.getCache('micropubConfigFetched')
		syndicateTargets = Store.getSession('syndicate-to')

		mediaEndpoint = Store.getSession('media-endpoint')
		mediaFetched = Store.getCache('mediaFetched')
	}

	loadFetchedValues()

	let ui = Store.getSettings('ui')
	if (ui) {
		document.documentElement.setAttribute('data-ui', ui)
	}

	const loadMicropubConfig = async () => {
		state.loadingMicropub = true
		await fetchMicropubConfig(true)
		loadFetchedValues()
		state.loadingMicropub = false
	}

	const loadMediaSource = async () => {
		state.loadingMedia = true
		const mediaSource = await fetchMediaSource(true)
		if (mediaSource) {
			mediaFetched = mediaSource.mediaFetched
		}
		state.loadingMedia = false
	}

	const updateUI = e => {
		ui = e && e.target && e.target.value != 'default' ? e.target.value : null
		if (ui) {
			document.documentElement.setAttribute('data-ui', ui)
		} else {
			document.documentElement.removeAttribute('data-ui')
		}
		Store.addToSettings({ ui })
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
						m('ul', [
							m('li', [
								m('span', `Config loaded: ${formatDate(micropubConfigFetched)}`),
								m('button', { onclick: loadMicropubConfig }, [
									'refresh',
									state.loadingMicropub && m('i.fas.fa-spinner.fa-spin')
								])
							]),
							!mediaEndpoint && m('li',
								m('div', [
									m('code', 'media-endpoint'),
									' not found'
								])
							),
							mediaEndpoint && m('li', [
								m('span', [
									'Media loaded: ',
									mediaFetched == 0 && 'Not fetched',
									mediaFetched == -1 && 'N/A',
									mediaFetched > 0 && formatDate(mediaFetched)
								]),
								m('button', { onclick: loadMediaSource }, [
									'refresh',
									state.loadingMedia && m('i.fas.fa-spinner.fa-spin')
								])
							]),
							mediaEndpoint && mediaFetched != 0 && m('li', m('div', [
								m('code', 'media-endpoint?q=source'),
								mediaFetched > 0 && ' is available ',
								mediaFetched < 0 && ' is not available ',
								m('a', { href: 'https://github.com/indieweb/micropub-extensions/issues/14', target: '_blank' },
									m('i.far.fa-circle-question', { title: 'media endpoint source discussion' }))
							])),
							syndicateTargets && syndicateTargets.length && [
								m('li', m('h5', 'Syndication Targets')),
								syndicateTargets.map(s =>
									m('li', [
										m('label', [ s.name ])
									]))
							],
							m('hr'),
							m('li', m('h5', 'General Settings')),
							m('li', [
								m('span', 'theme'),
								m('select', { value: ui || 'default', onchange: updateUI },
									['default', 'simple']
										.map(o => m('option', { value: o }, o)))
							])
						])
					])
				])
			])
	}
}

export default SettingsPage