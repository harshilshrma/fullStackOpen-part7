import { create } from 'zustand'

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

export default useNotificationStore