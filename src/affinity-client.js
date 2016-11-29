'use strict';
const fetchres = require('fetchres');
/**
* constructs a path to send to our proxy
* const affinityClient = new AffinityClient(apiroot);
* Usage:
* affinityClient.popular({query: {count: 5}});
* affinityClient.article({id:'someid'});
* affinityClient.article({id:'someid', uId:{'userid'});
**/
class AffinityClient {
	constructor (options) {
		if (!options.apiRoot) {
			throw 'Affinity client must be constructed with an api root';
		}
		this.apiRoot = options.apiRoot;
	}

	getJson (endpoint, options) {
		return fetch(this.apiRoot + endpoint + this.getQueryString(options))
			.then(fetchres.json)
			.then(data => { return data; });
	}

	popular (options) {
		const endpoint = '/popular';
		return this.getJson(endpoint, options);
	}

	article (options) {
		if (options && options.id) {
			let endpoint = `/article/${options.id}`;
			if (options.uid) {
				endpoint += `/user/${options.uid}`
			}
			return this.getJson(endpoint, options);
		}
	}

		/**
		* @param {Object} options checks for a query object, serializes it if there is one
		* @returns {String} query string including starting '?'
		**/
		getQueryString (options) {
			return (options && options.query && options.query.constuctor === Object) ? `?${this.serialize(options.query)}` : '';
		}

		/**
		* @param {Object} queryObject query expressed as an object
		* @returns {String} uri encoded string of these objects joined with ampersands
		**/
		serialize (queryObject) {
			const queryArray = Object.keys(queryObject).map(key => {
				return `${encodeURIComponent(key)}=${encodeURIComponent(queryObject[key])}`;
			});
			const querystring = queryArray.join('&');
			return querystring;
		}
}

export default AffinityClient
