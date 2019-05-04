import React,{ Component } from 'react';
import styles from './Login.module.css';
import {FormControl, FormGroup, Button, Form} from 'react-bootstrap';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import Navbar from './Navbar';

class newForm extends Component {

		constructor(props){
			super(props);
			this.state = {
                file_props:'',
				formFields : {
					price : '',
					id:'',
                    title:'',
                    img:'',
					company:'',
					category:'',
					inventory:''
				}
			}

		}	
		render(){
			{ 
			return (
        <div className = {styles.form}>
				<Navbar></Navbar>
				<h2 className={styles.h3}>Add a new product</h2>
				<Form  name="myForm" id="Form" onSubmit={this.formHandler} className={styles.editform}>
              <div class="form-group">
				<table>
				<tr><td> <label for="exampleFormControlTextarea2">Title</label></td>
				<td><input class="form-control rounded-0" id="title"  name="title" rows="3" onChange={this.inputChangeHandler}></input>
                </td></tr>
				<tr><td><label  for="exampleFormControlTextarea2">Price</label>
                </td>
				<td><input type="number" class="form-control rounded-0" id="price"  name="price" rows="3" onChange={this.inputChangeHandler}></input>
              	</td></tr>
				  <tr><td><label  for="exampleFormControlTextarea2">Inventory</label>
                </td>
				<td><input type="number" class="form-control rounded-0" id="inventory"  name="inventory" rows="3" onChange={this.inputChangeHandler}></input>
              	</td></tr>
				<tr><td><label  for="exampleFormControlTextarea2">Category</label>
                </td>
				<td><input class="form-control rounded-0" id="category"  name="category" rows="3" onChange={this.inputChangeHandler}></input>
              	</td></tr>
				
                <label className={styles.label} for="exampleFormControlTextarea2">Company</label>
                <span className={styles.textarea}><textarea class="form-control rounded-0" id="company"  name="company" rows="3" onChange={this.inputChangeHandler}></textarea></span>
                <br></br>
				</table>
    			</div>
                <input type="file" name="file_name" onChange={this.fileSelectedHandler} />
                <br></br>
                <br></br>

				<Button type="submit" className="btn btn-primary">Add</Button>
              </Form>
			  
              </div>
		)
		}
	
	};
        

    fileSelectedHandler = e =>{
        this.state.file_props=e.target.files[0];
        console.log("id of new product is",e.target.files[0].name.split("-")[1][0]);
        this.state.formFields.id = e.target.files[0].name.split("-")[1][0];
            
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
        console.log("company is",this.state.formFields.company);
   
        e.preventDefault();
		fetch('/product',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title : this.state.formFields.title ,
				price : this.state.formFields.price ,
                id : this.state.formFields.id ,
                img:"img/product-"+this.state.formFields.id+".png",
				company:this.state.formFields.company,
				category:this.state.formFields.category,
				inventory: this.state.formFields.inventory
			}),
			}).then(this.props.history.push('/toylist'));
			//clears the form
			let form = document.getElementById("Form");
			form.reset();
   
    }

}

export default newForm;