//https://www.youtube.com/watch?v=_IBlyR5mRzA&t=4244s
import { createContext, useReducer } from 'react'
import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

export const Store = createContext()

const initialState = {
  // set the initial state empty cart

  cart: Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart'))
    : {
        // thankly: [
        //   {
        id: uuidv4(), // unique id for the thankly
        items: [], //
        message: '',
        instructions: '',
        style: '',
        recipient: {
          firstname: '',
          lastname: '',
          company: '',
          address: {
            state: '',
            postcode: '',
            suburb: '',
            fulladdress: '',
            line2: '',
          },
        },
        voucher: {},
        deliveryOption: {},
        termsAccepted: false,
        subtotal: 0,
        delivery: 0,
        usedVoucher: 0,
        total: 0,
        //   },
        // ],
      },
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      action.payload.type === 'card'
        ? (state.cart.items = state.cart.items.filter(
            (item) => item.type !== 'card'
          ))
        : null

      let items = [...state.cart.items, action.payload]
      Cookies.set('cart', JSON.stringify({ ...state.cart, items }), {
        expires: 1 / 600,
      })

      return { ...state, cart: { ...state.cart, items } }
    }

    case 'REMOVE_ITEM': {
      state.cart.items = state.cart.items.filter(
        (item) => item.stripeId !== action.payload.stripeId
      )

      Cookies.set('cart', JSON.stringify({ ...state.cart.items }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'SET_STYLE': {
      state.cart.style = action.payload.style

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'SET_MESSAGE': {
      state.cart.message = action.payload

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'SET_INSTRUCTIONS': {
      state.cart.instructions = action.payload

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'SET_RECIPIENT': {
      let payload = action.payload
      state.cart.recipient = { ...state.cart.recipient, ...payload }

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'SET_DELIVERY': {
      state.cart.deliveryOption = action.payload.deliveryOption

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      console.log('state.cart -- ', state.cart)
      return { ...state, cart: { ...state.cart } }
    }

    case 'SET_TERMS': {
      state.cart.termsAccepted = action.payload.termsAccepted

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      console.log('state.cart -- ', state.cart)
      return { ...state, cart: { ...state.cart } }
    }

    case 'APPLY_VOUCHER': {
      state.cart.voucher = action.payload

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'CLEAR_CART': {
      Cookies.set(
        'cart',
        JSON.stringify({
          id: uuidv4(), // unique id for the thankly
          items: [], //
          message: '',
          instructions: '',
          style: '',
          recipient: {
            firstname: '',
            lastname: '',
            company: '',
            address: {
              state: '',
              postcode: '',
              suburb: '',
              fulladdress: '',
              line2: '',
            },
          },
          voucher: {},
          deliveryOption: {},
          termsAccepted: false,
          subtotal: 0,
          delivery: 0,
          usedVoucher: 0,
          total: 0,
        }),
        {
          expires: 1 / 600,
        }
      )

      return {
        ...state,
        cart: {
          id: uuidv4(), // unique id for the thankly
          items: [], //
          message: '',
          instructions: '',
          style: '',
          recipient: {
            firstname: '',
            lastname: '',
            company: '',
            address: {
              state: '',
              postcode: '',
              suburb: '',
              fulladdress: '',
              line2: '',
            },
          },
          voucher: {},
          deliveryOption: {},
          termsAccepted: false,
          subtotal: 0,
          delivery: 0,
          usedVoucher: 0,
          total: 0,
        },
      }
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
