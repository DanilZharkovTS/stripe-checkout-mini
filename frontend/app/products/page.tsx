'use client'
import { useEffect, useState } from 'react'
import { service } from './service'
import { product } from './types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ProductsPage() {
  const router = useRouter()

  const [products, setProducts] = useState<product[] | null>(null)

  useEffect(() => {
    const getProducts = async () => {
      try {
        const apiProducts = await service.getAllProducts()
        setProducts(apiProducts)
      } catch (err) {
        console.error(err)
        return
      }
    }
    getProducts()
  }, [])

  const handleCheckout = async (productId: number) => {
    try {
      const res = await service.getProductCheckout(productId)
      router.push(res.checkoutUrl)
    } catch (err) {
      console.error(err)
      return
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-50">
      {!products && (
        <div className="text-center text-gray-500">No products found.</div>
      )}

      <div className="flex flex-col md:flex-row justify-center gap-8">
        {products &&
          products.map((p: product) => (
            <div
              key={p.id}
              className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <div className="mb-4 flex justify-center">
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    width={200}
                    height={200}
                    className="rounded-xl object-contain transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-[200px] w-[200px] items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {p.name}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {p.price} cents
                  </span>

                  <button
                    onClick={() => handleCheckout(p.id)}
                    className="rounded-lg bg-lime-400 px-4 py-2 text-sm font-medium text-black transition hover:bg-lime-500 active:scale-95"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
