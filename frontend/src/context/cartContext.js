import React, { createContext, useContext, useReducer, useEffect } from "react";

// Define initial state
const initialState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
};

// Create context
const CartContext = createContext();

// Cart reducer function
const cartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM": {
            const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id);

            let updatedItems;

            if (existingItemIndex >= 0) {
                // Item exists, update quantity
                updatedItems = state.items.map((item, index) => {
                    if (index === existingItemIndex) {
                        return {
                            ...item,
                            quantity: item.quantity + action.payload.quantity,
                        };
                    }
                    return item;
                });
            } else {
                // Item doesn't exist, add new one
                updatedItems = [...state.items, action.payload];
            }

            // Calculate new totals
            const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return {
                ...state,
                items: updatedItems,
                totalItems,
                totalPrice,
            };
        }

        case "REMOVE_ITEM": {
            const updatedItems = state.items.filter((item) => item.id !== action.payload.id);

            // Calculate new totals
            const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return {
                ...state,
                items: updatedItems,
                totalItems,
                totalPrice,
            };
        }

        case "UPDATE_QUANTITY": {
            const updatedItems = state.items.map((item) => {
                if (item.id === action.payload.id) {
                    return { ...item, quantity: action.payload.quantity };
                }
                return item;
            });

            // Calculate new totals
            const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return {
                ...state,
                items: updatedItems,
                totalItems,
                totalPrice,
            };
        }

        case "CLEAR_CART":
            return initialState;

        default:
            return state;
    }
};

// Cart provider component
export const CartProvider = ({ children }) => {
    // Load cart from localStorage if available
    const [state, dispatch] = useReducer(cartReducer, initialState, () => {
        try {
            const localData = localStorage.getItem("cart");
            return localData ? JSON.parse(localData) : initialState;
        } catch (error) {
            console.error("Error loading cart from localStorage:", error);
            return initialState;
        }
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state));
    }, [state]);

    // Helper functions for common cart operations
    const addItem = (product, quantity = 1) => {
        dispatch({
            type: "ADD_ITEM",
            payload: {
                ...product,
                quantity,
            },
        });
    };

    const removeItem = (id) => {
        dispatch({
            type: "REMOVE_ITEM",
            payload: { id },
        });
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }

        dispatch({
            type: "UPDATE_QUANTITY",
            payload: { id, quantity },
        });
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" });
    };

    const value = {
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export default CartContext;
