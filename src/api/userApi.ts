export const createUser = async (username: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  console.log("BACKEND_URL", BACKEND_URL);
  try {
    const response = await fetch(`${BACKEND_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error creating user ${username}:`, error);
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching user by id ${userId}:`, error);
    throw error;
  }
};

export const getUserByUsername = async (username: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/users/username/${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching user by username ${username}:`, error);
    throw error;
  }
};
