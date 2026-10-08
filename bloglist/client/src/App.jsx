import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import SingleBlog from "./components/SingleBlog";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import CreateNewBlogForm from "./components/CreateNewBlogForm";
import Notification from "./components/Notification";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import ErrorBoundary from "./components/ErrorBoundary";
import CatchAll from "./components/CatchAll";
import { useNotification, useNotificationActions } from "./store";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const notification = useNotification()
  const { setAndRemoveNotification } = useNotificationActions() 
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs.sort((a, b) => b.likes - a.likes));
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      setAndRemoveNotification(null);
      navigate("/");
      return true;
    } catch (error) {
      setAndRemoveNotification({ text: error.response.data.error, type: "error" });
      return false;
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedUser");
    setUser(null);
    setAndRemoveNotification(null);
    navigate("/");
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

  const addNewBlog = async (title, author, url, likes) => {
    try {
      const response = await blogService.addBlog(
        { title, author, url, likes },
        user.token,
      );

      const newBlogsArray = blogs.concat(response);
      newBlogsArray.sort((a, b) => b.likes - a.likes);
      setBlogs(newBlogsArray);

      setAndRemoveNotification({
        text: `A new blog "${title}" by ${author} has been added!`,
        type: "success",
      });
      navigate("/");
      return true;
    } catch (error) {
      setAndRemoveNotification({ text: error.response.data.error, type: "error" });
      return false;
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
              element={<Login user={user} handleLogin={handleLogin} />}
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
              element={<CreateNewBlogForm user={user} addBlog={addNewBlog} />}
            />
            <Route path="*" element={<CatchAll />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
