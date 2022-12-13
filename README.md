
# sparkles
<p align="center">
  <img src="https://github.com/benjifs/sparkles/blob/main/public/assets/icons/favicon-144x144.png" alt="sparkles icon" />
</p>

[![Netlify Status](https://api.netlify.com/api/v1/badges/c0572dda-6712-4742-a980-3a40b0d42ec2/deploy-status)](https://app.netlify.com/sites/sprkls/deploys)

[sparkles](https://sparkles.sploot.com) is a [Micropub](https://micropub.spec.indieweb.org/) client. It supports [IndieAuth](https://indieauth.net/) for login and expects a [micropub endpoint](https://indieweb.org/Micropub/Servers) to communicate with to publish posts. It supports basic micropub content types and you can also add movies you have watched.

sparkles can also be installed as a [Progressive Web App (PWA)](https://web.dev/progressive-web-apps/) on supported devices which will add the app as a **share target** and also add some quick action options.

You can try it for yourself at: https://sparkles.sploot.com

## Development

### Requirements
* `node 18.12.1`
* `npm 9.2.0`
* `npm install -g netlify-cli`

### Environment Variables
| name | description | required |
| --- | --- | --- |
| VITE_OMDB_API_KEY | [OMDB API Key](https://www.omdbapi.com/) | optional |

### Build
* Clone this repository
* `npm install`
* Run `netlify dev` to test locally
  * Frontend: `http://localhost:5173`
  * Functions: `http://localhost:9000`
