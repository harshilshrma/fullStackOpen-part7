import '../App.css'
import { formatUrl } from '../utils'

const Blog = ({ blog, handleLike, user, isVisible, toggleVisibility, handleBlogVisit, handleRemoveBlogClick }) => {
  const showRemoveButton = blog.user && user && blog.user.id === user.id

  return (
    <div className='blog-container'>
      <div className='blog-title'>
        {blog.title} – {blog.author}
        <button onClick={() => toggleVisibility(blog.id)}>{isVisible ? 'Hide' : 'View'}</button>
        <button onClick={() => handleBlogVisit(blog.id)}>Visit this blog!</button>
      </div>
      {isVisible &&
        <div>
          <div className='blog-content'>
            <a href={formatUrl(blog.url)} target='_blank'>{blog.url}</a>
            <div className='likes-container'>
              Likes: {blog.likes}
              {user ? <button onClick={() => handleLike(blog)}>like</button> : <p>(<a href='/login'>Log in</a> to like this blog!)</p>}
            </div>
            {blog.user && <span>Created by {blog.user.name} ({blog.user.username})</span>}
          </div>
          {showRemoveButton &&
            <button className='blog-remove-button' onClick={() => handleRemoveBlogClick(blog)}>Remove</button>
          }
        </div>
      }
    </div>
  )
}

export default Blog
