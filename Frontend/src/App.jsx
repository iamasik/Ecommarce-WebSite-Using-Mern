import './App.css'
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
