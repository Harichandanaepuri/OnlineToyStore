import React, { Component } from 'react'
import Navbar from './Navbar';
import EmptyCart from './EmptyCart';
import CartColumns from './CartColumns';
import CartList from './CartList';
import Auth from '../services/Auth';
import {  Redirect } from 'react-router-dom';
export default class extends Component {
  
  state={
    cart:[],
    products: [],
    histProducts: [],
    items: [],
    histItems: [],
    history: [],
    total: 0
  };
  

  componentDidMount() {
    const auth = new Auth();
    if(!auth.isAuthenticated()) {
      return;
    }
    fetch('/items',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username : auth.getSession()
			}),
		})
      .then(res => res.json())
      .then(res => res.map((item) => {
        //this.addToCart(item.id, item.quantity);
        let newItem = this.state.items;
        newItem.push(item); 
        this.setState({
          items : newItem
        });
      }))
      .then(x => {
                fetch('/products')
                .then(res => res.json())
                .then(res => res.map((item) => {
                  let newItem = this.state.products;
                  newItem.push(item); 
                  this.setState({
                    products : newItem,
                    histProducts: newItem
                  });
                }))
                .then(x => {
                  this.loadCart();
                });
              }
            )
        }

  loadCart = () => {
    let newItems = this.state.items;
    newItems.forEach((x) => {
       this.addToCart(x.id, x.quantity);
    });
  }

  getItem = (id) => {
    const product = this.state.products.find((item) => item.id === id);
    return product;
  };

  addToCart = (id,quantity1) => {
    var tempProducts = [];
    tempProducts = this.state.products;
    const index = tempProducts.indexOf(this.getItem(id));
    var product = {};
    product = tempProducts[index];
    //if(product!=undefined){
      product.quantity = quantity1;
      let product2 = product;
      const price = product.price;
      let newCart = this.state.cart;
      newCart.push(product2);
      this.setState({
        cart:newCart,
      });
    //};
  };

  render() {
    let auth = new Auth();
    if(!auth.isAuthenticated())
      return <Redirect to="/" ></Redirect>;
        
         if (this.state.cart.length > 0) {
              return ( 
                <React.Fragment>
                  <Navbar user={auth.getSession()}></Navbar>
                  <h1 className="text-center"> Your Cart </h1>
                  <CartColumns />
                  <CartList cart = {this.state.cart} user={auth.getSession()} products = {this.state.products} />
                  {/* <CartTotals value={value} history={this.props.history} /> */} 
                </React.Fragment>
              );
            } else {
              return (
                <EmptyCart user={auth.getSession()}></EmptyCart>
                
              );
              
            }
     
    
  }
}
