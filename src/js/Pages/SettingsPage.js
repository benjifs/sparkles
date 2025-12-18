import m from 'mithril'

import { Box } from '../Components/Box'
import Icon from '../Components/Icon'
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
			m(Box, {
				icon: 'gear',
				title: 'Settings'
			}, [
				m('ul', [
					m('li', [
						m('span', `Config loaded: ${formatDate(micropubConfigFetched)}`),
						m('button', { onclick: loadMicropubConfig }, [
							'refresh',
							state.loadingMicropub && m(Icon, { name: 'spinner', className: 'spin' })
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
							state.loadingMedia && m(Icon, { name: 'spinner', className: 'spin' })
						])
					]),
					mediaEndpoint && mediaFetched != 0 && m('li', m('div', [
						m('code', 'media-endpoint?q=source'),
						mediaFetched > 0 && ' is available ',
						mediaFetched < 0 && ' is not available ',
						m('a', { href: 'https://github.com/indieweb/micropub-extensions/issues/14', target: '_blank' },
							m(Icon, { name: 'question', label: 'media endpoint source discussion' }))
					])),
					syndicateTargets && syndicateTargets.length > 0 && [
						m('li', m('h5', 'Syndication Targets')),
						syndicateTargets.map(s =>
							m('li', [
								m('label', [
									s.name,
									m('input', { type: 'checkbox', checked: s.checked, disabled: true })
								])
							]))
					],
					m('hr'),
					m('li', m('h5', 'General Settings')),
					m('li', m('label', [
						'theme',
						m('select', { value: ui || 'default', onchange: updateUI },
							['default', 'simple', 'blocky']
								.map(o => m('option', { value: o }, o)))
					]))
				])
			])
	}
}

export default SettingsPage