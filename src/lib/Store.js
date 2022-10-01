//https://www.youtube.com/watch?v=_IBlyR5mRzA&t=4244s
import { createContext, useReducer } from 'react'
import Cookies from 'js-cookie'
export const Store = createContext()

const initialState = {
  // set the initial state empty cart
  // cart: { cartItems: [] },
  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart'))
    : { cartItems: [], message: '', instructions:'', style: '' },
}

function reducer(state, action) {


  switch (action.type) {
    case 'CART_ADD_ITEM': {
      //TODO: if cart is empty, create first thankly then put stuff in otherwise use the existing thankly
      let cartItems

      cartItems = state.cart.cartItems.filter((item) => item.type !== 'card')
      cartItems = [...cartItems, action.payload]

      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }), {
        expires: 1 / 600,
      })

      return { ...state, cart: { ...state.cart, cartItems } }
    }

    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.stripeId !== action.payload.stripeId
      )

      Cookies.set('cart', JSON.stringify({ ...state.cart, cartItems }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart, cartItems } }
    }

    case 'CART_SET_STYLE': {
      state.cart.style = action.payload.style

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'CART_SET_MESSAGE': {
      state.cart.message = action.payload

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'CART_SET_INSTRUCTIONS': {
      state.cart.instructions = action.payload

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }


    default:
      return state
  }
}
// provides store info across the website
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <Store.Provider value={value}>{children}</Store.Provider>
}
