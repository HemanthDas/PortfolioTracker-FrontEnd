import { createContext, useState, ReactNode } from "react";

// Define the User type
type User = {
  id: number;
  username: string;
};

// Define the context value type
type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
export { UserContext };