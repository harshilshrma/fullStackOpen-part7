import { useEffect, useState } from 'react'
import Blog from './Blog'

const Home = ({ user, blogs, handleLike, handleRemoveBlog, handleBlogVisit }) => {
    const [visibilityList, setVisibilityList] = useState([])
    const allBlogsVisible = visibilityList.length > 0 && visibilityList.every(obj => obj.visibility)

    useEffect(() => {
        setVisibilityList(prevList =>
            blogs.map(blog => {
                const existing = prevList.find(obj => obj.id == blog.id)
                return existing || { id: blog.id, visibility: false }
            })
        )
    }, [blogs])

    const toggleVisibility = (id) => {
        setVisibilityList(prevList =>
            prevList.map(obj =>
                obj.id === id ? { ...obj, visibility: !obj.visibility } : obj
            )
        )
    }

    const handleViewAllBlogs = () => {
        setVisibilityList(prevList =>
            prevList.map(obj => ({ ...obj, visibility: true }))
        )
    }

    const handleHideAllBlogs = () => {
        setVisibilityList(prevList =>
            prevList.map(obj => ({ ...obj, visibility: false }))
        )
    }

    const handleRemoveBlogClick = (blog) => {
        if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
            handleRemoveBlog(blog)
        }
    }

    return (
        <div>
            <h2 className='title'>Blogs</h2>
            <div className='container'>
                <div className='user-login'>
                    {user && <h3>Hi {user.name} ({user.username}), you are logged in!</h3>}
                </div>
                {blogs.length > 0 &&
                    <div className='top-buttons'>
                        <button onClick={allBlogsVisible ? handleHideAllBlogs : handleViewAllBlogs}>{allBlogsVisible ? 'Hide All Blogs' : 'View All Blogs'}</button>
                    </div>
                }
                <div className='blog-parent'>
                    {blogs.map(blog => {
                        const isBlogVisible = visibilityList.find(visi => visi.id === blog.id)?.visibility ?? false
                        return (
                            <Blog
                                key={blog.id}
                                blog={blog}
                                handleLike={handleLike}
                                user={user}
                                handleRemoveBlogClick={handleRemoveBlogClick}
                                isVisible={isBlogVisible}
                                toggleVisibility={toggleVisibility}
                                handleBlogVisit={handleBlogVisit}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Home