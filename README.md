# Next-Affinity-Client

This client provides client-side and server-side interfaces for calling the Affinity API

## Usage

### Server-side
`npm install ft-next-affinity-client`

Example call
```javascript
const affinityApi = require('ft-next-affinity-client');

affinityApi.popular()
	.then(data => {
		// data of most popular items
	});
```

Articles information should not be called on the server-side on pages that are supposed to cache

### Client-side
`bower install next-affinity-client`

```javascript
const affinityClient = require('next-affinity-client');

affinityClient.popular({count: 5})
	.then(data => {
		// data for top 5 most popular items
	});

affinityClient.article({id: articleId})
	.then(data => {
		//affinity data for this article
	});

affinityClient.article({id: articleId, uid: userId})
	.then(data => {
		//affinity data for this article, removing user's already read items
	});
```
