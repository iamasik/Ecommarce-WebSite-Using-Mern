import express from 'express'
export const ProductRoute=express.Router()
import {ViewProducts, AddProducts,DeleteProduct,ViewOneProduct,UpdateProduct, FindProduct} from '../Controller/ProductsCon.js'


ProductRoute.route('/Products').get(ViewProducts)
ProductRoute.route('/View').get(FindProduct)
ProductRoute.route('/SingleProduct/:id').get(ViewOneProduct)
ProductRoute.route('/AddProducts').post(AddProducts)
ProductRoute.route('/UpdateProduct/:id').put(UpdateProduct)
ProductRoute.route('/DeleteProduct/:id').delete(DeleteProduct)

export default ProductRoute