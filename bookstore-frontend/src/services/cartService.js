const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api';
const getToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Authentication token not found. Please log in.');
    }
    return token;
};

export const addToCart = async (bookId, quantity = 1) => {
    try {
        const token = getToken();
       
        const response = await fetch(`${API_BASE_URL}/cart`, { 
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId, quantity })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' })); 
            throw new Error(`Failed to add book to cart: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const data = await response.json(); 
        return { success: true, data };
    } catch (error) {
        console.error('Error adding book to cart:', error);
        return { success: false, message: error.message || 'Failed to add book to cart.' };
    }
};

export const getCartItems = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`Failed to fetch cart items: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const data = await response.json(); 
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return { success: false, message: error.message || 'Failed to fetch cart items.' };
    }
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}?quantity=${quantity}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`Failed to update cart item quantity: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const responseText = await response.text();
        let data = null;
        try {
            data = JSON.parse(responseText); 
        } catch (e) {
            data = { message: responseText }; 
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return { success: false, message: error.message || 'Failed to update cart item quantity.' };
    }
};

export const removeCartItem = async (cartItemId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 204) {
            return { success: true, message: 'Item removed from cart.' };
        } else if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`Failed to remove cart item: ${response.status} - ${errorData.message || response.statusText}`);
        }
        throw new Error('Unexpected response status or content when removing item.');

    } catch (error) {
        console.error('Error removing cart item:', error);
        return { success: false, message: error.message || 'Failed to remove cart item.' };
    }
};

export const clearUserCart = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/cart/clear`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 204) {
            return { success: true, message: 'Cart cleared successfully.' };
        } else if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`Failed to clear cart: ${response.status} - ${errorData.message || response.statusText}`);
        }
        throw new Error('Unexpected response status when clearing cart.');

    } catch (error) {
        console.error('Error clearing cart:', error);
        return { success: false, message: error.message || 'Failed to clear cart.' };
    }
};