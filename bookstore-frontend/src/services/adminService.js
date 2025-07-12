const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';
export const populateBooks = async (query = 'programming', maxResults = 10) => {
  try {
    const token = localStorage.getItem('token'); 

    if (!token) {
        throw new Error('Authentication token not found. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/admin/books/populate?query=${query}&maxResults=${maxResults}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) 
    });

    if (!response.ok) { 
      const errorText = await response.text();
      if (response.status === 401 || response.status === 403) {
          throw new Error(`Authentication/Authorization error (${response.status}). Please check your login and role.`);
      } else if (response.status >= 500) {
          throw new Error(`Server error (${response.status}): ${errorText || 'Internal Server Error'}. Check backend logs.`);
      } else { 
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText || 'Unknown error'}`);
      }
    }

    const message = await response.text();
    return { success: true, message };
  } catch (error) {
    console.error('Error populating books:', error);
    return { success: false, message: error.message || 'Failed to populate books.' };
  }
};