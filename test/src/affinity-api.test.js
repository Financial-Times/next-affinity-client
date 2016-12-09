const expect = require('chai').expect;
const sinon = require('sinon');
const fetchMock = require('fetch-mock');
const AffinityApi = require('../../src/affinity-api');


describe('Affinity API Client - serverside', () => {
	it('throws an error if not given an api root', () => {
		expect(function (){ new AffinityApi }).to.throw(Error);
	});
	it('returns an instance with the api root and headers', () => {
		const instance = new AffinityApi({
			apiRoot: 'someUrl',
			headers: {'foo': 'bar'}
		});
		expect(instance.apiRoot).to.equal('someUrl');
		expect(instance.headers).to.have.property('foo', 'bar');
	});

	describe('building requests', () => {
		let instance;
		beforeEach(() => {
			fetchMock.mock('*', {});
			instance = new AffinityApi({
				apiRoot: 'api'
			});
		});
		afterEach(() => {
			instance = null;
			fetchMock.restore();
		});

		it('builds an endpoint call with the type', () => {
			instance.buildRequest({
				params: {
					type: 'article'
				}
			});
			expect(fetchMock.lastUrl()).to.equal('api/article');
		});

		it('does nothing if given an invalid type', () => {
			instance.buildRequest({
				params: {
					type: 'foo'
				}
			});
			expect(fetchMock.called()).to.be.false;
		});

		it('builds an endpoint call with the type and id', () => {
			instance.buildRequest({
				params: {
					type: 'article',
					id: '123'
				}
			});
			expect(fetchMock.lastUrl()).to.equal('api/article/123');
		});

		it('won`t use an invalid id', () => {
			instance.buildRequest({
				params: {
					type: 'article',
					id: '%'
				}
			});
			expect(fetchMock.lastUrl()).to.equal('api/article');
		});

		it('builds an endpoint call with the type and id', () => {
			instance.buildRequest({
				params: {
					type: 'article',
					id: '123'
				}
			});
			expect(fetchMock.lastUrl()).to.equal('api/article/123');
		});

		it('passes through the query', () => {
			instance.buildRequest({
				params: {
					type: 'popular'
				},
				query: {
					count: 5
				}
			});
			expect(fetchMock.lastUrl()).to.equal('api/popular?count=5');
		});

		it('has a convenience endpoint for popular articles', () => {
			sinon.stub(instance, 'buildRequest');
			instance.popular();
			expect(instance.buildRequest.called).to.equal(true);
			expect(instance.buildRequest.args[0][0]).to.have.property('type', 'popular');
			instance.buildRequest.restore();
		});
	});
});
