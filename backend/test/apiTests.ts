import app from '../src/index'
import request from 'supertest'
import chai from 'chai'
let expect = chai.expect

describe('API Tests', () => {
    it('should be able to ping the web server', (done) => {
        request(app).get('/ping').expect(200, done)
    })
    it('should throw a 404 error because this endpoint doesnt exist', function (done) {
        request(app)
            .get('/hellothisisarandomendpointthatwontexist')
            .end(function (err, res) {
                expect(res.status).to.equal(404)
                expect(res.body.status).to.equal('not found')
                done()
            })
    })
})
