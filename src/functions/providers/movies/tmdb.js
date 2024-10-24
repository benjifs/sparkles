export default {
	url: 'https://api.themoviedb.org/3/search/movie',
	buildParams: ({ query, year, page }) => ({
		// eslint-disable-next-line camelcase
		api_key: process.env.TMDB_API_KEY,
		query: query,
		year: year,
		page: page,
	}),
	handleError: (status, response) => {
		if (status !== 200)
			return { statusCode: status, description: response.status_message }
	},
	parseResponse: res => ({
		totalResults: res?.total_results || 0,
		results: res?.results?.map(m => ({
			id: `tmdb:${m.id}`,
			title: m.original_title,
			image: `https://image.tmdb.org/t/p/original${m.poster_path}`,
			year: (m.release_date || '').split('-')[0],
			description: m.overview,
			url: `https://themoviedb.org/movie/${m.id}`
		}))
	})
}