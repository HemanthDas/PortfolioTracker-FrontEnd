export const initializePortfolio = async (username: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/portfolio/initialize/${username}`,
      {
        method: "POST",
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
    console.error(`Error initializing portfolio for ${username}:`, error);
    throw error;
  }
};

export const getPortfolioValue = async (userId: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/portfolio/value/${userId}`,
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
    console.error(
      `Error fetching portfolio value for userId ${userId}:`,
      error
    );
    throw error;
  }
};
