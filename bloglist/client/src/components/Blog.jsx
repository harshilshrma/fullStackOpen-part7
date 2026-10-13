import { useNavigate } from "react-router-dom";
import "../App.css";
import { useBlogsActions } from "../store";
import { formatUrl } from "../utils";

const Blog = ({
  blog,
  user,
  isVisible,
  toggleVisibility,
  handleBlogVisit
}) => {
  const showRemoveButton = blog.user && user && blog.user.id === user.id;
  const { handleLike, handleRemove } = useBlogsActions()
  const navigate = useNavigate()

  const handleRemoveBlogClick = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      await handleRemove(blog)
      navigate("/")
    }
  };

  return (
    <div className="blog-container">
      <div className="blog-title">
        {blog.title} – {blog.author}
        <button onClick={() => toggleVisibility(blog.id)}>
          {isVisible ? "Hide" : "View"}
        </button>
        <button onClick={() => handleBlogVisit(blog.id)}>
          Visit this blog!
        </button>
      </div>
      {isVisible && (
        <div>
          <div className="blog-content">
            <a href={formatUrl(blog.url)} target="_blank">
              {blog.url}
            </a>
            <div className="likes-container">
              Likes: {blog.likes}
              {user ? (
                <button onClick={() => handleLike(blog)}>like</button>
              ) : (
                <p>
                  (<a href="/login">Log in</a> to like this blog!)
                </p>
              )}
            </div>
            {blog.user && (
              <span>
                Created by {blog.user.name} ({blog.user.username})
              </span>
            )}
          </div>
          {showRemoveButton && (
            <button
              className="blog-remove-button"
              onClick={() => handleRemoveBlogClick(blog)}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
