
const Store = {
	get: (key, prop) => {
		const data = localStorage.getItem(key)
		const json = data && data.length ? JSON.parse(data) : null
		return json && prop ? json[prop] : json
	},
	set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
	add: (key, data) => Store.set(key, { ...Store.get(key), ...data }),
	clear: () => localStorage.clear(),
	//
	sessionKey: '_mp',
	getSession: prop => Store.get(Store.sessionKey, prop),
	setSession: data => Store.set(Store.sessionKey, data),
	addToSession: data => Store.add(Store.sessionKey, data),
	clearSession: () => localStorage.removeItem(Store.sessionKey),
	//
	settingKey: '_sprk',
	defaultSettings: {
		theme: 'light',
		advanced: false
	},
	getSettings: prop => {
		const settings = Store.get(Store.settingKey)
		if (settings) return prop ? settings[prop] : settings
		Store.setSettings(Store.defaultSettings)
		return Store.get(Store.settingKey, prop)
	},
	setSettings: data => Store.set(Store.settingKey, data),
	addToSettings: data => Store.add(Store.settingKey, data),
	//
	cacheKey: '_cache',
	defaultCache: {
		media: [],
		mediaFetched: 0,
		micropubConfigFetched: 0
	},
	getCache: prop => {
		const cache = Store.get(Store.cacheKey)
		if (cache) return prop ? cache[prop] : cache
		Store.setCache(Store.defaultCache)
		return Store.get(Store.cacheKey, prop)
	},
	setCache: data => Store.set(Store.cacheKey, data),
	addToCache: data => Store.add(Store.cacheKey, data),
	clearCache: () => Store.setCache(Store.defaultCache)
}

export default Store
