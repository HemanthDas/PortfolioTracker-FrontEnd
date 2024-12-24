import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { NotificationContext } from "../context/NotificationContext";
export function useUser() {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return user;
}
export function useNotification() {
  const notification = useContext(NotificationContext);
  if (!notification) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return notification;
}
