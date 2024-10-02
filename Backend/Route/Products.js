import express from 'express'
export const ProductRoute=express.Router()
import {ViewProducts, AddProducts,DeleteProduct,ViewOneProduct,UpdateProduct, FindProduct} from '../Controller/ProductsCon.js'
import isUserAuthenticated from '../Midleware/isUserAuthenticated.js'

ProductRoute.route('/Products').get(ViewProducts)
ProductRoute.route('/View').get(FindProduct)
ProductRoute.route('/SingleProduct/:id').get(ViewOneProduct)
ProductRoute.route('/AddProducts').post(isUserAuthenticated,AddProducts)
ProductRoute.route('/UpdateProduct/:id').put(isUserAuthenticated,UpdateProduct)
ProductRoute.route('/DeleteProduct/:id').delete(isUserAuthenticated,DeleteProduct)

export default ProductRoute