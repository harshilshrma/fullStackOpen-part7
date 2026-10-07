import { useParams } from 'react-router-dom'
import { formatUrl } from '../utils'
import { Button } from '@mui/material'

const SingleBlog = ({ blogs, user, handleLike, handleRemoveBlog }) => {
    const blogId = useParams().id

    const singleBlog = blogs.find(blog => blog.id === blogId)
    if (!singleBlog) {
        return (
            <div>
                <h3>This blog has been deleted!</h3>
                <p>You can get back to <a href='/'>blogs main page</a> now!</p>
            </div>
        )
    }

    const showRemoveButton = singleBlog.user && user && singleBlog.user.id === user.id

    const handleRemoveBlogClick = (blog) => {
        if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
            handleRemoveBlog(blog)
        }
    }

    return (
        <div className='single-blog-container'>
            <h2>{singleBlog.title}</h2>
            <h3>by {singleBlog.author}</h3>
            <div className='blog-content'>
                <a href={formatUrl(singleBlog.url)} target='_blank'>{singleBlog.url}</a>
                {singleBlog.user && <span>Added by {singleBlog.user.name} ({singleBlog.user.username})</span>}
                <div className='likes-container'>
                    {singleBlog.likes} likes
                    {user
                        ? <Button variant='contained' size='small' onClick={() => handleLike(singleBlog)}>like</Button>
                        : <p>(<a href='/login'>Log in</a> to like this blog!)</p>
                    }
                    {showRemoveButton &&
                        <Button variant='contained' size='small' color='error' className='blog-remove-button' onClick={() => handleRemoveBlogClick(singleBlog)}>Remove</Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default SingleBlog