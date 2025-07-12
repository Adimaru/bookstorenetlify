const API_BASE_URL = 'http://localhost:8080/api'; 
const getToken = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        throw new Error('Authentication token not found. Please log in.');
    }
    
    try {
        const user = JSON.parse(storedUser);
        const token = user.accessToken; 
        
        if (!token) {
            throw new Error('Authentication token not found in user data. Please log in.');
        }
        return token;
    } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        throw new Error('Invalid user data in storage. Please log in again.');
    }
};

export const placeOrder = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to place order: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Error placing order:', error);
        return { success: false, message: error.message || 'Failed to place order.' };
    }
};

export const getUserOrders = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch orders: ${response.status} - ${errorText}`);
        }

        const data = await response.json(); 
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { success: false, message: error.message || 'Failed to fetch orders.' };
    }
};

export const getOrderById = async (orderId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch order ${orderId}: ${response.status} - ${errorText}`);
        }

        const data = await response.json(); 
        return { success: true, data };
    } catch (error) {
        console.error(`Error fetching order ${orderId}:`, error);
        return { success: false, message: error.message || `Failed to fetch order ${orderId}.` };
    }
};