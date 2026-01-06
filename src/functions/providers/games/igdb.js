import fetch from 'node-fetch'

const { IGDB_CLIENT_ID, IGDB_CLIENT_SECRET } = process.env
const LIMIT = 10

const getToken = async () => {
	const url = new URL('https://id.twitch.tv/oauth2/token')
	/* eslint-disable camelcase */
	url.search = new URLSearchParams({
		client_id: IGDB_CLIENT_ID,
		client_secret: IGDB_CLIENT_SECRET,
		grant_type: 'client_credentials',
	})
	/* eslint-enable camelcase */
	const res = await fetch(url, { method: 'POST' })
	if (!res.ok) throw new Error('IGDB: Could not authenticate')
	return await res.json()
}

export default {
	buildRequest: async ({ query, page }) => {
		try {
			/* eslint-disable-next-line camelcase */
			const { access_token } = await getToken()
			return {
				url: 'https://api.igdb.com/v4/games/',
				options: {
					method: 'POST',
					headers: {
						'Client-ID': IGDB_CLIENT_ID,
						/* eslint-disable-next-line camelcase */
						'Authorization': `Bearer ${access_token}`,
					},
					body: `
					search "${query}";
					fields name,cover.url,genres.name,keywords,rating,release_dates.y,slug,summary,url;
					limit ${LIMIT};
					offset ${Math.max(0, (page - 1) * 10)};
					`,
				},
			}
		} catch (e) {
			throw new Error(e.message)
		}
	},
	handleError: (_, json) => `IGDB: ${json?.message || json[0].title}`,
	parseResponse: (res, { page }) => ({
		totalResults: page * Math.min(LIMIT, res?.length || 0) + 1,
		results: res?.map(g => ({
			id: `igdb:${g.id}`,
			title: g.name,
			genres: g.genres?.map(gn => gn.name),
			image: g.cover?.url,
			description: g.summary,
			year: g.release_dates?.[0]?.y,
			url: g.slug,
		}))
	})
}