import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {userActions} from '../actions'
import { InputText } from 'primereact/inputtext';
import "../css/notable.css"
import { Button } from 'primereact/button';
import {Password} from 'primereact/password';
import { Fieldset } from 'primereact/fieldset';
import {SERVER} from '../config/global'

const mapStateToProps = function(state) {
    return {
        user : state.user.user,
        loading : state.user.fetching
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
      actions: bindActionCreators({
          getUser : userActions.getUser,
          addUser : userActions.addUser,
      }, dispatch)
    }
}

class Register extends Component{
    constructor(props){
        super(props)
        this.state=
        {
            user :
            {
                email : '',
                firstName : '',
                lastName : '',
                password : '',
                avatar : null
            },
            emailHelp: 'Sunt acceptate doar adrese institutionale.'
        }

        this.updateProperty = (property, value) => {
            let user = this.state.user
            user[property] = value
            this.setState({
                user : user
            })
        }

        this.addNewUser = async() => {

        let v=this.state.user.email.split('@')
        let ok=0
        if(v.length<2 || v.length>2)
            ok=1
        if(v[0].length<6)
            ok=1
        if(v[1]!=="stud.ase.ro")
            ok=1
        if(ok===0)
        {
            let response  = await fetch(`${SERVER}/users/${this.state.user.email}`)
            let json = await response.json()
            if(json.message==="user not found")
            this.props.actions.addUser(this.state.user)
            else
              {
                this.setState({emailHelp: "Email already registered."})
                document.getElementById("email-help").style.color="#ed1f37"
              }  
            
      
            this.setState({
                user :
            {
                email : '',
                firstName : '',
                lastName : '',
                password : '',
                avatar : null
            }
            })
        }
        else
        {
            this.setState({emailHelp: "Invalid email."})
            document.getElementById("email-help").style.color="#ed1f37"
        }
    }
        
    }
    render(){
        return<div className="container">
            <Fieldset legend="Register">
            <div className="p-fluid">
                <div className="p-field">
                    <label htmlFor="firstname">Nume:</label>
                    <InputText onChange={(e) => this.updateProperty('firstName', e.target.value)} id="firstname" type="text"/>
                </div>
                <div className="p-field">
                    <label htmlFor="lastname">Prenume:</label>
                    <InputText onChange={(e) => this.updateProperty('lastName', e.target.value)} id="lastname" type="text"/>
                </div>
                <div className="p-field">
                    <label htmlFor="email">Email:</label>
                    <InputText onChange={(e) => this.updateProperty('email', e.target.value)} id="email" type="text"/>
                    <small id="email-help">{this.state.emailHelp}</small>
                </div>
                <div className="p-field">
                    <label htmlFor="pass">Parola:</label>
                    <Password onChange={(e) => this.updateProperty('password', e.target.value)} id="pass"/>
                    <small id="pass-help">Minim 8 caractere.</small>
                </div>
                <Button  label="Register" onClick={this.addNewUser}/>
            </div>
            </Fieldset>
        </div>
        
            
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Register)