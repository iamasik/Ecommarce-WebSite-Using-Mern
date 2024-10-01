
# Search | Filter | Pagination

## Search

Utils>ProductsFilter.js
This ProductsFilter class will take the Model and Query search string (Where we will get the search keyword) and search function modify the Model for later use. And return the entire class using => this

Using $regex will help to search over the database (it's a mongodb functionality) and using $option we can make it case insensitive. And if no keyword then we can simply pass eampty object.
```javascript
class ProductsFilter {
    constructor(QueryProductsModel, QueryStr) {
      this.QueryProductsModel = QueryProductsModel;
      this.QueryStr = QueryStr;
    }

    search() {
    const keyword=this.QueryStr.keyword? {name:{$regex:this.QueryStr.keyword, $options:"i"}}:{}
    this.QueryProductsModel=this.QueryProductsModel.find({...keyword})
    
    return this
}
}
```
->ProductsCon.js

Here after making the instanse simply caller the Search function
```javascript
export const FindProduct=catchAsyncError(async(req,res)=>{
    let useForFilter=new ProductsFilter(ProductsModel,req.query).search()

    let Products=await useForFilter.QueryProductsModel
    
    res.status(200).json(
        {
            Total:Products.length,
            Data:Products,
            message:"Success"
        }
    )
})
```
## Search + Filter
Utils>ProductsFilter.js
In mongodb we can filter by using ``` $gte``` stand for gater than and equal (in the same way lt, lte, gt) when we read from queary => price[gte]=200 it stands for in mongodb price:{gte:200} but we need it in ``` $gte:200``` this format with "$" sing. Fo this need use this regex to match => /\b(gt|gte|lt|lte)\b/g

```javascript
class ProductsFilter {
    constructor(QueryProductsModel, QueryStr) {
      this.QueryProductsModel = QueryProductsModel;
      this.QueryStr = QueryStr;
    }
  
    search() {
        
        const keyword=this.QueryStr.keyword? {name:{$regex:this.QueryStr.keyword, $options:"i"}}:{}
        this.QueryProductsModel=this.QueryProductsModel.find({...keyword})
        
        return this
    }
    filters() {

        //Remove Search keyword and page value while filter, since those works are done above
        let QueryStrCopy={...this.QueryStr}
        const fieldsToRemove = ["keyword", "page"]
        fieldsToRemove.forEach(el=> delete QueryStrCopy[el])

        // Advance filter for price, ratings etc to add "$" sing
        QueryStrCopy = JSON.stringify(QueryStrCopy);
        QueryStrCopy = QueryStrCopy.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
        QueryStrCopy=JSON.parse(QueryStrCopy)
        
        this.QueryProductsModel=this.QueryProductsModel.find(QueryStrCopy)
        
        return this
    }
```
-> ProductsCon.js
```javascript
export const FindProduct=catchAsyncError(async(req,res)=>{
    //Reminder: filters() working over the fetch data and search() working over the database
    let useForFilter=new ProductsFilter(ProductsModel,req.query).search().filters()

    //If no pagination
    let Products = await useForFilter.QueryProductsModel

    res.status(200).json(
        {
            Total:Products.length,
            Data:Products,
            message:"Success"
        }
    )
})
```
## Search + Filter + Pagination

Utils>ProductsFilter.js
```javascript
class ProductsFilter {
    constructor(QueryProductsModel, QueryStr) {
      this.QueryProductsModel = QueryProductsModel;
      this.QueryStr = QueryStr;
    }
  
    search() {
        
        const keyword=this.QueryStr.keyword? {name:{$regex:this.QueryStr.keyword, $options:"i"}}:{}
        this.QueryProductsModel=this.QueryProductsModel.find({...keyword})
        
        return this
    }
    filters() {

        //Remove Search keyword and page value while filter
        let QueryStrCopy={...this.QueryStr}
        const fieldsToRemove = ["keyword", "page"]
        fieldsToRemove.forEach(el=> delete QueryStrCopy[el])

        // Advance filter for price, ratings etc
        QueryStrCopy = JSON.stringify(QueryStrCopy);
        //if no filter value still it will not occure any side effect
        QueryStrCopy = QueryStrCopy.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);        
        QueryStrCopy=JSON.parse(QueryStrCopy)
        
        this.QueryProductsModel=this.QueryProductsModel.find(QueryStrCopy)
        
        return this
    }
    pagination(numOfItems){
        const whichPage=Number(this.QueryStr.page) || 1
        
        const showItemsNum=numOfItems*(whichPage-1)
        this.QueryProductsModel=this.QueryProductsModel.limit(numOfItems).skip(showItemsNum)

        return this
    }
}

export default ProductsFilter
```
-> ProductsCon.js
```javascript
export const FindProduct=catchAsyncError(async(req,res)=>{
    //Reminder: filters() working over the fetch data and search() working over the database
    let useForFilter=new ProductsFilter(ProductsModel,req.query).search().filters()

    // If no pagination
    // let Products = await useForFilter.QueryProductsModel

    //If pagination
    const numOfItems=4
    useForFilter.pagination(numOfItems)
    let Products=await useForFilter.QueryProductsModel
    
    res.status(200).json(
        {
            Total:Products.length,
            Data:Products,
            message:"Success"
        }
    )
})
```
