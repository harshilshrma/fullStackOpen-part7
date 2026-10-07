// part4\bloglist\tests\blog_api.test.js

const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const Blog = require('../models/blogs.js')
const User = require('../models/users.js')

const api = supertest(app)

let testAuthToken
const initialBlogs = [
    {
        title: "test title 1",
        author: "cccccc",
        url: "c",
        likes: 100
    },
    {
        title: "test title 2",
        author: "dv",
        url: "sdvv",
        likes: 23
    },
]

beforeEach(async () => {
    // clean existing blogs and users
    await Blog.deleteMany({})
    await User.deleteMany({})

    // create user
    const testUser = {
        username: "test",
        name: "Test User",
        password: "hello123"
    }
    await api.post('/api/users').send(testUser)

    // login test user and save token
    const response = await api.post('/api/login').send(testUser)
    testAuthToken = response.body.token

    // save 2 test blogs
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0];

    assert(firstBlog.hasOwnProperty("id"));
})

test('making an HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
    const testBlog = {
        title: "test blog",
        author: "abvdd",
        url: ".com",
        likes: 3
    }

    await api
        .post('/api/blogs')
        .send(testBlog)
        .set('Authorization', `Bearer ${testAuthToken}`);
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    const blogsTitleArray = response.body.map(blog => blog.title)
    assert(blogsTitleArray.includes("test blog"))
})

test('verifies that missing likes property default to 0', async () => {
    const testBlog = {
        title: "test blog",
        author: "abvdd",
        url: ".com",
    }

    const returnedNewBlog = await api
        .post('/api/blogs')
        .send(testBlog)
        .set('Authorization', `Bearer ${testAuthToken}`)
    assert.strictEqual(returnedNewBlog.body.likes, 0);
})

test('verifies that missing title and url responds with 400 status code', async () => {
    const missingTitleBlog = {
        author: "abvdd",
        url: ".com",
    }

    const missingUrlBlog = {
        title: "test blog",
        author: "abvdd",
    }

    await api
        .post('/api/blogs')
        .send(missingTitleBlog)
        .set('Authorization', `Bearer ${testAuthToken}`)
        .expect(400)
    await api
        .post('/api/blogs')
        .send(missingUrlBlog)
        .set('Authorization', `Bearer ${testAuthToken}`)
        .expect(400)
})

test('making an HTTP DELETE request to the /api/blogs/:id URL successfully deletes a blog', async () => {
    const testBlog = {
        title: "test blog",
        author: "abvdd",
        url: ".com",
        likes: 2
    }

    const addedTestBlogResponse = await api
        .post('/api/blogs')
        .send(testBlog)
        .set('Authorization', `Bearer ${testAuthToken}`)
    const id = addedTestBlogResponse.body.id;

    // confirm the test blogs increased by 1
    const res = await api.get('/api/blogs')
    assert.strictEqual(res.body.length, initialBlogs.length + 1)

    // delete the testBlog
    await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${testAuthToken}`)
        .expect(204)

    // confirm the testBlog is deleted
    const afterDeletionResponse = await api.get('/api/blogs')
    assert.strictEqual(afterDeletionResponse.body.length, initialBlogs.length)

    const blogsArray = afterDeletionResponse.body.map(blog => blog.id);
    assert.ok(!blogsArray.includes(id))
})

test(`making an HTTP PUT request to the /api/blogs/:id URL successfully updates a blog's likes count`, async () => {
    const response = await api.get('/api/blogs/')
    const firstBlogId = response.body[0].id;

    const updatedLikesPayload = { "likes": 999 }

    await api.put(`/api/blogs/${firstBlogId}`)
        .send(updatedLikesPayload)
        .expect(200)

    const newResponse = await api.get('/api/blogs/')
    const updatedBlog = newResponse.body.find(
        blog => blog.id == firstBlogId
    )

    assert.strictEqual(updatedBlog.likes, updatedLikesPayload.likes)
})

test('adding a blog fails with the proper status code 401 Unauthorized if a token is not provided', async() => {
    const testBlog = {
        title: "test blog",
        author: "abvdd",
        url: ".com",
        likes: 2
    }

    const response = await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(401)
})

after(async () => {
    await mongoose.connection.close()
})
