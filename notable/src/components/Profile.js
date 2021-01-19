import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {userActions} from '../actions'
import "../css/notable.css"
import { Button } from 'primereact/button';
import superhero from './superhero.png'
import {Dialog} from 'primereact/dialog'
import { FileUpload } from 'primereact/fileupload';
import {SERVER} from '../config/global'
import { ScrollPanel } from 'primereact/scrollpanel';

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
        getUserGroups : userActions.getUserGroups,
        getUserNotes: userActions.getUserNotes,
        getUserWebNotes: userActions.getUserWebNotes
      }, dispatch)
    }
}

class Profile extends Component{
    constructor(props){
        super(props)
        this.state=
        {
            photoDialog: false,
            profilePhoto: "",
            date: '',
            groups: 0,
            notes: 0,
            files: 0,
            lastpost: ''

        }

        this.newPhotoDialog=() =>
        {
            this.setState({photoDialog: true})
        }

        this.hideNewPhotoDialog=() =>
        {
            this.setState({photoDialog: false})
        }

        this.upload= () =>
        {
            this.props.actions.getUser(this.props.user.user.email).then(r=>
                {
                    const blob = new Blob([new Uint8Array(this.props.user.user.avatar.data)], {type: 'image/jpeg'});
                    let URL = window.URL || window.webkitURL || window;
                    let blobURL = URL.createObjectURL(blob);
                    this.setState({profilePhoto: blobURL})
                    this.setState({photoDialog: false})
                })
        }
        

    }

    componentDidMount()
    {
        this.props.actions.getUserNotes(this.props.user.user.id).then(groups=>
            {
                this.setState({files: groups.value.length})
            })
        this.props.actions.getUserGroups(this.props.user.user.id).then(groups=>
            {
                this.setState({groups: groups.value.length})
            })
        this.props.actions.getUserWebNotes(this.props.user.user.id).
        then(groups=>
            {
                this.setState({notes: groups.value.length})
                if(groups.value.length>0)
                    this.setState({lastpost: groups.value[groups.value.length-1].date})
            })
        if(this.props.user.user.avatar!==null)
        {
            const blob = new Blob([new Uint8Array(this.props.user.user.avatar.data)], {type: 'image/jpeg'});
            let URL = window.URL || window.webkitURL || window;
            let blobURL = URL.createObjectURL(blob);
            this.setState({profilePhoto: blobURL})
        }
        let string= this.props.user.user.createdAt.toString()
        let v=string.split('T')
        let newdate=`${v[0]}`
        this.setState({date: newdate})
    }
    render(){
        return<>
           <div className="profile_header">
               <div className="profile_photo">
                   {
                       this.props.user.user.avatar===null?
                       <img src={superhero}></img>
                       :
                       <img src={this.state.profilePhoto}></img>

                   }
                   <Button  onClick={() => {this.newPhotoDialog()}}style={{marginTop: "10vh",position: "absolute",width: "100%", height: "30%"}} className="p-button-raised p-ai-center" icon="pi pi-pencil"/>
                </div>
                <div className="profile_data">
                    <div className="profile_name">{this.props.user.user.firstName} {this.props.user.user.lastName}</div>
                    <div className="profile_email">{this.props.user.user.email}</div>
                </div>   
           </div>
           <ScrollPanel style={{color: "rgb(202, 203, 204)",position: "fixed",marginRight: "0px",marginLeft: "0px",width: "100vw", height: '74vh',backgroundColor: "#17212f"}}>
                        <div className="profile_body">
                            <div className="row">
                                <div className="attribute">Joined Notable on:</div>
                                <div className="value">{this.state.date}</div>
                            </div>
                            <div className="row">
                                <div className="attribute">Last post on:</div>
                                <div className="value">{this.state.date}</div>
                            </div>
                            <div className="row">
                                <div className="attribute">Member in:</div>
                                <div className="value">{this.state.groups} groups.</div>
                            </div>
                            <div className="row">
                                <div className="attribute">Notes posted:</div>
                                <div className="value">{this.state.notes} notes.</div>
                            </div>
                            <div className="row">
                                <div className="attribute">Files uploaded:</div>
                                <div className="value">{this.state.files} files.</div>
                            </div>
                        </div>
                        

                    </ScrollPanel>
            {
                this.state.photoDialog ?
                <Dialog style={{width: "40%", display: "flex" ,justifyContent: "center"}} visible={this.state.photoDialog} header="Change profile picture!" onHide={this.hideNewPhotoDialog}>
                    <FileUpload name="demo" url={`${SERVER}/users/${this.props.user.user.id}/newphoto`} mode="basic" onUpload={this.upload}/>
                </Dialog>
                :
                null
            }
        </>
        
            
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)