const { URL } = process.env

export const handler = async () => ({
	statusCode: 200,
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		'client_id': `${URL}/id`,
		'client_name': 'sparkles',
		'client_uri': URL,
		'logo_uri': `${URL}/assets/icons/favicon-96x96.png`,
		'redirect_uris': [
			`${URL}/callback`,
		]
	})
})