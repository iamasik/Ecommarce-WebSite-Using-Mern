import express from 'express'
const ProductRoute=express.Router()
import {ViewProducts, AddProducts,DeleteProduct,ViewOneProduct,UpdateProduct, FindProduct,NewReview,ReviewDelete} from '../Controller/ProductsCon.js'
import isUserAuthenticated from '../Midleware/isUserAuthenticated.js'
import userRole from '../Midleware/userRole.js'

ProductRoute.route('/Products').get(ViewProducts)
ProductRoute.route('/View').get(FindProduct)
ProductRoute.route('/SingleProduct/:id').get(ViewOneProduct)


ProductRoute.route('/NewReview').post(isUserAuthenticated,NewReview)
ProductRoute.route('/ReviewDelete').delete(isUserAuthenticated,ReviewDelete)


ProductRoute.route('/Admin/AddProducts').post(isUserAuthenticated,userRole("admin"),AddProducts)
ProductRoute.route('/Admin/UpdateProduct/:id').put(isUserAuthenticated,UpdateProduct)
ProductRoute.route('/Admin/DeleteProduct/:id').delete(isUserAuthenticated,DeleteProduct)

export default ProductRoute