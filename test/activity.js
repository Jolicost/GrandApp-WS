process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../api/models/activityModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
	beforeEach((done) => { //Before each test we empty the database
		User.deleteMany({}, (err) => { 
	    	done();           
	    });        
	});

	describe('/GET activity', () => {
      it('it should GET all the activities', (done) => {
        chai.request(server)
            .get('/activities')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

});