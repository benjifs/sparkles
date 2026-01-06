export default {
	buildRequest: ({ query, page }) => {
		const url = new URL('https://openlibrary.org/search.json')
		url.search = new URLSearchParams({
			limit: 10,
			q: query,
			page: page,
			fields: 'key,title,editions,author_name,author_key,cover_i',
		})
		return { url }
	},
	handleError: (status, json) => `OpenLibrary (${status}): ${json.error}`,
	parseResponse: res => ({
		totalResults: res?.num_found || 0,
		results: res?.docs.map(b => {
			const coverKey = b?.editions?.docs[0]?.cover_i
			return {
				id: `olid:${b.key.replace('/works/', '')}`,
				title: b.title,
				author: b.author_name ? b.author_name.join(', ') : '',
				...(coverKey && { image: `https://covers.openlibrary.org/b/id/${coverKey}-M.jpg` }),
				year: b.first_publish_year,
				url: `https://openlibrary.org${b.key}`
			}
		})
	})
}