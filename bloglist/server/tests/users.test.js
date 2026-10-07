const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const User = require('../models/users')
const helper = require('./test_helper')
const app = require('../app.js')
const supertest = require('supertest')
const api = supertest(app)

describe('when there is initially one user is db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'harshil',
            name: 'Harshil Sharma',
            password: 'abcdefgh'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper status code and message if username already taken', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Diff user',
            password: 'abc'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper status code and message when username is not given', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'Diff user',
            password: 'abc'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Username & Password both are required!'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper status code and message when password is not given', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'abcd',
            name: 'Diff user',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Username & Password both are required!'))
        
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper status code and message when username is less than 3 characters', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ro',
            name: 'Diff user',
            password: 'asfdg'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Username should be of 3 or more characters'))
        
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper status code and message when password is less than 3 characters', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'rocket',
            name: 'Diff user',
            password: 'ac'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Password should be of 3 or more characters'))
        
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
