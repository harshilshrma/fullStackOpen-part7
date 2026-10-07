import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addBlog = async (blog, authToken) => {
  const response = await axios.post(
    baseUrl,
    blog,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  )
  return response.data
}

const addLike = async (blog) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog)
  return response.data
}

const removeBlog = async (id, authToken) => {
  const response = await axios.delete(
    `${baseUrl}/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  )
  return response.data
}

export default { getAll, addBlog, addLike, removeBlog }
