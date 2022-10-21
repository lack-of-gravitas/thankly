//https://www.youtube.com/watch?v=_IBlyR5mRzA&t=4244s
import { createContext, useReducer } from 'react'
import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'
import { update } from 'lodash'

export const Store = createContext()
const emptyCartObject = {
  id: uuidv4(),
  items: [], // gift and/or card

  cardContent: {
    writingStyle: '',
    message: '',
    specialInstructions: '',
  },

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

  options: {
    voucher: {},
    delivery: {},
    termsAccepted: false,
    createAccount: false,
  },

  totals: {
    items: 0,
    discount: 0, // free cards for large value orders
    delivery: 0,
    subtotal: 0,
    voucher: 0,
    net: 0,
  },
}

const initialState = {
  cart: Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : emptyCartObject,
}

function reducer(state, action) {
  // console.log('action.payload --', action.payload)

  function updateCartTotals() {
    state.cart.totals = {
      items: 0,
      discount: 0, // free cards for large value orders
      delivery: 0,
      subtotal: 0,
      voucher: 0,
      net: 0,
    }

    // update item totals
    state.cart.items.map(
      (item) => (state.cart.totals.items += item.unit_amount * 1)
    )

    // if order contains gift, add discount equivalent to card price
    if (state.cart.items.filter((item) => item.type === 'gift').length > 0) {
      const card = state.cart.items.filter((item) => item.type === 'card')
      state.cart.totals.discount = -1 * card.unit_amount
    }

    // update delivery cost
    state.cart.totals.delivery = state.cart.options.delivery.price ?? 0

    // update subtotal (items - discount + delivery)
    state.cart.totals.subtotal =
      state.cart.totals.items -
      state.cart.totals.discount +
      state.cart.totals.delivery

    // update voucher
    state.cart.options.voucher === null ? (state.cart.totals.voucher = 0) : null

    if (state.cart.options.voucher !== null) {
      const currVoucherBalance =
        state.cart.options.voucher.value * 1 -
        state.cart.options.voucher.used * 1

      state.cart.totals.subtotal > currVoucherBalance
        ? (state.cart.totals.voucher = currVoucherBalance)
        : (state.cart.totals.voucher = state.cart.totals.subtotal)
    }

    // update net total
    state.cart.totals.net =
      state.cart.totals.subtotal - state.cart.totals.voucher
  }

  switch (action.type) {
    case 'ADD_ITEM': {
      action.payload.type === 'card'
        ? (state.cart.items = state.cart.items.filter(
            (item) => item.type !== 'card'
          ))
        : null

      let items = [...state.cart.items, action.payload]

      // update totals
      updateCartTotals()

      Cookies.set('cart', JSON.stringify({ ...state.cart, items }), {
        expires: 1 / 600,
      })

      return { ...state, cart: { ...state.cart, items } }
    }

    case 'REMOVE_ITEM': {
      state.cart.items = state.cart.items.filter(
        (item) => item.stripeId !== action.payload.stripeId
      )

      updateCartTotals()

      Cookies.set('cart', JSON.stringify({ ...state.cart.items }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'SET_DELIVERY': {
      state.cart.options.delivery = action.payload.deliveryOption
      updateCartTotals()

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })

      console.log('state.cart -- ', state.cart)
      return { ...state, cart: { ...state.cart } }
    }

    case 'SET_STYLE': {
      state.cart.cardContent.writingStyle = action.payload.style

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'SET_MESSAGE': {
      state.cart.cardContent.message = action.payload

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'SET_INSTRUCTIONS': {
      state.cart.cardContent.instructions = action.payload

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

    case 'SET_TERMS': {
      state.cart.options.termsAccepted = action.payload.termsAccepted

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      console.log('state.cart -- ', state.cart)
      return { ...state, cart: { ...state.cart } }
    }

    case 'SET_ACCOUNT': {
      state.cart.options.createAccount = action.payload.createAccount

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      console.log('state.cart -- ', state.cart)
      return { ...state, cart: { ...state.cart } }
    }

    case 'APPLY_VOUCHER': {
      console.log('voucher payload',action.payload)
      state.cart.options.voucher = action.payload
      updateCartTotals()

      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'REMOVE_VOUCHER': {
      state.cart.options.voucher = {}
      updateCartTotals()

      // return setCartCookie(state.cart)
      Cookies.set('cart', JSON.stringify({ ...state.cart }), {
        expires: 1 / 600,
      })
      return { ...state, cart: { ...state.cart } }
    }

    case 'CLEAR_CART': {
      Cookies.set('cart', JSON.stringify(emptyCartObject), { expires: 1 / 600 })
      return { ...state, cart: { ...emptyCartObject } }
    }

    default:
      return state
  }

  function setCartCookie(cart) {
    Cookies.set('cart', JSON.stringify({ ...cart }), {
      expires: 1 / 600,
    })
    return { ...state, cart: { ...state.cart } }
  }
}

// provides store info across the website
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <Store.Provider value={value}>{children}</Store.Provider>
}
