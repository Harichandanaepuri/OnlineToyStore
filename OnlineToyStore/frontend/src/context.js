import React, { Component } from 'react';
import form from './components/form';
const ProductContext = React.createContext();

class ProductProvider extends Component {
  state={
    products: [],
    cart:[]
  };

  //componentDidMount(){
    //this.setToys();
  //};


  // componentDidMount() {
  //   fetch('/products')
  //     .then(res => res.json())
  //     .then(products => this.setState({ products }));
  // }

// setToys = () => {
//   let tempProducts = [];
//   toyProducts.forEach(item => {
//     const singleItem = {...item};
//     tempProducts = [...tempProducts,singleItem];
//   });
  
//   this.setState(()=>{
//     return {products: tempProducts}
//   });
// };

  // getItem = (id) => {
  //   const product = this.state.products.find(item => item.id == id);
  //   return product;
  // };

  // handleDetail = id =>{
  //     const product = this.getItem(id);
  //     this.setState(() => {
  //       return {detailProduct: product}
  //     })
  // };

  // addToCart = (id) => {
  //     let tempProducts = [...this.state.products];
  //     const index = tempProducts.indexOf(this.getItem(id));
  //     const product = tempProducts[index];
  //     product.count = 1;
  //     const price = product.price;
  //     product.total = price;
  //     this.setState(()=>{
  //       return { products: tempProducts, cart:[...this.state.cart]};
  //     });
  // };

  deleteProduct = id =>{
    console.log("delete",id);
    fetch('/products/'+id+'',{
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
       id1:id,
      }),
      }).then(alert("succesfully deleted the product"))
   };
   
     
   editProduct = id =>{
     console.log("edit",id);
     return (<form />);
    };
    
  render() {
    return (
      <ProductContext.Provider value={{
          ...this.state,
          handleDetail:this.handleDetail,
          addToCart:this.addToCart,
          deleteProduct:this.deleteProduct,
          editProduct:this.editProduct
      }}>
        {this.props.children}
      </ProductContext.Provider>
    )
  }
}

const ProductConsumer = ProductContext.Consumer;

export {ProductProvider,ProductConsumer};