const isValidURL = urlString => {
	let url
	try {
		url = new URL(urlString)
	} catch (_) {
		return false
	}
	return url && ['http:', 'https:'].includes(url.protocol)
}

const Error = {
	INVALID: { 'statusCode': 400, 'error': 'invalid_request' },
	NOT_SUPPORTED: { 'statusCode': 400, 'error': 'invalid_response' },
	UNAUTHORIZED: { 'statusCode': 401, 'error': 'unauthorized' },
	FORBIDDEN: { 'statusCode': 403, 'error': 'forbidden' },
	SCOPE: { 'statusCode': 403, 'error': 'insufficient_scope' },
	NOT_FOUND: { 'statusCode': 404, 'error': 'not_found' },
	NOT_ALLOWED: { 'statusCode': 405, 'error': 'method_not_allowed' }
}

const Response = {
	DEFAULT_HEADERS: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type, authorization',
		'Access-Control-Expose-Headers': 'Location'
	},
	send: (status, body, headers) => ({
		'statusCode': status,
		'headers': {
			...Response.DEFAULT_HEADERS,
			...(body && { 'Content-Type': 'application/json' }),
			...(headers ? headers : {})
		},
		'body': body ? JSON.stringify(body) : 'success'
	}),
	error: ({ statusCode, error }, description) =>
		Response.send(statusCode, {
			'error': error,
			'error_description': description
		}),
	success: body => Response.send(200, body)
}

export { isValidURL, Error, Response }
