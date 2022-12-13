// https://docs.cotter.app/sdk-reference/api-for-other-mobile-apps/api-for-mobile-apps#step-1-create-a-code-verifier
const dec2hex = dec => ('0' + dec.toString(16)).substr(-2)

const generateRandomString = length => {
	const array = new Uint32Array(length / 2)
	window.crypto.getRandomValues(array)
	return Array.from(array, dec2hex).join('')
}

// https://docs.cotter.app/sdk-reference/api-for-other-mobile-apps/api-for-mobile-apps#step-1-b-create-a-code-challenge-from-code-verifier
const sha256 = plain => {
	const encoder = new TextEncoder()
	const data = encoder.encode(plain)
	return window.crypto.subtle.digest('SHA-256', data)
}

const base64 = a => {
	let str = ''
	const bytes = new Uint8Array(a)
	for (const b of bytes) {
		str += String.fromCharCode(b)
	}

	return window.btoa(str)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '')
}

const generateCodeChallenge = async (verifier) => {
	const hashed = await sha256(verifier)
	return base64(hashed)
}

export {
	generateRandomString,
	generateCodeChallenge
}