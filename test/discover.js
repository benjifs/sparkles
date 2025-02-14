import assert from 'node:assert'
import { describe, it } from 'node:test'

const baseUrl = 'http://localhost:8888/.netlify/functions'
const url = `${baseUrl}/discover`

// TODO: launch `netlify dev` before running these tests. Stop it when done.

describe('discover', () => {
  it('supports indieauth-metadata (JSON document)', async () => {
    const qs = 'url=https://www.giacomodebidda.com/'
    // const qs = 'url=https://aaronparecki.com/'

    const response = await fetch(`${url}?${qs}`)
    const json = await response.json()

    assert.ok(response.ok)
    assert.equal(response.status, 200)
    assert.ok(json.authorization_endpoint, 'JSON response includes authorization_endpoint')
    assert.ok(json.token_endpoint, 'JSON response includes token_endpoint')
    assert.ok(json.micropub, 'JSON response includes micropub')
  })
})
