
# Vite proxy setup | Halmet for meta data | Redux toolkit store setup <== RTK query and connect it with Reduct store | Route setup 

## Vite proxy setup

vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/api":{
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/Api'), 
      }
    }

  }
})
```

## Halmet for meta data 
utils>Halmet.jsx (Component)

```javascript
import { Helmet } from "react-helmet"
function Halmet({title}) {
    return (
    <Helmet>
        <meta charSet="utf-8" />
        <title>{title} | Ecom</title>
    </Helmet>
    )
}

export default Halmet
```
```javascript
import Halmet from '../utils/Halmet';
function Home() {

    return (
      <>
        <Halmet title={"Buy all types of eclectronics product"}/>
      </>
    )
}

export default Home

```

## RTK query
Api.Api.jsx
```javascript
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

export  const {useGetProductsQuery, useGetProductDetailsQuery}=ProductApi // RTK hook systex use + GetProducts +Query

```

## Redux toolkit store setup

Redux > Store.jsx
```javascript
import {configureStore} from '@reduxjs/toolkit'
import { ProductApi } from '../Api/Api'

const Store=configureStore(
    {
        reducer:{}
    }
)

export default Store

```

## Redux store wrapping by provider
main.jsx
```javascript
import Store from './components/Redux/Store.jsx'

createRoot(document.getElementById('root')).render(

    <Provider store={Store}>
      <App />
    </Provider>
)

```

## RTK query connect it with Reduct store
```javascript
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

```
## Use the RTK Api
```javascript
import {useGetProductsQuery} from '../Api/Api'
function Home() {
  const {data,isLoading,isError}=useGetProductsQuery()

    return (
      
    )
}

export default Home

```

## Route setup
```javascript
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/layout/Home'
import ProductDetails from './components/layout/ProductDetails'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
function App() {

  return (
    <BrowserRouter>
      <>
        <Header/>
          <div className="container">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/SingleProduct/:id' element={<ProductDetails/>}/>
          </Routes>
          </div>
        <Footer/>
      </>
    </BrowserRouter>
  )
}

export default App

```