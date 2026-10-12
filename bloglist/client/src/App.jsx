import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import { useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import CatchAll from "./components/CatchAll";
import CreateNewBlogForm from "./components/CreateNewBlogForm";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./components/Home";
import Login from "./components/Login";
import Notification from "./components/Notification";
import SingleBlog from "./components/SingleBlog";
import blogService from "./services/blogs";
import { useBlogs, useBlogsActions, useNotification, useNotificationActions, userUserActions, useUser } from "./store";

const App = () => {
  const notification = useNotification()
  const { setAndRemoveNotification } = useNotificationActions() 
  const user = useUser()
  const blogs = useBlogs()
  const { initializeBlogs, addNewBlog } = useBlogsActions()
  const { initializeUser, handleUserLogin, handleUserLogout } = userUserActions()
  const navigate = useNavigate();

  useEffect(() => {
    initializeBlogs()
    initializeUser()
  }, [initializeBlogs, initializeUser]);

  const handleLogout = (event) => {
    handleUserLogout(event)
    navigate("/")
  };

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    };

    try {
      const response = await blogService.addLike(updatedBlog);
      const newBlogsArray = blogs.map((blog) =>
        blog.id === response.id ? response : blog,
      );
      newBlogsArray.sort((a, b) => b.likes - a.likes);
      setBlogs(newBlogsArray);
    } catch (error) {
      setAndRemoveNotification({ text: error.response.data.error, type: "error" });
    }
  };

  const handleRemoveBlog = async (blog) => {
    try {
      await blogService.removeBlog(blog.id, user.token);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
      navigate("/");
      setAndRemoveNotification({
        text: `Blog "${blog.title}" by ${blog.author} was removed!`,
        type: "info",
      });
    
    } catch (error) {
      setAndRemoveNotification({ text: error.response.data.error, type: "error" });
    }
  };

  const handleBlogVisit = (id) => {
    navigate(`/blogs/${id}`);
  };

  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  return (
    <div>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Button component={Link} color="inherit" to="/" sx={style}>
              Blogs
            </Button>
            {user && (
              <Button component={Link} color="inherit" to="/create" sx={style}>
                Add a new blog
              </Button>
            )}
            {user ? (
              <Button
                component={Link}
                color="error"
                onClick={handleLogout}
                sx={style}
              >
                Logout
              </Button>
            ) : (
              <Button component={Link} color="secondary" to="/login" sx={style}>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <ErrorBoundary>
          { notification && <Notification /> }

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  user={user}
                  blogs={blogs}
                  handleLike={handleLike}
                  handleRemoveBlog={handleRemoveBlog}
                  handleBlogVisit={handleBlogVisit}
                />
              }
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/blogs/:id"
              element={
                <SingleBlog
                  blogs={blogs}
                  user={user}
                  handleLike={handleLike}
                  handleRemoveBlog={handleRemoveBlog}
                />
              }
            />
            <Route
              path="/create"
              element={<CreateNewBlogForm />}
            />
            <Route path="*" element={<CatchAll />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
