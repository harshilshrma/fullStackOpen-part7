import { Alert } from "@mui/material";
import { useNotification } from "../store";

const Notification = () => {
  const notification = useNotification()

  return (
    <Alert
      variant="filled"
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={notification.type}
    >
      {notification.text}
    </Alert>
  );
};

export default Notification;
