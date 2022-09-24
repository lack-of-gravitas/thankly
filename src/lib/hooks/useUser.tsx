import { useEffect, useState, createContext, useContext } from 'react'
import {
  useUser as useSupaUser,
  User,
} from '@supabase/supabase-auth-helpers/react'
import { UserDetails } from '@/lib/types'
import { Purchase } from '@/lib/types'
import { SupabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
// import { getProduct } from '@/lib/queries'

type UserContextType = {
  accessToken: string | null
  user: User | null
  userDetails: UserDetails | null
  isLoading: boolean
  purchases: Purchase[] | any[] | null
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface Props {
  supabaseClient: SupabaseClient
  [propName: string]: any
}

export const MyUserContextProvider = (props: Props) => {
  const { supabaseClient: supabase } = props
  const { user, accessToken, isLoading: isLoadingUser } = useSupaUser()
  const [isLoadingData, setIsloadingData] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [purchases, setPurchases] = useState<Purchase[] | any[] | null>([])

  const getUserDetails = () =>
    supabase.from<UserDetails>('users').select('*').single()
  // get purchases from supabase
  const getPurchases = () =>
    supabase.from<Purchase>('purchases').select('*').in('status', [
      'succeeded',
      'active',
      //, 'unpaid', 'canceled', 'past_due'
    ])

  useEffect(() => {
    if (user && !isLoadingData && !userDetails) {
      setIsloadingData(true)
      Promise.allSettled([getUserDetails(), getPurchases()]).then((results) => {
        const userDetailsPromise = results[0]
        const purchasePromise = results[1]

        if (userDetailsPromise.status === 'fulfilled')
          setUserDetails(userDetailsPromise.value.data)

        if (purchasePromise.status === 'fulfilled') {
          let purchaseData: any[] = []
          let purchases = purchasePromise.value.data

          // purchases?.forEach(async (purchase: any) => {
          //   let product = await getProduct(
          //     purchase.metadata.productSlug.split('/').pop()
          //   )
          //   product = product.data[0]
          //   // console.log('product ->', product)
          //   if (product.type === 'course')
          //     purchase.metadata.productSlug += '/content'

          //   purchaseData.push({ ...purchase, ...product })
          //   // console.log('purchaseData ->', purchaseData)
          //   setPurchases(purchaseData)
          // })

          // setPurchases(purchasePromise.value.data)
        }

        setIsloadingData(false)
      })
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null)
      setPurchases(null)
    }
  }, [user, isLoadingUser])

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    purchases,
  }

  return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`)
  }
  return context
}
