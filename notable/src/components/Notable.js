import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {userActions} from '../actions'
import "../css/notable.css"
import Login from "./Login"
import Groups from "./Groups"
import Files from "./Files"
import Notes from "./Notes"
import Profile from "./Profile"
import { TabMenu } from 'primereact/tabmenu';

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
          logOutUser : userActions.logOutUser,
          getUserNotes: userActions.getUserNotes
      }, dispatch)
    }
}

class Notable extends Component{
    constructor(props){
        super(props)

        this.state = {
            items: [
                {label: 'Your Groups', icon: 'pi pi-fw pi-users'},
                {label: 'Your Notes', icon: 'pi pi-fw pi-book'},
                {label: 'Your Files', icon: 'pi pi-fw pi-file'},
                {label: 'Your Profile', icon: 'pi pi-fw pi-user'},
                {label: 'Login', icon: 'pi pi-fw pi-sign-in'}
            ],
            items1: [
                {label: 'Your Groups', icon: 'pi pi-fw pi-users'},
                {label: 'Your Notes', icon: 'pi pi-fw pi-book'},
                {label: 'Your Files', icon: 'pi pi-fw pi-file'},
                {label: 'Your Profile', icon: 'pi pi-fw pi-user'},
                {label: 'Logout', icon: 'pi pi-fw pi-sign-out',command : () => this.logout()}
            ],
            activeItem : {label: "Login", icon: "pi pi-fw pi-sign-in"}


        };

        this.logout = () =>
        {
            this.props.actions.logOutUser()
        }

    }
    componentDidMount(){

        }
    render(){
        return<>
        {
           this.props.user==null ?
            <TabMenu style={{width: '100vw',height: '6vh'}} model={this.state.items} activeItem={this.state.activeItem} onTabChange={(e) => this.setState({activeItem: e.value})}/>
            :
            <>
            {
                this.state.activeItem.label=="Your Groups" ?
                    <>
                    <TabMenu style={{width: '100vw',height: '6vh'}} model={this.state.items1} activeItem={this.state.activeItem} onTabChange={(e) => this.setState({activeItem: e.value})}/>
                    <Groups/>
                    </>
                    :
                    this.state.activeItem.label=="Your Files" ?
                    <>
                    <TabMenu style={{width: '100vw',height: '6vh'}} model={this.state.items1} activeItem={this.state.activeItem} onTabChange={(e) => this.setState({activeItem: e.value})}/>
                    <Files/>
                    </>
                    :
                    this.state.activeItem.label=="Your Profile" ?
                    <>
                    <TabMenu style={{width: '100vw',height: '6vh'}} model={this.state.items1} activeItem={this.state.activeItem} onTabChange={(e) => this.setState({activeItem: e.value})}/>
                    <Profile/>
                    </>
                    :
                    this.state.activeItem.label=="Your Notes" ?
                    <>
                    <TabMenu style={{width: '100vw',height: '6vh'}} model={this.state.items1} activeItem={this.state.activeItem} onTabChange={(e) => this.setState({activeItem: e.value})}/>
                    <Notes/>
                    </>
                    :
                    null     
        }
        </>
    }
        {
            this.state.activeItem.label=="Login" && this.props.user==null ?
            <Login/>
            :
            this.state.activeItem.label=="Login" && this.props.user!==null ?
            <TabMenu style={{width: '100vw',height: '6vh'}} model={this.state.items1} activeItem={this.state.activeItem} onTabChange={(e) => this.setState({activeItem: e.value})}/>
            :
            null
        }
        </>

            
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notable)