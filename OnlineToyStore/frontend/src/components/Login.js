import React,{ Component,PropTypes } from 'react';
import styles from './Login.module.css';
import {FormControl, FormGroup, Button, Form} from 'react-bootstrap';
import {  Redirect } from 'react-router-dom';
import Auth from '../services/Auth';
import styled from "styled-components";
export default class Login extends Component {
		constructor(){
			super();
			this.state = {
				formFields : {
					fname : '',
					lname : '',
					username: '',
					email : '',
					pwd : ''
				},
				login : true,
				adminLogin:false,
				loginFields : {
					username : '',
					password : ''
				},
				loginAdminFields:{
					username:'',
					password:''
				},
				errors:{
					fname:'',
					username:'',
					email:'email format should be xxx@xxx.xxx',
					pwd:'',
					repwd:'',
					password_strength:'',
					password_check:''
				},
				isLoggedIn : false,
				loggedInUser : '',
				isAdmin:false
			}
		}	

		render(){
			{ if (this.state.login === false && !this.state.isLoggedIn && !this.state.isAdmin &&!this.state.adminLogin)
			return (
			<div className = {styles.signup}>
				<h2 className={styles.h2}>Sign Up</h2>
				<Form  name="myForm" id="signUpForm" onSubmit={this.formHandler}>
					<FormGroup className={styles.formgroup}>
						<FormControl type="name" className={[styles.formcontrol,styles.name1]} placeholder="First Name" name="fname" onChange={this.inputChangeHandler}  />
						<FormControl type="name" className={styles.formcontrol} placeholder="Last Name" name="lname" onChange={this.inputChangeHandler} />
					</FormGroup>
					<FormGroup className={styles.formgroup}>
						<FormControl type="name" className={styles.formcontrol} placeholder="Username" name="username" onChange={this.inputChangeHandler}/>
					</FormGroup>
					<FormGroup className={styles.formgroup}>
						<FormControl type="email" className={styles.formcontrol} placeholder="Email" name="email" onChange={this.inputChangeHandler}/>
					</FormGroup>

					<FormGroup className={styles.formgroup}>        
						<FormControl type="password" className={styles.formcontrol} placeholder="Password" name="pwd" onChange={this.inputChangeHandler}/>
					</FormGroup>
					<FormGroup className={styles.formgroup}>
						<FormControl type="password" className={styles.formcontrol} placeholder="Confirm Password" name="cpwd" onChange={this.inputChangeHandler} />
					</FormGroup>
					<FormGroup className={styles.formgroup}>        
						<FormGroup className="checkbox">
							<p><label><input type="checkbox" name="remember" /> I accept the Terms of Use & Privacy Policy</label></p>
						</FormGroup>
					</FormGroup>
					<FormGroup className={styles.formgroup}>        
						<Button type="submit" className="btn btn-primary">Sign Up</Button>
					</FormGroup>
					<p>Already a member? <a onClick={this.changeLogin}>Login</a></p>
				</Form>
			</div>
			
		)
		else if (this.state.login === true && !this.state.isLoggedIn && !this.state.isAdmin && !this.state.adminLogin)
			return (
			<div className = {styles.signup}>
				<h2 className={styles.h2}>Login</h2>
				<Form  name="loginForm"  id ="loginForm" onSubmit={this.loginHandler}>
					<FormGroup className={styles.formgroup}>
						<FormControl type="text" className={styles.formcontrol} placeholder="Username" name="username" onChange={this.inputChangeHandler2} />
					</FormGroup>
					<FormGroup className={styles.formgroup}>        
						<FormControl type="password" className={styles.formcontrol} placeholder="Password" name="password" onChange={this.inputChangeHandler2}/>
					</FormGroup>
					<FormGroup className={styles.formgroup}>        
						<Button type="submit" className="btn btn-primary">Login</Button>
					</FormGroup>
					<p>Not a member? <a onClick={this.changeLogin}>Sign Up</a></p>
					<p>Are you a admin? <a onClick={this.changeAdminLogin}>Login as admin</a></p>
				</Form>
			</div>
			)

			else if(this.state.adminLogin && !this.state.isAdmin)
			return(
				<div className = {styles.signup}>
				<h2 className={styles.h2}>Login as admin</h2>
				<Form  name="adminForm"  id ="adminForm" onSubmit={this.loginAdminHandler}>
					<FormGroup className={styles.formgroup}>
						<FormControl type="text" className={styles.formcontrol} placeholder="Username" name="username" onChange={this.inputChangeHandler3} />
					</FormGroup>
					<FormGroup className={styles.formgroup}>        
						<FormControl type="password" className={styles.formcontrol} placeholder="Password" name="password" onChange={this.inputChangeHandler3}/>
					</FormGroup>
					<FormGroup className={styles.formgroup}>        
						<Button type="submit" className="btn btn-primary">Login</Button>
					</FormGroup>
					<p>Are you a user? <a onClick={this.changeUserLogin}>Login as user</a></p>

				
				
				
				</Form>
			</div>
			)
		else if (this.state.isLoggedIn || this.state.isAdmin)
				return (<Redirect to={{pathname:"/toylist", user: this.state.loggedInUser,isAdmin:this.state.isAdmin }} >{this.state.loggedInUser}</Redirect>);
		}
	};
				
				
	// keeps updating the state values in signup
	inputChangeHandler = e => {
		let formFields = {...this.state.formFields};
		formFields[e.target.name] = e.target.value;
		this.setState({
		formFields
		});
		
	}
	// keeps updating the state values in login
	inputChangeHandler2 = e => {
		let loginFields = {...this.state.loginFields};
		loginFields[e.target.name] = e.target.value;
		this.setState({
			loginFields
		});
		
	}
	//admin form updation
	inputChangeHandler3 = e => {
		let loginAdminFields = {...this.state.loginAdminFields};
		loginAdminFields[e.target.name] = e.target.value;
		this.setState({
			loginAdminFields
		});	
	}
	//calls the api on submitting the form
	
