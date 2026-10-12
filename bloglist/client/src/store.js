import { create } from 'zustand'
import blogService from './services/blogs'
import loginService from './services/login'

const sortByLikes = (a, b) => b.likes - a.likes

let notificationTimeout
const useNotificationStore = create((set) => ({
    notification: null,
    actions: {
        setAndRemoveNotification: (notif) => {
            if (notificationTimeout) {
                clearTimeout(notificationTimeout)
            }

            set({ notification: notif })

            notificationTimeout = setTimeout(() => {
                set({ notification: null })
            }, 5000)
        }
    }
}))
export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)


const useUserStore = create((set) => ({
    user: null,
    actions: {
        initializeUser: () => {
            const loggedUserJSON = window.localStorage.getItem("loggedUser");
            if (loggedUserJSON) {
                set(() => ({ user: JSON.parse(loggedUserJSON) }))
            }
        },

        handleUserLogin: async (username, password) => {
            const { setAndRemoveNotification } = useNotificationStore.getState().actions
            try {
                const user = await loginService.login({ username, password });
                set(() => ({ user: user }))
                window.localStorage.setItem("loggedUser", JSON.stringify(user));
                setAndRemoveNotification(null);
                return true;
            } catch (error) {
                setAndRemoveNotification({ text: error.response.data.error, type: "error" });
                return false;
            }
        },

        handleUserLogout: (event) => {
            const { setAndRemoveNotification } = useNotificationStore.getState().actions

            event.preventDefault();
            window.localStorage.removeItem("loggedUser");
            set(() => ({ user: null }))
            setAndRemoveNotification(null);
        }
    }
}))
export const useUser = () => useUserStore(state => state.user)
export const userUserActions = () => useUserStore(state => state.actions)

const useBlogsStore = create((set) => ({
    blogs: [],
    actions: {
        initializeBlogs: async () => {
            const blogs = await blogService.getAll()
            set(() => ({ blogs: blogs.toSorted(sortByLikes) }))
        },

        addNewBlog: async (title, author, url, likes) => {
            const { setAndRemoveNotification } = useNotificationStore.getState().actions
            const user = useUserStore.getState().user
            try {
                const newBlog = await blogService.addBlog(
                    { title, author, url, likes },
                    user.token,
                );

                set((state) => ({ 
                    blogs: state.blogs.concat(newBlog).toSorted(sortByLikes)
                }))
                
                setAndRemoveNotification({
                    text: `A new blog "${title}" by ${author} has been added!`,
                    type: "success",
                });
                
                return true;
            } catch (error) {
                setAndRemoveNotification({ text: error.response.data.error, type: "error" });
                return false;
            }
        }
    }
}))
export const useBlogs = () => useBlogsStore(state => state.blogs)
export const useBlogsActions = () => useBlogsStore(state => state.actions)
