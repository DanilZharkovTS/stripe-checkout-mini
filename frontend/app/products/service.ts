import axios from 'axios'

export const service = {
  getAllProducts: async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
    return res.data
  },
  getProductCheckout: async (productId: number) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/checkout`
    )
    return res.data
  },
}