	formHandler = e => {
		let fname=this.state.formFields.fname;
		let username=this.state.formFields.username;
		let pwd=this.state.formFields.pwd;
		let rpwd=this.state.formFields.rpwd;
		let email=this.state.formFields.email;

		if(! (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(pwd)))
		{
			alert("the password should be strong");
			this.state.errors.password_strength=false;
		}
		if(! (/^[a-zA-Z0-9]+@[a-zA-Z]+.[a-zA-Z]{3}$/.test(email)))
		{
			alert("Email should xxx@xxx.xxx");
			this.state.errors.email=false;
		}
		if(pwd!=rpwd)
		{
			this.state.errors.password=false;
			alert("password should match");
		}
		e.preventDefault();
		fetch('/user',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username1 : this.state.formFields.username ,
			}),
		})
		.then(res => res.json())
		.then( (res) => {
			if(res.value===true)
			{
				alert("username already taken")
			}
			else{
				fetch('/register',{
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						fname : this.state.formFields.fname ,
						lname : this.state.formFields.lname ,
						username : this.state.formFields.username ,
						email : this.state.formFields.email ,
						pwd : this.state.formFields.pwd ,
					}),
					});
			}
			console.log(res.value);
			//clears the form
			let form = document.getElementById("signUpForm");
			form.reset();
		});			
		}

	loginHandler = e => {
		e.preventDefault();
		//clears the form
		let form = document.getElementById("loginForm");
		form.reset();
		fetch('/login',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username1 : this.state.loginFields.username ,
				password1 : this.state.loginFields.password ,
			}),
		})
		.then(res => res.json())
		.then( (res) => {
			this.setState({
				loginFields : {
					username : '',
					password : ''
				},
			});
			 if (res.value === true){
				this.setState({
					isLoggedIn : res.value,
					loggedInUser : res.username
				 });
				 let auth = new Auth();
				 auth.setSession(res.username, false);
			 }
			 else
			 	alert("Check your credentials");
		});	
	}
	//admin login handler
	loginAdminHandler = e => {
		e.preventDefault();
		//clears the form
		let form = document.getElementById("adminForm");
		//form.reset();
		fetch('/adminlogin',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username1 : this.state.loginAdminFields.username ,
				password1 : this.state.loginAdminFields.password ,
			}),
		})
		.then(res => res.json())
		.then( (res) => {
			this.setState({
				loginAdminFields : {
					username : '',
					password : ''
				},
			});
			 if (res.value === true){
				this.setState({
					isAdmin : res.value
				});
				let auth = new Auth();
				auth.setSession(res.username, true);

			 }
			 else
			 	alert("Check your credentials");
		});		
	}
	//used to change the view between login and signup
	changeLogin = (e) => {
		var x = this.state.login;
		this.setState({
			login : !(x)
		})
	}
	changeUserLogin = (e) =>{
		this.setState({
			adminLogin:false,
			login:true
		})
	}
	changeAdminLogin = (e) => {
		var x = this.state.adminLogin;
		this.setState({
			adminLogin : !(x)
		})
	}

}

