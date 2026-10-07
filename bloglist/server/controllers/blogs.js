const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const user = request.user
    const blogWithUser = {
        ...request.body,
        user: user._id
    }
    const createdBlog = new Blog(blogWithUser)

    const savedBlog = await createdBlog.save()
    
    user.blogs = [...user.blogs, savedBlog._id]
    await user.save()
    
    await savedBlog.populate('user', { username: 1, name: 1})
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const { id } = request.params
    const user = request.user

    const blogToDelete = await Blog.findById(id)
    if (!blogToDelete) {
        return response.status(404).json({ message: 'Blog not found!' })
    }

    if (!blogToDelete.user) {
        return response.status(403).json({
            error: 'Invalid deletion - this blog has no associated user.'
        })
    }

    if (blogToDelete.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'Invalid deletion - only the creator can delete a blog.' })
    }

    await Blog.findByIdAndDelete(id);

    return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const newBlog = request.body

    const fetchedBlog = await Blog.findById(request.params.id)
    if (!fetchedBlog) return response.status(404).end()

    fetchedBlog.user = newBlog.user
    fetchedBlog.likes = newBlog.likes
    fetchedBlog.author = newBlog.author
    fetchedBlog.title = newBlog.title
    fetchedBlog.url = newBlog.url

    const updateResponse = await fetchedBlog.save()
    await updateResponse.populate('user', { username: 1, name: 1 })
    response.status(200).json(updateResponse)
})

module.exports = blogsRouter
