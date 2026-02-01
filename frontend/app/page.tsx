import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 bg-gray-50 px-4">
      {/* CTA */}
      <Link
        href="/products"
        className="rounded-xl bg-lime-400 px-8 py-4 text-lg font-semibold text-black shadow-sm transition hover:bg-lime-500 active:scale-95"
      >
        Go to website
      </Link>

      {/* Test card info */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">
          Test payment card
        </h2>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-2 font-mono text-base">
            <span>Card number</span>
            <span className="font-semibold text-gray-900">
              4242 4242 4242 4242
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-2 font-mono">
            <span>Expiry</span>
            <span className="font-semibold text-gray-900">Any future date</span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-2 font-mono">
            <span>CVC</span>
            <span className="font-semibold text-gray-900">Any 3 digits</span>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          This is a Stripe test card. No real payments will be made.
        </p>
      </div>
    </div>
  )
}
