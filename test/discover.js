import assert from 'node:assert'
import { describe, it } from 'node:test'

const baseUrl = 'http://localhost:8888/.netlify/functions'
const url = `${baseUrl}/discover`

// TODO: launch `netlify dev` before running these tests. Stop it when done.

describe('discover', () => {
  it('supports indieauth-metadata (JSON document)', async () => {
    const qs = 'url=https://www.giacomodebidda.com/'

    const response = await fetch(`${url}?${qs}`)
    const json = await response.json()

    assert.ok(response.ok)
    assert.equal(response.status, 200)
    assert.ok(json.authorization_endpoint, 'JSON response includes authorization_endpoint')
    assert.ok(json.token_endpoint, 'JSON response includes token_endpoint')
    assert.ok(json.micropub, 'JSON response includes micropub')
  })

  it('missing micropub', async () => {
    const response = await fetch(`${url}?url=https://jamesg.blog/`)
    const json = await response.json()

    assert.equal(response.status, 400)
    assert.ok(json.error_description, 'Missing "micropub"')
  })

  it('parse indieauth-metadata', async () => {
    const response = await fetch(`${url}?url=https://umbrella.sploot.com/`)
    const json = await response.json()

    assert.ok(response.ok)
    assert.ok(json.issuer, 'metadata contains "issuer"')
    assert.ok(json.authorization_endpoint, 'metadata contains "authorization_endpoint"')
    assert.ok(json.token_endpoint, 'metadata contains "token_endpoint"')
    assert.ok(json.micropub, 'metadata contains "micropub"')
  })
})
