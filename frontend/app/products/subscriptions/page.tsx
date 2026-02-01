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
    { plan: 'BASIC', period: 'DAYLY' },
    { plan: 'BASIC', period: 'WEEKLY' },
    { plan: 'BASIC', period: 'MONTHLY' },
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
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex gap-3 b-gray-50 border">
        {subscriptionVariants.map((s: subscription, i) => {
          return (
            <div key={i}>
              <div>{s.plan}</div>
              <div>{s.period}</div>
              <button
                onClick={() => {
                  handleCheckout(s.plan, s.period)
                }}
              >
                Buy
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
