import {configureStore} from '@reduxjs/toolkit'
import { ProductApi } from '../Api/Api'

const Store=configureStore(
    {
        reducer:{
            [ProductApi.reducerPath]:ProductApi.reducer
        },
        middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat([ProductApi.middleware])
    }
)

export default Store