
import dynamic from 'next/dynamic'
import { SwrBrand } from '@/lib/swr-helpers'
import { getURL } from '@/lib/api-helpers'

const Layout = dynamic(() => import('@/components/common/Layout'))

const Logo = dynamic(() => import('@/components/ui/Logo'))
const Icon = dynamic(() => import('@/components/common/Icon'))
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Signin() {
    const brand = SwrBrand()
    const supabaseClient = useSupabaseClient()
    const user = useUser()
    // const [data, setData]: any = useState()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type?: string; content?: string }>({
        type: '',
        content: '',
    })

    useEffect(() => {
        // // std user query
        // async function loadData() {
        //     const { data } = await supabaseClient.from('test').select('*')
        //     setData(data)
        // }

        // // Only run query once user is logged in.
        // if (user) loadData()
        if (user) router.replace('/account')

    }, [user])

    const handleSignin = async (e: any) => {
        e.preventDefault()

        setLoading(true)
        setMessage({})

        const { error } = await supabaseClient.auth.signInWithOtp(
            {email:  email ,
            options: { emailRedirectTo: getURL() }}
        )
        if (error) {
            setMessage({ type: 'error', content: error.message })
        }

        setMessage({
            type: 'note',
            content: 'Check your email for the magic link.',
        })

        setLoading(false)
    }

    if (!user)


        return (
            <>

                <div className="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        {/* <div className="flex justify-center mt-8 space-x-6">
                        <Logo
                            className="w-auto h-10 align-middle"
                            height={'25'}
                            width={'100'}
                        />
                    </div> */}
                        <h2 className="text-3xl font-bold tracking-tight text-center text-gray-900">Sign in to your account</h2>
                        <p className="max-w-xl px-5 mt-2 text-sm text-center text-gray-600">
                            {`Magic links are a new secure way to sign-in without having to remember a password. Enter the email used for a Thankly order and we'll send you a link to sign in.`}

                        </p>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="px-4 py-8 bg-white sm:rounded-lg sm:px-10">
                            <form className="space-y-6" action="#" method="POST">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Your email here"
                                            autoComplete="email"
                                            required
                                            className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none sm:text-sm focus:border-slate-500 focus:ring-slate-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        style={{
                                            backgroundColor: brand.firstAccentColour
                                                ? brand.firstAccentColour
                                                : '#fff',
                                        }}
                                        className="w-full px-4 py-3 text-base font-medium text-white align-middle border border-transparent rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-50">  <Icon
                                            className="mr-3 -mt-1 text-white align-middle"
                                            name={'login'}
                                        />
                                        {`Sign In`}
                                    </button>
                                </div>
                            </form>


                        </div>
                    </div>
                </div>
            </>
        )
}

Signin.Layout = Layout
