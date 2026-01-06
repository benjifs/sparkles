// Not working as of 2026-01-05
export default {
	url: 'https://www.giantbomb.com/api/search/',
	buildParams: ({ query, page }) => ({
		// eslint-disable-next-line camelcase
		api_key: process.env.GIANTBOMB_API_KEY,
		limit: 10,
		format: 'json',
		resources: 'game',
		query: query,
		page: page,
	}),
	handleError: (status, response) => {
		if (status !== 200 || !response || response?.error != 'OK')
			return { statusCode: 400, description: response?.error }
	},
	parseResponse: res => ({
		totalResults: res?.number_of_total_results || 0,
		results: res?.results.map(g => ({
			id: `gbid:${g.guid}`,
			title: g.name,
			image: g.image.original_url,
			year: g.original_release_date ? new Date(g.original_release_date).getFullYear() : null,
			url: g.site_detail_url
		}))
	})
}