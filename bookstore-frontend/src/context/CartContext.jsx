import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext'; 

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth(); 
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [cartError, setCartError] = useState(null);
    const fetchCartItems = useCallback(async () => {
        if (!user || !user.accessToken) {
            setCartItems([]);
            setLoadingCart(false);
            return;
        }

        setLoadingCart(true);
        setCartError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(data || []);
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to fetch cart: Server error' }));
                setCartError(errorData.message);
                toast.error(`Error loading cart: ${errorData.message}`);
                console.error('Failed to fetch cart:', errorData);
                setCartItems([]);
            }
        } catch (error) {
            setCartError('Network error or unexpected issue fetching cart.');
            toast.error(`Network error loading cart: ${error.message}`);
            console.error('Network error fetching cart:', error);
            setCartItems([]);
        } finally {
            setLoadingCart(false);
        }
    }, [user]);

    const removeFromCart = useCallback(async (cartItemId) => {
        if (!user || !user.accessToken) {
            toast.error("Please log in to modify cart items.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/remove/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`
                }
            });

            if (response.ok) {
                const updatedCartItemsList = await response.json();
                setCartItems(updatedCartItemsList);
                toast.info("Item removed from cart.");
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to remove from cart: Server error' }));
                toast.error(`Error removing from cart: ${errorData.message}`);
                console.error('Failed to remove from cart:', errorData);
            }
        } catch (error) {
            toast.error(`Network error removing from cart: ${error.message}`);
            console.error('Network error removing from cart:', error);
        }
    }, [user]);

    const addToCart = useCallback(async (bookId, quantity) => {
        if (!user || !user.accessToken) {
            toast.error("Please log in to add items to the cart.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({ bookId, quantity })
            });

            if (response.ok) {
                const updatedCartItemsList = await response.json();
                setCartItems(updatedCartItemsList);

                const addedItem = updatedCartItemsList.find(item => item.bookId === bookId);
                toast.success(`${quantity} of "${addedItem?.bookTitle || 'Book'}" added to cart!`);
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to add to cart: Server error' }));
                toast.error(`Error adding to cart: ${errorData.message}`);
                console.error('Failed to add to cart:', errorData);
            }
        } catch (error) {
            toast.error(`Network error adding to cart: ${error.message}`);
            console.error('Network error adding to cart:', error);
        }
    }, [user]);

    const updateCartItemQuantity = useCallback(async (cartItemId, quantity) => {
        if (!user || !user.accessToken) {
            toast.error("Please log in to update cart items.");
            return;
        }
        if (quantity <= 0) {
            toast.info("Quantity cannot be less than 1. Removing item from cart.");
            removeFromCart(cartItemId);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({ bookId: cartItemId, quantity })
            });

            if (response.ok) {
                const updatedCartItemsList = await response.json();
                setCartItems(updatedCartItemsList);
                toast.success(`Cart item quantity updated to ${quantity}!`);
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to update cart: Server error' }));
                toast.error(`Error updating cart: ${errorData.message}`);
                console.error('Failed to update cart:', errorData);
            }
        } catch (error) {
            toast.error(`Network error updating cart: ${error.message}`);
            console.error('Network error updating cart:', error);
        }
    }, [user]);

    const clearCart = useCallback(async () => {
        if (!user || !user.accessToken) {
            toast.error("Please log in to clear your cart.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cart/clear`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`
                }
            });

            if (response.ok) {
                const updatedCartItemsList = await response.json();
                setCartItems(updatedCartItemsList);
                toast.info("Your cart has been cleared.");
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to clear cart: Server error' }));
                toast.error(`Error clearing cart: ${errorData.message}`);
                console.error('Failed to clear cart:', errorData);
            }
        } catch (error) {
            toast.error(`Network error clearing cart: ${error.message}`);
            console.error('Network error clearing cart:', error);
        }
    }, [user]);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const getTotalPrice = useCallback(() => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.bookPrice);
            const quantity = parseInt(item.quantity, 10);

            if (!isNaN(price) && !isNaN(quantity)) {
                return total + (price * quantity);
            }
            return total;
        }, 0).toFixed(2);
    }, [cartItems]);

    const placeOrder = useCallback(async () => {
        if (!user || !user.accessToken) {
            toast.error("Please log in to place an order.");
            return { success: false, message: "Not authenticated" };
        }
        if (cartItems.length === 0) {
            toast.warn("Your cart is empty. Please add items before placing an order.");
            return { success: false, message: "Cart is empty" };
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
            });

            if (response.ok) {
                const orderConfirmation = await response.json(); 
                setCartItems([]); 
                toast.success("Order placed successfully! Order ID: " + orderConfirmation.id);
                return { success: true, order: orderConfirmation }; 
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Failed to place order: Server error' }));
                toast.error(`Error placing order: ${errorData.message}`);
                console.error('Failed to place order:', errorData);
                return { success: false, message: errorData.message };
            }
        } catch (error) {
            toast.error(`Network error placing order: ${error.message}`);
            console.error('Network error placing order:', error);
            return { success: false, message: `Network error: ${error.message}` };
        }
    }, [user, cartItems]);

    const contextData = {
        cartItems,
        loadingCart,
        cartError,
        fetchCartItems,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
        placeOrder, 
    };

    return (
        <CartContext.Provider value={contextData}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);