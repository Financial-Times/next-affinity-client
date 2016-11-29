'use strict';

const AffinityApi = require('./src/affinity-api.js');

module.exports = new AffinityApi({
	apiRoot: process.env.AFFINITY_API_URL,
	headers: {
		'X-API-KEY': process.env.AFFINITY_API_KEY
	}
});
