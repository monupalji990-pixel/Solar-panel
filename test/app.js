// export {};
// for testing

const app = require('../dist/bin/app');
var request = require('supertest')
var agent = request.agent(app)

require('../dist/test/cases/index')(agent,'case1')
// require('./cases/index')(agent,'case2')
