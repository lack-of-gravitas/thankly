//https://www.youtube.com/watch?v=_IBlyR5mRzA&t=4244s
import { createContext, useReducer } from 'react'
import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

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
    shipping: {},
    ribbon: {},
    termsAccepted: false,
    createAccount: false,
  },

  totals: {
    items: 0,
    discount: 0, // free cards for large value orders
    shipping: 0,
    subtotal: 0,
    voucher: 0,
    net: 0,
  },
}

const initialState = {
  cart: Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : emptyCartObject,
}

function setCookies(obj) {
  Cookies.set('cart', JSON.stringify({ ...obj }), {
    expires: 1 / 600,
  })
  console.log('cookie >', JSON.parse(Cookies.get('cart')))
}

function reducer(state, action) {
  // console.log('action.payload --', action.payload)
  let newCart = state.cart
  // console.log('cookie >', Cookies.get('cart')) // should be blank for fresh
  // console.log('newCart...', newCart) // should be blank for fresh

  switch (action.type) {
    case 'ADD_ITEM': {
      if (
        action.payload.type === 'card' &&
        // newCart.items != undefined &&
        newCart.items.length > 0
      ) {
        newCart.items = newCart.items.filter((item) => item.type !== 'card')
      }

      newCart.items = [...newCart.items, action.payload]
      console.log('newCart.items >', newCart.items)
      updateTotals()
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'REMOVE_ITEM': {
      newCart.items = newCart.items.filter(
        (item) => item.id !== action.payload.id
      )
      updateTotals()
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'SET_SHIPPING': {
      newCart.options.shipping = action.payload.shippingRate
      updateTotals()
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'SET_STYLE': {
      newCart.cardContent.writingStyle = action.payload.style
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'SET_MESSAGE': {
      newCart.cardContent.message = action.payload
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'SET_INSTRUCTIONS': {
      newCart.cardContent.instructions = action.payload
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'SET_RECIPIENT': {
      let payload = action.payload
      newCart.recipient = { ...newCart.recipient, ...action.payload }
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'SET_TERMS': {
      newCart.options.termsAccepted = action.payload.termsAccepted
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'SET_ACCOUNT': {
      newCart.options.createAccount = action.payload.createAccount
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'SET_RIBBON': {
      newCart.options.ribbon = action.payload.ribbon
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'APPLY_VOUCHER': {
      newCart.options.voucher = action.payload
      updateTotals()
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'REMOVE_VOUCHER': {
      newCart.options.voucher = {}
      updateTotals()
      setCookies(newCart)
      return { ...state, cart: { ...newCart } }
    }

    case 'CLEAR_CART': {
      setCookies(emptyCartObject)
      state.cart = emptyCartObject
      return state
    }
  }

  function updateTotals() {
    // update item totals
    newCart.totals.items = 0
    newCart.items.map((item) => (newCart.totals.items += item.unit_amount * 1))

    // add discount for card value if gift also ordered
    newCart.totals.discount = 0
    if (newCart.items?.filter((item) => item.type === 'gift').length > 0) {
      const card = newCart.items.filter((item) => item.type === 'card')
      card.map((item) => (newCart.totals.discount += item.unit_amount * 1))
    }

    // update shipping cost
    newCart.totals.shipping = 0
    newCart.options.shipping != undefined &&
    Object.keys(newCart.options.shipping).length != 0 &&
    newCart.options.shipping.unit_amount != ''
      ? (newCart.totals.shipping = newCart.options.shipping.unit_amount * 1)
      : 0

    // update subtotals (items - discount + shipping)
    newCart.totals.subtotal = 0

    newCart.totals.subtotal =
      newCart.totals.items * 1 -
      newCart.totals.discount * 1 +
      newCart.totals.shipping * 1

    // update voucher
    newCart.totals.voucher = 0
    if (
      newCart.options.voucher === {} ||
      newCart.options.voucher === null ||
      newCart.options.voucher === undefined
    ) {
      newCart.totals.voucher = 0
    } else {
      const voucherBalance =
        newCart.options.voucher.value * 1 - newCart.options.voucher.used * 1

      newCart.totals.subtotal === voucherBalance
        ? (newCart.totals.voucher = voucherBalance * 1)
        : null

      newCart.totals.subtotal * 1 < voucherBalance * 1
        ? (newCart.totals.voucher = newCart.totals.subtotal * 1)
        : null

      newCart.totals.subtotal * 1 > voucherBalance * 1
        ? (newCart.totals.voucher = voucherBalance * 1)
        : null
    }

    // update net
    newCart.totals.net = 0
    newCart.totals.net =
      newCart.totals.subtotal * 1 - newCart.totals.voucher * 1

    state.cart = { ...state, cart: { ...newCart } }
  }
}

// provides store info across the website
export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <Store.Provider value={value}>{children}</Store.Provider>
}
