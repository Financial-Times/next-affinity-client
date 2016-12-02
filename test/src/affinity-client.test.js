const expect = require('chai').expect;
const sinon = require('sinon');
const fetchMock = require('fetch-mock');
const AffinityClient = require('../../src/affinity-client').default;

describe('Affinity API Client - clientside', () => {
	let instance;
	beforeEach(() => {
		instance = new AffinityClient({
			apiRoot: '/api'
		});
		fetchMock.get('*', {});
		sinon.spy(instance, 'getJson');
	});
	afterEach(() => {
		fetchMock.restore();
		instance.getJson.restore();
		instance = null;
	});

	it('throws if there is no apiroot', () => {
		expect(function () { new AffinityClient({}) }).to.throw('Affinity client must be constructed with an api root');
	});

	it('returns an instance with the api root', () => {
		expect(instance).to.have.property('apiRoot', '/api');
	});

	it('gets JSON', () => {
		instance.getJson('/foo', {query: { 'foo': 'bar' }});
		expect(fetchMock.lastUrl()).to.equal('/api/foo?foo=bar')
	});

	// getJson (endpoint, options) {
	// 	return fetch(this.apiRoot + endpoint + this.makeQueryString(options))
	// 		.then(fetchres.json)
	// 		.then(data => { return data; });
	// }

	it('has a method to get popular articles', () => {
		instance.popular();
		expect(instance.getJson.args[0][0]).to.equal('/popular');
	});

	it('has a method to get articles', () => {
		instance.article({
			id: 123
		});
		expect(instance.getJson.args[0][0]).to.equal('/article/123')
	});

	it('has a method to get articles with a user id passed through', () => {
		instance.article({
			id: 123,
			uid: 'abc'
		});
		expect(instance.getJson.args[0][0]).to.equal('/article/123/user/abc')
	});

	it('extracts the querystring', () => {
		const options = {
			query: {
				'foo': 'bar'
			}
		}
		const result = instance.makeQueryString(options);
		expect(result).to.equal('?foo=bar');
	});

	it('only accepts an object for the query string handling', () => {
			const badInput = 'lorem';
			const result = instance.makeQueryString(badInput);
			expect(result).to.equal('');
	});

	it('serializes an object into uri encoded key-value pairs joined with &', () => {
		const qObj = {
			'foo': 'bar',
			'bash': 'lorem ipsum'
		};
		const result = instance.serialize(qObj);
		expect(result).to.equal('foo=bar&bash=lorem%20ipsum');
	});
});
