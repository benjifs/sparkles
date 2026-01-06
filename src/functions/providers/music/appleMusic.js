export default {
	buildRequest: ({ type, query }) => {
		const url = new URL('https://itunes.apple.com/search')
		url.search = new URLSearchParams({
			media: 'music',
			entity: type == 'artist' ? 'musicArtist' : type,
			term: query,
		})
		return { url }
	},
	handleError: (status, json) => `iTunes (${status}): ${json.errorMessage}`,
	parseResponse: res => ({
		totalResults: res?.resultCount || 0,
		results: res?.results.map(r => ({
			id: `itunes:${r.wrapperType}:${r.trackId || r.collectionId || r.artistId}`,
			title: r.trackName || r.collectionName,
			author: r.artistName,
			image: r.artworkUrl100,
			...(r.releaseDate && { year: r.releaseDate.substr(0, 4) }),
			url: r.trackViewUrl || r.collectionViewUrl || r.artistLinkUrl
		}))
	})
}