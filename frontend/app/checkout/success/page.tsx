import Link from 'next/link'
import React from 'react'

const page: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed
          successfully.
        </p>

        <div className="flex flex-col gap-3">
          <Link href={'/products'} className="w-full rounded-xl bg-lime-500 py-3 font-medium text-white hover:bg-lime-600 transition">
            Continue shopping
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          You can safely close this page.
        </p>
      </div>
    </div>
  )
}

export default page
