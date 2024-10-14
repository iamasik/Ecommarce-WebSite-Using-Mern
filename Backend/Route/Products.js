import express from 'express'
const ProductRoute=express.Router()
import {ViewProducts, AddProducts,DeleteProduct,ViewOneProduct,UpdateProduct, FindProduct} from '../Controller/ProductsCon.js'
import isUserAuthenticated from '../Midleware/isUserAuthenticated.js'
import userRole from '../Midleware/userRole.js'

ProductRoute.route('/Products').get(ViewProducts)
ProductRoute.route('/View').get(FindProduct)
ProductRoute.route('/SingleProduct/:id').get(ViewOneProduct)
ProductRoute.route('/Admin/AddProducts').post(isUserAuthenticated,userRole("admin"),AddProducts)
ProductRoute.route('/Admin/UpdateProduct/:id').put(isUserAuthenticated,UpdateProduct)
ProductRoute.route('/Admin/DeleteProduct/:id').delete(isUserAuthenticated,DeleteProduct)

export default ProductRoute