import React, { Component } from 'react';
import Toy from './Toy';
import Navbar from './Navbar';
import {ButtonContainer} from './Button';
import './ToyList.css';
import {Link, Redirect} from 'react-router-dom';
import Auth from '../services/Auth';
const auth = new Auth();
export default class ToyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      currentpage :1,
      numberperpage:4,
      dropsearch: [],
      searchlist: [],
      search_query: '',
      filter_query: '',
      dropdown: "default"
    };
    this.handleClick = this.handleClick.bind(this);
  }
 
  change = (e) => {
    if(e.target.value != "default")
    {
        this.filterproducts(e.target.value);
        this.setState({
          dropdown : e.target.value 
        });
    }
    else {
      this.setState({
        searchlist: [],
        dropsearch: [],
        dropdown : e.target.value 
      });
    }
    
  }
  handleBlur = (e) => {
    if(e.target.value != "")
    {
        this.loadproducts(e.target.value);
    }
    else {
      this.setState({
        searchlist: this.state.dropsearch
      });
    }
    
  }

  handleClick(event) {
    this.setState({
      currentpage: Number(event.target.id)
    });
  }

  componentDidMount() {
    fetch('/products')
      .then(res => res.json())
      .then(products => this.setState({ products }));
  }

  loadproducts = (textValue) => {
    if (this.state.dropdown === "default"){
      let newList = [];
      newList = this.state.products.filter(item => {
        const item_lc = item.title.toLowerCase();
        const search_val = textValue.toLowerCase();
        return item_lc.includes(search_val);
      });
      this.setState({
        searchlist: newList,
        dropsearch: []
      });
    }
    else{
      let newList = [];
      newList = this.state.dropsearch.filter(item => {
        const item_lc = item.title.toLowerCase();
        const search_val = textValue.toLowerCase();
        return item_lc.includes(search_val);
      });
      this.setState({
          searchlist: newList
      });
    }
  }

  filterproducts = (textValue) => {
    let newList = [];
    let search = '';
    newList = this.state.products.filter(item => {
        const item_lc = item.category.toLowerCase();
        const search_val = textValue.toLowerCase();
        search = search_val;
        return item_lc.includes(search_val);
    });
    this.setState({
        searchlist: newList,
        dropsearch: newList,
        dropdown: search,
    });

  }
  render() {
    if(!auth.isAuthenticated())
      return <Redirect to="/" ></Redirect>;
    const { products, currentpage, numberperpage } = this.state;

    // Logic for displaying toys
    const indexOfLastToy = currentpage * numberperpage;
    const indexOfFirstToy = indexOfLastToy - numberperpage;
    const currentToys = products.slice(indexOfFirstToy, indexOfLastToy);

    

    const renderToys= currentToys.map(product => {
      if (product.inventory > 0 || auth.isAdmin() )
      return  <Toy key={product.id} product ={product} products={this.state.products} user={auth.getSession()}/>;
    });

    const rendersearched= this.state.searchlist.map(product => {
      if (product.inventory > 0 || auth.isAdmin() )
      return  <Toy key={product.id} product ={product} products={this.state.products} user={auth.getSession()}/>;
    });

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / numberperpage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <li>
          <ButtonContainer
              onClick={this.handleClick}
              key = {number}
              id = {number}>
              {number}
          </ButtonContainer>
        </li>
      );
    });

    
    return (
      <React.Fragment>
         <Navbar user={auth.getSession()}></Navbar>
        <div className="py-5">
        <div className="container"> 
        <div class="row">
                <form class="form-inline">
                        <select name="search_param" id="search_param" class="btn btn-default dropdown-toggle" data-toggle="dropdown" onChange={this.change} value={this.state.value}>
                        <option value="default">Default</option>
                        <option value="Board games">Board Games</option>
                        <option value="toy car">Toy Car</option>
                        <option value="toy">Toy</option>
                        <option value="road">Road</option>
                        </select>
                    <input type="text" class="form-control" name="x" placeholder="Search toys..." onChange={this.handleBlur}></input>

                </form>          
        </div>          
        <div className="row">
            <div className="col-10 mx-auto my-2 text-center text-blue">
            <h1 className="text-capitalize font-weight-bold">
              Hello {auth.getSession()}!!
            </h1>
            
            </div>
        </div>
        {
          this.state.searchlist.length > 0 ? 
          <div className="col-10 mx-auto my-2 text-center text-blue">
          <h1 className="text-capitalize font-weight-bold">
            Your search result
          </h1>
          </div> : <p></p>
        }
        <div className="row">
        {rendersearched}

        </div>
        <div>
        <h1 className="text-capitalize font-weight-bold text-center">
                  Toys List
            </h1>
        </div>
        <div className="row">
        {renderToys}
        </div>
        <div className="card-footer">
        <ul id="page-numbers">
          {renderPageNumbers}
        </ul>
        </div>
        
        </div>
        <div className="text-center">
          {auth.isAdmin() ? <Link to="/newform">
          <ButtonContainer>{"Add a new Product"}</ButtonContainer>
          </Link>
          :<p></p>
          } 
        </div>
        </div>
      </React.Fragment>
    );

  }
}

