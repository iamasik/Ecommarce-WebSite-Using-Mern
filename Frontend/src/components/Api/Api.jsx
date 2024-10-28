import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export  const ProductApi=createApi({
    reducerPath: 'ProductApi',
    baseQuery:fetchBaseQuery({
        baseUrl:'/api/V1/'
    }),
    endpoints:(builder)=>({
        getProducts:builder.query({
            query:()=>'/View'
        }),
        getProductDetails:builder.query({
            query:(id)=>`/SingleProduct/${id}`
        }),
    })
})

export  const {useGetProductsQuery, useGetProductDetailsQuery}=ProductApi