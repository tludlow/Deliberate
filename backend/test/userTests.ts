import { query } from '../src/db'
import request from 'supertest'
import app from '../src/index'
import chai from 'chai'
let expect = chai.expect

describe('User Authentication', () => {
    before('Clear the user from the database we are about to create', async () => {
        let res = await query('DELETE FROM users WHERE email=$1', ['wowthisisacoolemailfortesting123@testing.com'])
    })
    it('should throw an error because the passwords do not match', (done) => {
        request(app)
            .post('/user/register')
            .send({
                firstName: 'Testing',
                lastName: 'User',
                email: 'wowthisisacoolemailfortesting123@testing.com',
                password: 'testingpassword',
                confirmPassword: 'testpassword',
            })
            .end(function (err, res) {
                if (err) done(err)
                expect(res.status).to.equal(500)
                expect(res.body.message).to.equal('Your passwords do not match')
                done()
            })
    })

    it('should throw an error because the email is not valid', (done) => {
        request(app)
            .post('/user/register')
            .send({
                firstName: 'Testing',
                lastName: 'User',
                email: 'wowthisisacoolemailfortesting123testing.com',
                password: 'testingpassword',
                confirmPassword: 'testingpassword',
            })
            .end(function (err, res) {
                if (err) done(err)
                expect(res.status).to.equal(500)
                expect(res.body.message).to.equal('Your email is not valid')
                done()
            })
    })

    it('should create a new user', (done) => {
        request(app)
            .post('/user/register')
            .send({
                firstName: 'Testing',
                lastName: 'User',
                email: 'wowthisisacoolemailfortesting123@testing.com',
                password: 'testingpassword',
                confirmPassword: 'testingpassword',
            })
            .end(function (err, res) {
                if (err) done(err)
                expect(res.status).to.equal(200)
                expect(res.body.name).to.equal('Testing User')
                expect(res.body.email).to.equal('wowthisisacoolemailfortesting123@testing.com')
                expect(res.body.accessToken).to.be.an('string').that.is.not.empty
                expect(res.body.refreshToken).to.be.an('string').that.is.not.empty
                done()
            })
    })
    it('should throw an error because this email is already used', (done) => {
        request(app)
            .post('/user/register')
            .send({
                firstName: 'Testing',
                lastName: 'User',
                email: 'wowthisisacoolemailfortesting123@testing.com',
                password: 'testingpassword',
                confirmPassword: 'testingpassword',
            })
            .end(function (err, res) {
                if (err) done(err)
                expect(res.status).to.equal(500)
                expect(res.body.message).to.equal('This email is already registered to an account')
                done()
            })
    })
    it('should throw an error because the user provided doesnt exist', (done) => {
        request(app)
            .post('/user/login')
            .send({
                email: 'randomnonexistentuserinthesystem@cooltest.com',
                password: 'wrongtestingpassword',
            })
            .end(function (err, res) {
                if (err) done(err)
                expect(res.status).to.equal(400)
                expect(res.body.message).to.equal('A user with that email / password does not exist')
                done()
            })
    })
    it('should throw an error because the wrong email / password combination is used', (done) => {
        request(app)
            .post('/user/login')
            .send({
                email: 'wowthisisacoolemailfortesting123@testing.com',
                password: 'wrongtestingpassword',
            })
            .end(function (err, res) {
                if (err) done(err)
                expect(res.status).to.equal(400)
                expect(res.body.message).to.equal('Wrong email / password combination')
                done()
            })
    })
    it('should log in the user and provide tokens', (done) => {
        request(app)
            .post('/user/login')
            .send({
                email: 'wowthisisacoolemailfortesting123@testing.com',
                password: 'testingpassword',
            })
            .end(function (err, res) {
                if (err) done(err)
                expect(res.status).to.equal(200)
                expect(res.body.name).to.equal('Testing User')
                expect(res.body.email).to.equal('wowthisisacoolemailfortesting123@testing.com')
                expect(res.body.accessToken).to.be.an('string').that.is.not.empty
                expect(res.body.refreshToken).to.be.an('string').that.is.not.empty
                done()
            })
    })
    after('Clear the user from the database we just created', async () => {
        let res = await query('DELETE FROM users WHERE email=$1', ['wowthisisacoolemailfortesting123@testing.com'])
    })
})
