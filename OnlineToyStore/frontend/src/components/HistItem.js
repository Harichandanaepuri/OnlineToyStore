import React, { Component } from "react";
export default class CartItem extends Component {
  constructor(props){
    super(props);
 }
  render() {
   
    const { id, title, img, price, quantity } = this.props.item;
    const total = price*quantity;
    // const { increment, decrement, removeItem } = this.props.value;

    return (
      <div className="row my-1 text-capitalize text-center">
        <div className="col-10 mx-auto col-lg-2">
          <img
            src={img}
            style={{ width: "5rem", heigth: "5rem" }}
            className="img-fluid"
            alt=""
          />
        </div>
        <div className="col-10 mx-auto col-lg-2 ">
          <span className="d-lg-none">product :</span> {title}
        </div>
        <div className="col-10 mx-auto col-lg-2 ">
          <strong>
            <span className="d-lg-none">price :</span> ${price}
          </strong>
        </div>
        <div className="col-10 mx-auto col-lg-2 my-2 my-lg-0 ">
          <div className="d-flex justify-content-center">
            <div>

              <span className="btn btn-black mx-1">{quantity}</span>
            
            </div>
          </div>
        </div>

        <div className="col-10 mx-auto col-lg-2 ">
          <strong>item total : ${total} </strong>
        </div>
      </div>
    );
  }
}