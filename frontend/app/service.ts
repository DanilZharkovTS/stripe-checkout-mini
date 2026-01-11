import axios from 'axios'

export const service = {
  getAllProducts: async () => {
    const res = await axios.get('http://localhost:3000/products')
    return res.data
  },
}
