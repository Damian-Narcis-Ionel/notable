import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {userActions} from '../actions'
import { InputText } from 'primereact/inputtext';
import "../css/notable.css"
import { Button } from 'primereact/button';
import {Password} from 'primereact/password';
import { Fieldset } from 'primereact/fieldset';
import Register from "./Register"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const mapStateToProps = function(state) {
    return {
        user : state.user.user,
        loading : state.user.fetching,
        passError: state.user.passError
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
      actions: bindActionCreators({
          getUser : userActions.getUser,
          addUser : userActions.addUser,
          logOutUser : userActions.logOutUser
      }, dispatch)
    }
}

class Login extends Component{
    constructor(props){
        super(props)

        this.state=
        {
            user :
            {
                email : '',
                password : ''
            },
            register: false,
            emailError: '',

        }

        this.updateProperty = (property, value) => {
            let user = this.state.user
            user[property] = value
            this.setState({
                user : user
            })
        }

        this.loginUser = () => {
            
            this.props.actions.getUser(this.state.user.email).then(response  =>{
                if(response.value)
                {
                    if(!(response.value.user.password===this.state.user.password))
                    {
                        this.props.actions.logOutUser()
                    }
                    
                }
                else
                {
                    this.setState({emailError: "Email not registered."})
                }
                
            })
        }
    }

    componentDidMount() {
       
    }

    render(){
        return<>
            {
                this.state.register ?
                <Register/>
                :
                <div className="container">
                    <Fieldset legend="Login">
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="email">Email:</label>
                            <InputText onChange={(e) => this.updateProperty('email', e.target.value)} id="email" type="text"/>
                            <small style={{color: "#ed1f37"}}>{this.state.emailError}</small>
                        </div>
                        <div className="p-field">
                            <label htmlFor="pass">Parola:</label>
                            <Password onChange={(e) => this.updateProperty('password', e.target.value)} id="pass" feedback={false}/>
                        </div>
                        <Button  label="Login" onClick={this.loginUser}/>
                        <div className="no-acc" onClick={() => this.setState({register : true})}>Nu ai cont? Creaza unul aici.</div> 
                    </div>
                    </Fieldset>
                </div>
            }
            
        </>
        
            
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)