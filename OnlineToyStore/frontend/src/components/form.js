import React,{ Component } from 'react';
import styles from './Login.module.css';
import {FormControl, FormGroup, Button, Form} from 'react-bootstrap';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Navbar from './Navbar';

class EditForm extends Component {

		constructor(props){
			super(props);
			console.log("welcome",props.match.params);
		
			this.state = {
				formFields : {
					price : props.match.params.price,
					id:props.match.params.id,
					id_original:props.match.params.id,
					title:props.match.params.title,
					category:props.match.params.category,
					company:props.match.params.company,
					inventory:props.match.params.inventory
				},
				file_name : ''
			}

		}	
		render(){
			{ 
			return (
        <div className = {styles.form} onSubmit={this.formHandler}>
				<Navbar></Navbar>
				<h2 className={styles.h3}>Edit the product details</h2>
				<Form  name="myForm" id="editForm" onSubmit={this.formHandler} className={styles.editform}>
              <div class="form-group">
							<table>
							<tr><td><label for="exampleFormControlTextarea2">Price</label></td>
							<td><input type="number" class="form-control rounded-0" id="price"  value= {''+this.state.formFields.price+''} placeholder="price" name="price" rows="3" onChange={this.inputChangeHandler}></input></td>
							</tr>
							<tr><td><label for="exampleFormControlTextarea2">Inventory</label></td>
							<td><input type="number" class="form-control rounded-0" id="inventory"  value= {''+this.state.formFields.inventory+''} placeholder="inventory" name="inventory" rows="3" onChange={this.inputChangeHandler}></input></td>
							</tr>
              <tr><td><label for="exampleFormControlTextarea2">Title</label></td>
							<td><input class="form-control rounded-0" id="title"  value= {''+this.state.formFields.title+''} placeholder="title" name="title" rows="3" onChange={this.inputChangeHandler}></input>
								</td></tr>
								<tr><td><label for="exampleFormControlTextarea2">Category</label></td>
							<td><input class="form-control rounded-0" id="category"  value= {''+this.state.formFields.category+''} placeholder="category" name="category" rows="3" onChange={this.inputChangeHandler}></input>
								</td></tr>
							<tr><td><label for="exampleFormControlTextarea2">Company</label>
                </td><td><input class="form-control rounded-0" id="price"  value= {''+this.state.formFields.company+''} placeholder="company" name="company" rows="3" onChange={this.inputChangeHandler}></input>
								</td></tr>
								<input type="file" name="file_name" onChange={this.fileSelectedHandler}/>
								</table>

							</div>
								<Button type="submit" className="btn btn-primary">Save</Button>
							</Form>
              </div>
		)
		}
	
	};
	fileSelectedHandler = e =>{
		this.setState({
			file_name: e.target.files[0].name
		})
				
	}
				
	// keeps updating the state values in signup
	inputChangeHandler = e => {
		let formFields = {...this.state.formFields};
		formFields[e.target.name] = e.target.value;
		this.setState({
		formFields
		});		
    }
    
	//calls the api on submitting the form
	
	formHandler = e => {
		console.log("used id is",this.state.formFields.id);
		e.preventDefault();
		fetch('/products/'+this.state.formFields.id_original+'',{
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: this.state.formFields.id,
				price:this.state.formFields.price,
				title:this.state.formFields.title,
				company:this.state.formFields.company,
				category:this.state.formFields.category,
				img:"img/"+this.state.file_name,
				inventory: this.state.formFields.inventory
			}),
			});
			//clears the form
			let form = document.getElementById("editForm");
			form.reset();
			this.props.history.push("/toylist");	
		}
}

export default EditForm;