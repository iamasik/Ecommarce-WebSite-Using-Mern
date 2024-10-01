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