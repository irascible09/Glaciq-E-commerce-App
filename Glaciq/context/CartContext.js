import { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const CartContext = createContext()

const CART_KEY = '@cart_items'

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  /* -------- LOAD CART ON APP START -------- */
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_KEY)
        if (storedCart) {
          setCartItems(JSON.parse(storedCart))
        }
      } catch (err) {
        console.log('Failed to load cart', err)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  /* -------- SAVE CART ON CHANGE -------- */
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems))
    }
  }, [cartItems, loading])

  /* -------- CART ACTIONS -------- */
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const decreaseQty = (id) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = async () => {
    setCartItems([])
    await AsyncStorage.removeItem(CART_KEY)
  }

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart,
        totalQuantity,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
