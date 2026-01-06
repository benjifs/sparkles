export default {
	buildRequest: ({ query, year, page }) => {
		const url = new URL('https://api.themoviedb.org/3/search/movie')
		url.search = new URLSearchParams({
			// eslint-disable-next-line camelcase
			api_key: process.env.TMDB_API_KEY,
			query: query,
			year: year,
			page: page,
		})
		return { url }
	},
	handleError: (status, json) => `TMDB (${status}): ${json.status_message}`,
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