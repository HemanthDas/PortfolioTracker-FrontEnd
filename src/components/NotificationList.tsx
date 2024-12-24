import React from "react";

import Notification from "./Notification";
import { useNotification } from "../hooks/customHook";

const NotificationList: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-5 right-5 space-y-4">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationList;
