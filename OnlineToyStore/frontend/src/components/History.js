import React, { Component } from 'react'
import Navbar from './Navbar';
import HistColoumns from './HistColoumns';
import Auth from '../services/Auth';
import {  Redirect } from 'react-router-dom';
import HistItem from './HistItem';
export default class History extends Component {
  
  state={
    histProducts: [],
    histItems: [],
    history: [],
  };
  

  componentDidMount() {
    const auth = new Auth();
    if(!auth.isAuthenticated()) {
      return;
    }
    
    fetch('/history',{
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
    .then(res => {{res.map((item) => {
            let newItem = this.state.histItems;
            newItem.push(item); 
            this.setState({
            histItems : newItem
            });
        });
    }
    
    })
    .then(x => {
            fetch('/products')
            .then(res => res.json())
            .then(res => res.map((item) => {
                let newItem = this.state.histProducts;
                newItem.push(item); 
                this.setState({
                histProducts: newItem
                });
            }))
            .then(x => {
                this.loadHistory();
            });
            }
        )
    }

  loadHistory = () => {
    let histtt = this.state.histItems;
    histtt.forEach((y) => {
      this.addToHistory(y.id, y.quantity);
    })
  }
  addToHistory = (id, quantity1) => {
    let tempProducts = {};
    tempProducts = this.state.histProducts;
    const index = tempProducts.indexOf(this.getz(id));
    let product = {"id":tempProducts[index].id,"title":tempProducts[index].title,"price":tempProducts[index].price,"img":tempProducts[index].img,"quantity":quantity1};
    let hist = this.state.history;
    hist.push(product);
    this.setState({
    history : hist
    });
  }
  getz = (id) => {
    const product = this.state.histProducts.find((item) => item.id === id);
    return product;
  }
  render() {
    let auth = new Auth();
    if(!auth.isAuthenticated())
      return <Redirect to="/" ></Redirect>;
        
         if (this.state.history.length > 0) {
              return ( 
                <React.Fragment>
                  <Navbar user={auth.getSession()}></Navbar>
                  <h1 className="text-center"> Your History </h1>
                  <HistColoumns /> 
                  {this.state.history.map(item => (
                  <HistItem item={item} /> ))}
                </React.Fragment>
              );
            } else {
              return (
                    <div className="text-center">
                      <Navbar></Navbar>
                      <h1>You have no history</h1>
                    </div>
                
                
              );
              
            }
     
    
  }
}
