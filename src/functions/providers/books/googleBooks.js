export default {
	url: 'https://www.googleapis.com/books/v1/volumes',
	buildParams: ({ query, page }) => ({
		q: query,
		maxResults: 10,
		startIndex: (page - 1) * 10,
		projection: 'lite',
		key: process.env.GOOGLEBOOKS_API_KEY,
	}),
	handleError: (status, response) => {
		if (status !== 200)
			return { statusCode: status, description: response.error?.message }
	},
	parseResponse: res => {
		let response = {
			totalResults: res?.totalItems || 0,
			results: []
		}
		res?.items.map(b => {
			response.results.push({
				id: `google:${b.id}`,
				title: b.volumeInfo.title,
				author: b.volumeInfo.authors ? b.volumeInfo.authors.join(', ') : '',
				description: b.volumeInfo.description,
				year: (b.volumeInfo.publishedDate || '').split('-')[0],
				url: b.volumeInfo.canonicalVolumeLink,
				...(b.volumeInfo.imageLinks && {
					image: b.volumeInfo.imageLinks.smallThumbnail
				})
			})
		})
		return response
	}
}