   
import React, { Component } from "react";
import CartItem from "./CartItem";
import {ButtonContainer} from './Button';
import {Link} from 'react-router-dom';
import Auth from '../services/Auth';
import {  Redirect } from 'react-router-dom';
const auth = new Auth();
export default class CartList extends Component {
  
  state = {
    cart : this.props.cart,
    items: [],
    products: this.props.products,
    history: [],
    total: 0
  }

  componentDidMount(){
    
  };

  
  increment = (id) => {
    const index = this.state.cart.indexOf(this.getItem(id));
    let cartNew = this.state.cart;
    let product = cartNew[index];
    let total = this.state.total;
    if (product.quantity < product.inventory){
      product.quantity = product.quantity + 1;
      total = total + parseInt(product.price);
    }
    else {
      alert(`We have only ${product.quantity} of ${product.title}`);
    }
    this.setState({
      cart : cartNew,
      total : total
    });
    this.render();
  }
  decrement = (id) => {
    const index = this.state.cart.indexOf(this.getItem(id));
    let cartNew = this.state.cart;
    let product = cartNew[index];
    let total = this.state.total;
    if (product.quantity > 1){ 
     product.quantity = product.quantity - 1;
     total = total - parseInt(product.price);
    }
    this.setState({
      cart : cartNew,
      total : total
    });
  }
  remove = (id) => {
    const index = this.state.cart.indexOf(this.getItem(id));
    let cartNew = this.state.cart;
    let total = this.state.total - parseInt(parseInt(cartNew[index].quantity) * parseInt(cartNew[index].price));
    cartNew.splice(index,1);
    this.setState({
      cart : cartNew,
      total : total
    });
  }
  getItem = (pid) => {
    let cartNew = this.state.cart;
    let product = cartNew.find((item) => item.id == pid);
    return product;
  };
  updateCart = () => {
    let cartNew = this.state.cart;
    let object = []
    cartNew.map((item) => {
      let temp = {"id" : item.id, "quantity" : item.quantity};
      object.push(temp);
    })
    alert("Changes have been saved");
    fetch('/updatecart',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username : auth.getSession(),
				items : object ,
			}),
    });
  }

  checkout = () => {
    let cartNew = this.state.cart;
    let u = this.state.total;
    alert(`Your total: $${u}` );
    let object = [];
    let object2 = []
    cartNew.map((item) => {
      let temp = {"id" : item.id, "quantity" : item.quantity};
      object.push(temp);
    });
    cartNew.map((item) => {
      let temp = {"id" : item.id, 
                  "title" : item.title,
                  "company" : item.company,
                  "category" : item.category,
                  "inventory" : (item.inventory - item.quantity),
                  "price" : item.price,
                  "img" : item.img
                };
      object2.push(temp);
    });
    fetch('/checkout',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username : auth.getSession(),
				items : object ,
			}),
    })
    .then(res => {this.setState({
      cart : [],
      items: [],
      total : 0
      });
    });
    fetch('/updateinventory',{
      method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				products : object2
			}),
    })
  }
  render() {
    const cart = this.state.cart;
    
    if(!auth.isAuthenticated())
      return <Redirect to="/" ></Redirect>;
    this.state.total = 0;
    cart.forEach(x =>{
      this.state.total += parseInt(x.quantity) * parseInt(x.price)
    })
    return (
      <div className="container-fluid">
        {cart.map(item => (
          <CartItem key={item.id} item={item} increment={this.increment} decrement={this.decrement} remove={this.remove}/>
        ))}
          <div className="text-right">
            <h3>Total: ${this.state.total}</h3> 
          </div>
          <div className="text-center">
          
            <ButtonContainer onClick={this.updateCart}>
              <span className="mr-2" >
              <i className="fas " ></i>
              </span>
                  update cart
          </ButtonContainer>

          </div>
        
          <Link to={{pathname: "/toylist"}}>
          <div onClick={this.checkout} className="text-center">
            <ButtonContainer >
              <span className="mr-2" >
              <i className="fas " ></i>
              </span>
                Checkout
          </ButtonContainer>
          </div>
          </Link>
      </div> 
    );
  }
}