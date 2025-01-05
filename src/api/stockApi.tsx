const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const addStock = async (userId: number, stock: object) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/stocks/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stock),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error adding stock for userId ${userId}:`, error);
    throw error;
  }
};

export const updateStock = async (id: number, stock: object) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/stocks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stock),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating stock with id ${id}:`, error);
    throw error;
  }
};

export const deleteStock = async (id: number) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/stocks/${id}`, {
      method: "DELETE",
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
    console.error(`Error deleting stock with id ${id}:`, error);
    throw error;
  }
};

export const getStockByUserIdAndSymbol = async (
  userId: number,
  symbol: string
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/stocks/user/${userId}/${symbol}`,
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
      `Error fetching stock by userId ${userId} and symbol ${symbol}:`,
      error
    );
    throw error;
  }
};
export const getStockById = async (id: number) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/stocks/${id}`, {
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
    console.error(`Error fetching stock by id ${id}:`, error);
    throw error;
  }
};

export const getStocksByUser = async (userId: number) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/stocks/user/${userId}`, {
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
    console.error(`Error fetching stocks for userId ${userId}:`, error);
    throw error;
  }
};
export const getStockDetailsBySymbol = async (symbol: string) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/stocks/details/${symbol}`,
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
    console.error(`Error fetching stock details for symbol ${symbol}:`, error);
    throw error;
  }
};

export const getIntradayDataBySymbol = async (symbol: string) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/stocks/${symbol}/intra-day`,
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
    console.error(`Error fetching intraday data for symbol ${symbol}:`, error);
    throw error;
  }
};
