import { useAuth } from \"@/hooks/useAuth\"; // Adjust path if needed

const API_BASE_URL = process.env.REACT_APP_API_URL || \"http://localhost:5000\"; // Use environment variable

interface FetchOptions extends RequestInit {
  // Add any custom options if needed
}

// Utility function to make authenticated API calls
export const fetchWithAuth = async (endpoint: string, options: FetchOptions = {}, token: string | null): Promise<Response> => {
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set(\"Authorization\", `Bearer ${token}`);
  }

  // Set default content type if not provided for methods that usually have a body
  if (!headers.has(\"Content-Type\") && options.body) {
    headers.set(\"Content-Type\", \"application/json\");
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const url = `${API_BASE_URL}${endpoint.startsWith(\"/\") ? endpoint : \"/\" + endpoint}`;

  try {
    const response = await fetch(url, config);
    
    // Handle common errors like 401 Unauthorized (e.g., redirect to login or refresh token)
    if (response.status === 401) {
      // Example: Clear token and redirect
      console.error(\"Authentication error: Token might be invalid or expired.\");
      // Potentially call a logout function or redirect
      // For MVP, just log the error
    }
    
    return response;
  } catch (error) {
    console.error(\"API fetch error:\", error);
    // Re-throw the error or return a custom error response
    throw error;
  }
};

// Example of a hook to simplify data fetching in components
// You might create more specific hooks like usePatients, useAnalyticsData etc.
export const useApi = () => {
  const { token } = useAuth();

  const get = async (endpoint: string, options: FetchOptions = {}) => {
    return fetchWithAuth(endpoint, { ...options, method: \"GET\" }, token);
  };

  const post = async (endpoint: string, body: any, options: FetchOptions = {}) => {
    return fetchWithAuth(endpoint, { ...options, method: \"POST\", body: JSON.stringify(body) }, token);
  };

  const put = async (endpoint: string, body: any, options: FetchOptions = {}) => {
    return fetchWithAuth(endpoint, { ...options, method: \"PUT\", body: JSON.stringify(body) }, token);
  };

  const del = async (endpoint: string, options: FetchOptions = {}) => {
    return fetchWithAuth(endpoint, { ...options, method: \"DELETE\" }, token);
  };

  return { get, post, put, del };
};

