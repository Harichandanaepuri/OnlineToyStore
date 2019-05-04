import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {ButtonContainer} from './Button';
import {  Redirect } from 'react-router-dom';
import ToyList from './ToyList';
import createHistory from 'history/createBrowserHistory';
import Auth from '../services/Auth';

let auth = new Auth();
const history = createHistory();
export default class Navbar extends Component {

    constructor(){
        super();
    };

    logout(){
        auth.logout();
        window.location.reload();
    }
  render() {
    let x = '';
    if (auth.isAuthenticated() ){
        x = 'logout'
    }
    else {
        x = 'login'
    }
    return(
        <NavWrapper className="navbar navbar-expand-sm navbar-dark ">
        <ul className="navbar-nav align-items-center">
        <li>
            <Link to={{pathname: "/toylist",user: auth.getSession()}} className="nav-link">
                Toys
            </Link>
        </li>
        </ul>
       
         
        {!(auth.isAdmin()) ?   
        <Link to={{pathname: "/cart",user: auth.getSession()}} className=" nav-link">
            <ButtonContainer>
                    {"My Cart"}
            </ButtonContainer>
        </Link>
        : <p></p>}
        {!(auth.isAdmin()) ? 
        <Link to={{pathname: "/history",user: auth.getSession()}} className=" nav-link">
            <ButtonContainer>
                    {"History"}
            </ButtonContainer>
        </Link> 
        : <p></p>}
        <Link className="ml-auto nav-link">
        <ButtonContainer onClick={this.logout}>         
                {x}
        </ButtonContainer>
        </Link>
        </NavWrapper>
    );

  }
}


const NavWrapper = styled.nav`
background: var(--mainBlue);
.nav-link{
    color:var(--mainWhite)! important;
    font-size:1.3rem;
    text-transform:capitalize;
}
`
