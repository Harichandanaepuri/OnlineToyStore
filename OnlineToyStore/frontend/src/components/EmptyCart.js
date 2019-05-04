import React, { Component } from "react";
import Navbar from './Navbar';
import HistItem from './HistItem';
import {  Redirect } from 'react-router-dom';
import Auth from '../services/Auth';
export default class EmptyCart extends Component {
  constructor(props) {
    super(props);
  
  };
  render(){
    let auth = new Auth();
    if(!auth.isAuthenticated())
      return <Redirect to="/" ></Redirect>;
  return (
    <React.Fragment>
    <Navbar user={auth.getSession()}></Navbar>
    <div className="container mt-5">
      <div className="row">
        <div className="col-10 mx-auto text-center text-title text-capitalize">
          <h1>your cart is currently empty</h1>
        </div>
      </div>
    </div>
    </React.Fragment>
  );
}
}