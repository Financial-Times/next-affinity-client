'use strict';
const logger = require('@financial-times/n-logger').default;
const fetchres = require('fetchres');
const url = require('url');

// Enforce a whitelist of acceptable params
const validSort = ['pop', 'rel', 'date'];
const validType = ['popular', 'article'];
const validIdRegex = /^[\w\-\d]+$/i;
/**
* @param {Object} opts apiroot - url for the API, headers - headers for the call (requires X-API-KEY)
* @method popular Get most popular topics
* @method buildRequest Create a url to call the api with
* NB: be careful not to render frequently-changing or individualised content on the server-side for pages that cache
* Usage:
* const affinityApi = new AffinityApi({apiroot, headers})
* affinityApi.popular({count: 5});
* affinnityApi.buildRequest({type: 'article', id: articleId});
* affinnityApi.buildRequest({type: 'behavioural', id: articleId});
**/
class AffinityApi {
	constructor (opts) {
		if (!opts.apiRoot) {
			throw 'Affinity API must be constructed with an api root';
		}
		this.apiRoot = opts.apiRoot;
		this.headers = Object.assign({
			'Content-Type': 'application/json',
		}, opts.headers);
	}

	/**
	* @param {Object} options count - how many to return, sort - sorting order to use
	**/
	popular (options) {
		const query = {};
		if (options) {
			if (options.count && parseInt(options.count)) {
				query.count = options.count;
			}
			if (options.sort && validSort.indexOf(options.sort) !== -1) {
				query.sort = options.sort;
			}
		}
		this.buildRequest({
			type: 'popular',
			query
		});
	}

	/**
	* @param {Object} options
	* params - required, should contain at least type, optionally id
	* query - optional, object that represents a querystring for call to API
	**/
	buildRequest (options) {
		if (options && options.params && validType.indexOf(options.params.type) !== -1) {
			const params = options.params;
			let paths = [params.type];

			if (params.id && validIdRegex.test(params.id)) {
				paths.push(params.id);
			}
			const urlObject = {
				pathname: paths.join('/'),
				query: options.query
			}
			const endpoint = url.format(urlObject);
			return fetch(`${this.apiRoot}/${endpoint}`, {
				headers: this.headers
			})
			.then(fetchres.json)
			.catch(error => {
				logger.warn('Error fetching most popular articles via client', { event: 'AFFINITY_FETCH_MOST_POPULAR_CLIENT_ERROR', msg: error });
			});
		}
		else {
			logger.warn('No parameters passed to buildRequest', {event: 'AFFINITY_BUILD_QUERY_CLIENT_ERROR', msg: 'Missing parameters'});
		}
	}
}

module.exports = AffinityApi;
