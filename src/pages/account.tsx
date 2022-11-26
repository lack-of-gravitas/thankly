
import dynamic from 'next/dynamic'
import { SwrBrand } from '@/lib/swr-helpers'
import cn from 'clsx'

const Layout = dynamic(() => import('@/components/common/Layout'))

const Logo = dynamic(() => import('@/components/ui/Logo'))
const Icon = dynamic(() => import('@/components/common/Icon'))
const ProductCard = dynamic(() => import('@/components/ui/Product'))

import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default function Account({ user }: any) {
    return <><div>
        <OrderHistory />
    </div></>
}
Account.Layout = Layout




export function OrderHistory() {
    return (
        <div className="bg-gray-50">


            <main className="py-24">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                    <div className="max-w-2xl px-4 mx-auto lg:max-w-4xl lg:px-0">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Account</h1>
                        {/* <p className="mt-2 text-sm text-gray-500">
                            Check the status of recent orders and view invoices.
                        </p> */}
                    </div>
                </div>

                <section aria-labelledby="recent-heading" className="mt-16">


                    <h2 id="recent-heading" className="sr-only">
                        Recent orders
                    </h2>
                    <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">

                        <div className="max-w-2xl mx-auto space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
                            <Orders />

                        </div>
                    </div>
                </section>
            </main>


        </div>
    )
}





const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: '$123', role: 'Member' },
    // More people...
]

export function Orders() {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the orders in your account including the recipienst.
                    </p>
                </div>
                {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add user
            </button>
          </div> */}
            </div>
            <div className="max-w-3xl mt-8 -mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                Date
                            </th>
                            <th
                                scope="col"
                                className=" px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                            >
                                Total Amount
                            </th>
                            <th
                                scope="col"
                                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                            >
                                GST
                            </th>
                            <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Order ID
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">View Details</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {people.map((person) => (<>
                            <tr key={person.email}>
                                <td className="w-full py-4 pl-4 pr-3 text-sm font-medium text-gray-900 max-w-0 sm:w-auto sm:max-w-none sm:pl-6">
                                    {person.name}
                                    <dl className="font-normal lg:hidden">
                                        <dt className="sr-only">Title</dt>
                                        <dd className="mt-1 text-gray-700 truncate">{person.title}</dd>
                                        <dt className="sr-only sm:hidden">Email</dt>
                                        <dd className="mt-1 text-gray-500 truncate sm:hidden">{person.email}</dd>
                                    </dl>
                                </td>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{person.title}</td>
                                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{person.email}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{person.role}</td>
                                <td className="py-4 pl-3 pr-4 text-sm font-medium text-right sm:pr-6">
                                    <a

                                        href="#" className="text-indigo-600 hover:text-indigo-900">
                                        View Details<span className="sr-only">, {person.name}</span>
                                    </a>
                                </td>
                            </tr>
                        </>
                        ))}

                    </tbody>

                </table>

            </div>
        </div>
    )
}
