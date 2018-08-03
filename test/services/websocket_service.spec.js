'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Websocket Service Test Cases', function() {
	it('Should return the primus.js client library', function(done) {
		const expect = chai.expect;

		chai.request('http://localhost:9100')
			.get('/websockets/primus.js')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});
});
