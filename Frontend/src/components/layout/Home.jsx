// import { useEffect } from 'react';
import {useGetProductsQuery} from '../Api/Api'
import ProductItem from '../Product/ProductItem';
import Halmet from '../utils/Halmet';
import Loader from './Loader';
function Home() {
  const {data,isLoading,isError}=useGetProductsQuery()

  if(isLoading){
   return <Loader/>
  }

    return (
      <>
        <Halmet title={"Buy all types of eclectronics product"}/>
        <div>
            <div className="row">
        <div className="col-6 col-md-12">
          <h1 id="products_heading" className="text-secondary">
            Latest Products
          </h1>
          <section id="products" className="mt-5">
            <div className="row">
              {isError && <p>Something is wrong</p>}
              {data?.Data && data.Data.map(item=><ProductItem product={item} key={item._id}/>)}
            </div>
          </section>
        </div>
      </div>
        </div>
      </>
    )
}

export default Home
