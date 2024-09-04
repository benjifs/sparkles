export default {
	key: '__form',
	get: key => JSON.parse(localStorage.getItem(FormCache.key) || '{}')[key] || '',
	put: (key, value) => {
		const form = JSON.parse(localStorage.getItem(FormCache.key) || '{}')
		form[key] = value
		localStorage.setItem(FormCache.key, JSON.stringify(form))
	},
	clear: () => localStorage.removeItem(FormCache.key)
}