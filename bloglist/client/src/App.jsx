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
          {notification && <Notification />}

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  user={user}
                  blogs={blogs}
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
                <SingleBlog blogs={blogs} />
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
