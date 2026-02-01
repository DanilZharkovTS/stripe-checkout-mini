'use client'
import { useState } from 'react'
import {
  subscription,
  subscriptionPeriods,
  subscriptionPlans,
  subscriptionVariants,
} from '../types'
import { service } from '../service'
import { useRouter } from 'next/navigation'

export default function SubscriptionsPage() {
  const router = useRouter()

  const subscriptionVariants: subscriptionVariants = [
    { plan: 'BASIC', period: 'DAYLY', price: 4 },
    { plan: 'BASIC', period: 'WEEKLY', price: 23 },
    { plan: 'BASIC', period: 'MONTHLY', price: 70 },
  ]

  const handleCheckout = async (
    plan: subscriptionPlans,
    period: subscriptionPeriods
  ) => {
    try {
      const res = await service.getSubscriptionCheckout({
        plan,
        period,
      })
      router.push(res.url)
    } catch (err) {
      console.error(err)
      return
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {subscriptionVariants.map((s: subscription, i) => (
          <div
            key={i}
            className="group flex w-[280px] flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 text-center">
              <h3 className="text-xl font-semibold text-gray-900">{s.plan}</h3>
              <p className="mt-1 text-sm text-gray-500">{s.period}</p>
            </div>

            <div className="flex-1 text-sm text-gray-600">
              <ul className="space-y-1">
                <li>✔ Full access to any products</li>
                <li>✔ Priority support</li>
                <li>✔ Cancel anytime</li>
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                ${s.price}
              </span>

              <button
                onClick={() => handleCheckout(s.plan, s.period)}
                className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-lime-500 active:scale-95"
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
