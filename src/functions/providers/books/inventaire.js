export default {
	buildRequest: ({ query, page }) => {
		const url = new URL('https://inventaire.io/api/search')
		url.search = new URLSearchParams({
			types: 'works',
			search: query,
			limit: 10,
			lang: 'en',
			exact: true,
			'min-score': 5,
			offset: (page - 1) * 10,
		})
		return { url }
	},
	handleError: (status, response) => `inventaire: (${status}): ${response.status_verbose}`,
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