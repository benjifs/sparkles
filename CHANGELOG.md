# Changelog

## 0.11.1
_released `2024-09-11`_
* Use `editions` to get a valid cover image from openlibrary

## 0.11.0
_released `2024-09-04`_
* Add additional fields for `Photo`, `Bookmark`, and `Like` posts
* Add ability to prefill `title` fields for `Like` and `Bookmark` posts using [Open Graph Metadata](https://ogp.me/)
* Add [mp-slug](https://indieweb.org/Micropub-extensions#Slug) property in "Advanced"

## 0.10.3
_released `2024-08-27`_
* Fix openlibrary cover images
* Cache form data in PhotoEditor

## 0.10.0
_released `2024-06-05`_
* Switch to [The Movie DB API](https://developer.themoviedb.org/)
* Fix issue with dropdown in Listen search
* Fix pagination size

## 0.9.0
_released `2024-05-29`_
* Add "blocky" theme
* Switch from [Last.fm](https://www.last.fm/api) to [iTunes search](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html#//apple_ref/doc/uid/TP40017632-CH5-SW1)
* Get [odesli](https://odesli.co/) URL for albums and songs
* Add advanced options to all editors

## 0.8.0
_released `2024-01-14`_
* Photo editor added
* `syndicate-to` added everywhere

## 0.7.1
_released `2023-12-16`_
* Updated documentation
* Added `DEV` mode for local testing

## 0.7.0
_released `2023-12-08`_
* Support for music `listen`s and video game `play`s added

## 0.6.2
_released `2023-11-25`_
* Fix share params for editors
* Add redirects for netlify functions for the future

## 0.6.1
_released `2023-11-18`_
* Load `post-types` from config
* Use value of `post-types` to show editor options

## 0.5.0
_released `2023-07-08`_
* Book and Movie editor improvements
* Addressing some compatibility issues with indiekit

## 0.4.0
_released `2023-06-27`_
* Fix `issuer`

## 0.3.0
_released `2023-03-09`_
* Movie pagination
* Style changes for Movie and Book search results

## 0.2.0
_released `2023-01-23`_
* Add Books option using openlibrary.org for search
* Update `watch-of` properties

## 0.1.7
_released `2023-01-09`_
* Update `h-entry` for watched posts

## 0.1.6
_released `2023-01-06`_
* Fix: handle plain and S256 code challenge method
* Add `post-status`
* Add `visibility`

## 0.1.5
_released `2023-01-06`_
* Remove `media-endpoint?q=config`. Not part of [spec](https://micropub.spec.indieweb.org/#media-endpoint)
* Show more information related to usage for `q=source`
* Fix dark mode style for `<select>`
* When logging out, redirect to `/login` to handle reload of state better

## 0.1.3
_released `2022-12-27`_
* Add path to `client_id`
* Return `Content-Type` for `/micropub` requests
* Fix `npm` enging version

## 0.1.2
_released `2022-12-23`_
* Fix styles for links
* Fix issue with redirect on `success`
* Add link to source code in [/about](https://sparkles.sploot.com/about)

## 0.1.1
_released `2022-12-14`_
* Fix issue with authentication
* Add `simple` theme

## 0.1.0
_released `2022-12-13`_
* First release!
