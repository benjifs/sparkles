export default {
	url: 'https://inventaire.io/api/search',
	buildParams: ({ query, page }) => ({
		types: 'works',
		search: query,
		limit: 10,
		lang: 'en',
		exact: true,
		'min-score': 5,
		offset: (page - 1) * 10,
	}),
	handleError: (status, response) => {
		if (status !== 200)
			return { statusCode: status, description: response.status_verbose }
	},
	parseResponse: res => {
		let response = {
			totalResults: res?.total || 0,
			results: []
		}
		res?.results.map(b => {
			response.results.push({
				id: b.uri,
				title: b.label,
				image: b.image && b.image.length ? `https://inventaire.io/img/entities/${b.image[0]}` : null,
				url: `https://inventaire.io/entity/${b.uri}`
			})
		})
		return response
	}
}