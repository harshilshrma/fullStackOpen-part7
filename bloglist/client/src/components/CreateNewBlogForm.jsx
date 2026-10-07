import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const CreateNewBlogForm = ({ user, addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await addBlog(title, author, url, likes)

    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
      setLikes('')
    }
  }

  if (!user) {
    return (
      <p><a href='/login'>Log in</a> to add a new blog!</p>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className='create-new-blog'>
        <h2>Create New Blog</h2>
        <TextField
          label="Title*"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          variant='outlined'
          size='small'
          type="text"
        />
        <TextField
          label="Author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          variant='outlined'
          size='small'
          type="text"
        />
        <TextField
          label="URL*"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          variant='outlined'
          size='small'
          type="text"
        />
        <TextField
          label="Likes"
          value={likes}
          onChange={({ target }) => setLikes(target.value)}
          variant='outlined'
          size='small'
          type="number"
        />
        <div className='create-form-buttons'>
          <Button color='primary' variant='contained' type="submit">Create</Button>
          <Button color='warning' variant='contained' onClick={() => navigate('/')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}

export default CreateNewBlogForm
