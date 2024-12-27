import { createContext, useState, ReactNode, useEffect } from "react";

// Define the User type
export type User = {
  id: number;
  username: string;
};

// Define the context value type
type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  logoutUser: () => void;
};

// Create the UserContext with a default value of null
const UserContext = createContext<UserContextType | null>(null);

// Define the UserProvider component's props
type UserProviderProps = {
  children: ReactNode;
};

// UserProvider to provide the context to its children
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false); // Set loading to false after user is loaded
  }, []);
  const logoutUser = () => {
    setUser(null);
  };
  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user"); // Remove user if set to null
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logoutUser }}>
      {isLoading ? <div>Loading...</div> : children}
    </UserContext.Provider>
  );
};

export { UserContext };
