
# sparkles
<p align="center">
  <img src="./public/assets/icons/favicon-144x144.png" alt="sparkles icon" />
</p>

<div align="center">
  <a target="_blank" href="https://app.netlify.com/sites/sprkls/deploys">
    <img src="https://api.netlify.com/api/v1/badges/c0572dda-6712-4742-a980-3a40b0d42ec2/deploy-status" alt="Netlify Status">
  </a>
</div>
<div align="center">
  <a target="_blank" href="./LICENSE">
    <img src="https://img.shields.io/github/license/benjifs/sparkles?color=A1A1F1&style=flat" alt="Project License">
  </a>
  <a target="_blank" href="https://github.com/benjifs/sparkles/releases">
    <img src="https://img.shields.io/github/v/release/benjifs/sparkles?color=C49EE7&label=version&style=flat" alt="Latest Version">
  </a>
  <a target="_blank" href="https://github.com/benjifs/sparkles/commits/main">
    <img src="https://img.shields.io/github/last-commit/benjifs/sparkles?color=E69BDD&style=flat" alt="Latest Commit">
  </a>
</div>

[sparkles](https://sparkles.sploot.com) is a [Micropub](https://micropub.spec.indieweb.org/) client. It supports [IndieAuth](https://indieauth.net/) for login and expects a [micropub endpoint](https://indieweb.org/Micropub/Servers) to communicate with to publish posts. It supports basic micropub content types and you can also add movies you have watched.

sparkles can also be installed as a [Progressive Web App (PWA)](https://web.dev/progressive-web-apps/) on supported devices which will add the app as a **share target** and also add some quick action options.

You can read more about this project [here](https://benji.dog/articles/sparkles/) and try it for yourself at: https://sparkles.sploot.com

## Development

### Requirements
* `node 18.12.1`
* `npm 8.19.2`
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
