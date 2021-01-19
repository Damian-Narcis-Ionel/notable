import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {groupActions, userActions} from '../actions'
import { InputText } from 'primereact/inputtext';
import "../css/notable.css"
import { Button } from 'primereact/button';
import {Password} from 'primereact/password';
import { Fieldset } from 'primereact/fieldset';
import { Sidebar } from 'primereact/sidebar';
import {Dialog} from 'primereact/dialog'
import { createGroup } from '../actions/users-actions';
import { ScrollPanel } from 'primereact/scrollpanel';
import { getGroupNotes, getGroupUsers } from '../actions/groups-actions';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import {SERVER} from '../config/global'
import { Dropdown } from 'primereact/dropdown';
import { Editor } from "primereact/editor";

const mapStateToProps = function(state) {
    return {
        groups: state.user.groups,
        user : state.user.user,
        loading : state.user.fetching,
        notes : state.group.notes,
        webnotes: state.group.webnotes,
        links: state.group.links,
        users : state.group.users
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
      actions: bindActionCreators({
          getUser : userActions.getUser,
          addUser : userActions.addUser,
          logOutUser : userActions.logOutUser,
          getUserGroups : userActions.getUserGroups,
          createGroup : userActions.createGroup,
          getGroupNotes : groupActions.getGroupNotes,
          getGroupUsers : groupActions.getGroupUsers,
          addGroupUser : groupActions.addGroupUser,
          editGroupUser: groupActions.editGroupUser,
          deleteGroupUser: groupActions.deleteGroupUser,
          getGroupWebNotes: groupActions.getGroupWebNotes,
          addGroupWebNote: groupActions.addGroupWebNote,
          editGroupWebNote: groupActions.editGroupWebNote,
          getGroupLinks: groupActions.getGroupLinks,
          addGroupLink: groupActions.addGroupLink
      }, dispatch)
    }
}

class Groups extends Component{
    constructor(props){
        super(props)

        this.state={
            dialog: false,
            filesDialog: false,
            membersDialog: false,
            newGroupName: '',
            newMember:'',
            selectedGroup: {
                id: 0,
                group_name: ''
            },
            tab: "notes",
            rows: [],
            webrows: [],
            count: 0,
            webcount: 0,
            usersCount: 0,
            linksCount: 0,
            isAdmin: false,
            isModerator: false,
            editingUser: null,
            editDialog: false,
            roles: [
                {label: 'admin', value: 'admin'},
                {label: 'moderator', value: 'moderator'},
                {label: 'member', value: 'member'}
            ],
            role: 'member',
            editNote: false,
            text: '',
            newNote: false,
            newNoteName: '',
            saveNoteDialog: false,
            viewNoteDialog: false,
            selectedNote: 0,
            selectedNoteTitle: '',
            viewText: '',
            linkName: '',
            linkLink: '',
            linkDialog: false
            
        }

        this.updateProperty = (property, value) => {

            if(property==="newGroupName")
                this.setState({
                    newGroupName : value
                })
            if(property==="newMember")
                this.setState({
                    newMember : value
                }) 
            if(property==="newNoteName")
                this.setState({
                    newNoteName : value
                })
            if(property==="linkName")
                this.setState({
                    linkName : value
                }) 
            if(property==="linkLink")
                this.setState({
                    linkLink : value
                })      
        }

        this.openDialog = () =>
        {
            this.setState({dialog: true})
        }

        this.openSaveNoteDialog = () =>
        {
            this.setState({saveNoteDialog: true})
        }

        this.hideSaveNoteDialog = () =>
        {
            this.setState({saveNoteDialog: false})
        }

        this.openLinkDialog = () =>
        {
            this.setState({linkDialog: true})
        }

        this.hideLinkDialog = () =>
        {
            this.setState({linkDialog: false})
        }

        this.openViewNoteDialog = async(id,name) =>
        {
            let response  = await fetch(`${SERVER}/webnotes/${id}`)
            let json = await response.json()
            this.setState({viewText: json.content})
            this.setState({viewNoteDialog: true})
            this.setState({selectedNote: id})
            this.setState({selectedNoteTitle: name})
            document.getElementById("viewNote").innerHTML=this.state.viewText
        }

        this.hideViewNoteDialog = () =>
        {
            this.setState({viewNoteDialog: false})
        }

        this.createGroup = () =>
        {
            this.props.actions.createGroup(this.props.user.user.id,this.state.newGroupName)
            this.setState({dialog: false})
            this.setState({newGroupName: ''})
        }

        this.editMember = (user) =>
        {
            this.setState({editingUser: user})
            this.setState({editDialog: true})
            this.setState({role: user.role})
        }

        this.addMember = () =>
        {
            this.props.actions.addGroupUser(this.state.selectedGroup.id,this.state.newMember).then(r=>{
                this.setState({membersDialog: false})
                this.setState({usersCount: this.props.users.length})
            })
        }

        this.deleteMember = (user_id) =>
        {
            this.props.actions.deleteGroupUser(this.state.selectedGroup.id,user_id).then(r=>{
                this.setState({usersCount: this.props.users.length})
                this.props.actions.getUserGroups(this.props.user.user.id)
                // this.setState({selectedGroup: {id: 0}})
                // this.setState({count: 0})
                // this.setState({usersCount: 0})
            })
        }

        this.saveUserEdit = () => 
        {
            this.props.actions.editGroupUser(this.state.selectedGroup.id,this.state.editingUser.id,this.state.role)
        }

        this.hideAddDialog = () =>
        {
            this.setState({dialog: false})
        }


        this.hideFilesDialog = () =>
        {
            this.setState({filesDialog: false})
        }

        this.hideEditDialog = () =>
        {
            this.setState({editDialog: false})
            this.setState({editingUser: null})
        }

        this.hideMembersDialog = () =>
        {
            this.setState({membersDialog: false})
        }

        this.saveNote = () =>
        {
            if(this.state.newNoteName.length>3)
            {
                this.props.actions.addGroupWebNote(this.props.user.user.id,this.state.selectedGroup.id,this.state.newNoteName,this.state.text).then(notes=>
                    {
                        this.setState({webrows: []})
                        let w=[]
                        for(let i=0;i<notes.value.notes.length;i+=4)
                        {
                            w.push([{n1: notes.value.notes[i],n2: notes.value.notes[i+1],n3: notes.value.notes[i+2],n4: notes.value.notes[i+3]}])
                        } 
                        this.setState({webrows: w})
                        this.setState({webcount: this.props.webnotes.notes.length})
                        this.setState({saveNoteDialog: false})
                        this.setState({editNote: false})
                        this.setState({text: ''})
                    })
            }
        }

        this.saveLink = () =>
        {
            if(this.state.linkName.length>3 && this.state.linkLink.length>3)
            {
                this.props.actions.addGroupLink(this.props.user.user.id,this.state.selectedGroup.id,this.state.linkName,this.state.linkLink).then(links=>
                    {
                        this.setState({linksCount: this.props.links.length})
                        this.setState({linkDialog: false})
                        this.setState({linkName: ''})
                        this.setState({linkLink: ''})
                    })
            }
        }

        this.saveEditedNote = () =>
        {
                this.props.actions.editGroupWebNote(this.state.selectedNote,this.state.text,this.state.selectedGroup.id).then(notes=>
                    {
                        this.setState({webrows: []})
                        let w=[]
                        for(let i=0;i<notes.value.notes.length;i+=4)
                        {
                            w.push([{n1: notes.value.notes[i],n2: notes.value.notes[i+1],n3: notes.value.notes[i+2],n4: notes.value.notes[i+3]}])
                        } 
                        this.setState({webrows: w})
                        this.setState({webcount: this.props.webnotes.notes.length})
                        this.setState({saveNoteDialog: false})
                        this.setState({editNote: false})
                        this.setState({text: ''})
                    })
                
        }

        this.addDialogFooter =  <div>
            <Button onClick={this.createGroup} label="Create" icon="pi pi-plus-circle" />
            </div>
        this.addMemberDialogFooter =  <div>
        <Button onClick={this.addMember} label="Add" icon="pi pi-plus-circle" />
        </div>    
        this.editFooter =  <div>
        <Button onClick={this.saveUserEdit} label="Save" icon="pi pi-save" />
        </div>    
        this.saveFooter=<div>
        <Button onClick={this.saveNote} label="Save" icon="pi pi-save" />
        </div>   
        this.openGroup = (e) =>
        {
            this.setState({rows: []})
            this.setState({webrows: []})
            let group ={id: e.target.id,group_name: e.target.title}
            this.props.actions.getGroupNotes(e.target.id).then(notes=>{
                for(let i=0;i<notes.value.notes.length;i+=4)
                   {
                    this.state.rows.push([{n1: notes.value.notes[i],n2: notes.value.notes[i+1],n3: notes.value.notes[i+2],n4: notes.value.notes[i+3]}])
                   } 
                this.setState({selectedGroup: group})
                this.setState({count: this.props.notes.notes.length})
               
            })
            this.props.actions.getGroupWebNotes(e.target.id).then(notes=>{
                console.log(notes)
                for(let i=0;i<notes.value.notes.length;i+=4)
                   {
                    this.state.webrows.push([{n1: notes.value.notes[i],n2: notes.value.notes[i+1],n3: notes.value.notes[i+2],n4: notes.value.notes[i+3]}])
                   } 
                this.setState({selectedGroup: group})
                this.setState({webcount: this.props.webnotes.notes.length})
               
            })
            this.props.actions.getGroupLinks(e.target.id).then(links=>{
                this.setState({linksCount: links.value.length})
                console.log(this.props.links)
            })
            this.props.actions.getGroupUsers(e.target.id).then(users=>{
                this.setState({usersCount: this.props.users.length})
                for(let user of this.props.users)
                {
                    if(user.email===this.props.user.user.email)
                    {
                        if(user.role==="admin")
                            this.setState({isAdmin: true})
                        else
                            this.setState({isAdmin: false})
                        if(user.role==="moderator")
                            this.setState({isModerator: true})   
                        else
                            this.setState({isModerator: false})     
                    }
                }
            })
            
        }

        this.selectTab =(e) =>
        {
            this.setState({tab: e.target.id})
        }
        

        this.openDialogFile = () =>
        {
            this.setState({filesDialog: true})
        }

        this.openDialogMember = () =>
        {
            this.setState({membersDialog: true})
        }

        this.wordHeader =  <img style={{width: "100%",height: "100%"}}  alt="Card" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Microsoft_Office_Word_%282018%E2%80%93present%29.svg/1200px-Microsoft_Office_Word_%282018%E2%80%93present%29.svg.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        this.excelHeader =  <img style={{width: "100%",height: "100%"}}  alt="Card" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Microsoft_Office_Excel_%282018%E2%80%93present%29.svg/1200px-Microsoft_Office_Excel_%282018%E2%80%93present%29.svg.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        this.pdfHeader =  <img style={{width: "100%",height: "100%"}}  alt="Card" src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Pdflogogt.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        this.notepadHeader =  <img style={{width: "100%",height: "100%"}}  alt="Card" src="https://thumbor.forbes.com/thumbor/256x256/https://blogs-images.forbes.com/drewhansen/files/2011/08/Notepad.jpg?width=960" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        
        this.upload = (e) =>
        {
            this.setState({rows: []})
            this.props.actions.getGroupNotes(this.state.selectedGroup.id).then(notes=>{
                for(let i=0;i<notes.value.notes.length;i+=4)
                   {
                    this.state.rows.push([{n1: notes.value.notes[i],n2: notes.value.notes[i+1],n3: notes.value.notes[i+2],n4: notes.value.notes[i+3]}])
                   } 
                   this.setState({count: this.props.notes.notes.length})
            })
        }
        

        this.downloadWord = async(id) =>
        {
            let response  = await fetch(`${SERVER}/notes/${id}`)
            let json = await response.json()
            const blob = new Blob([new Uint8Array(json.content.data)], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
            let URL = window.URL || window.webkitURL || window;
            let blobURL = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.download = json.name;
            link.style.opacity = "0";
            document.getElementById("link").append(link);
            link.href = blobURL;
            link.click();
            link.remove();
        }
        this.downloadExcel = async(id) =>
        {
            let response  = await fetch(`${SERVER}/notes/${id}`)
            let json = await response.json()
            const blob = new Blob([new Uint8Array(json.content.data)], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            let URL = window.URL || window.webkitURL || window;
            let blobURL = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.download = json.name;
            link.style.opacity = "0";
            document.getElementById("link").append(link);
            link.href = blobURL;
            link.click();
            link.remove();
        }

        this.downloadPdf = async(id) =>
        {
            let response  = await fetch(`${SERVER}/notes/${id}`)
            let json = await response.json()
            const blob = new Blob([new Uint8Array(json.content.data)], {type: 'application/pdf'});
            let URL = window.URL || window.webkitURL || window;
            let blobURL = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.download = json.name;
            link.style.opacity = "0";
            document.getElementById("link").append(link);
            link.href = blobURL;
            link.click();
            link.remove();
        }
        
        this.renderHeader = () => {
            return (
              <span className="ql-formats">
                <button class="ql-clean" aria-label="Clean"></button>
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-strike" aria-label="Strike"></button>
                <select className="ql-size" aria-label="Strike">
                <option value="small"></option>
                <option selected></option>
                <option value="large"></option>
                <option value="huge"></option>
                </select>
                <button class="ql-script" value="sub"></button>
                <button class="ql-script" value="super"></button>
                <button class="ql-indent" value="-1"></button>
                <button class="ql-indent" value="+1"></button>
                <button class="ql-list" value="bullet"></button>
                <select className="ql-color" ></select>
                <select className="ql-background" ></select>
                <select className="ql-align" ></select>
                <select className="ql-font" ></select>
                <button className="ql-blockquote"></button>
                <button className="ql-code-block"></button>
              </span>
            );
          };

        this.renderNoteCardFooter = (user_id,name,id) => {
            return (
                <>
                {
                    this.props.user.user.id===user_id?
                    <>
                        <Button onClick={()=>this.openViewNoteDialog(id,name)}  icon="pi pi-eye" style={{width: "40%",marginRight: "20%"}}/>
                        <Button onClick={()=>this.editWebNote(id)}  icon="pi pi-pencil" style={{width: "40%"}}/>
                    </>
                    :
                    <Button onClick={()=>this.openViewNoteDialog(id,name)}  icon="pi pi-eye" style={{width: "40%",marginRight: "20%"}}/>
                }
                </>
            );
          };

        this.editWebNote = async(id) =>
        {
            let response  = await fetch(`${SERVER}/webnotes/${id}`)
            let json = await response.json()
            this.setState({text: json.content})
            this.setState({newNote: false})
            this.setState({editNote: true})
            this.setState({selectedNote: id})
        }
        
        this.header=this.renderHeader()

    }
    componentDidMount(){
        if(this.props.user)
        {
            this.props.actions.getUserGroups(this.props.user.user.id)
        }
    }
    render(){
        return<>
           <Sidebar id="link" showCloseIcon={false} visible={true} style={{marginTop: "calc(6vh + 5px)",height: "calc(94vh-5px)",width: "20vw", display: "flex",
    flexDirection: "column",paddingLeft: "0",overflow: "scroll"}} position="left" className="ui-sidebar-sm">
           <Button onClick={this.openDialog} style={{marginLeft: "22%",marginBottom: "5vh"}}label="New Group" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-plus-circle"/>
           {
               this.props.groups ?
               this.props.groups.map(group => <div className="group_sidebar" onClick={this.openGroup} title={group.group_name} id={group.id}><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-users"></span><li id={group.id} title={group.group_name} style={{width: "50%",marginTop: "7%",overflow: "hidden",listStyleType: "none"}} class="p-menuitem-text">{group.group_name}</li></div>)
               :
               null
           }
           </Sidebar>
            {
                this.state.dialog ?
                <Dialog style={{width: "40%", display: "flex" ,justifyContent: "center"}} visible={this.state.dialog} header="Create a new group!" onHide={this.hideAddDialog} footer={this.addDialogFooter} >
                     <InputText onChange={(e) => this.updateProperty('newGroupName', e.target.value)} value={this.state.newGroupName} name="newGroupName" placeholder="Group Name" />
                </Dialog> 
                :
                null
            }
            {
                <ScrollPanel style={{color: "rgb(202, 203, 204)",position: "fixed",marginTop:"1vh",marginRight: "0px",marginLeft: "20vw",width: "80vw", height: '94vh',backgroundColor: "#17212f"}}>
                    <div className="group_title">
                    <div style={{marginRight: "2%"}}className="pi pi-users"></div>
                    <div>{this.state.selectedGroup.group_name}</div>
                    </div>
                    <div className="tabview">
                        {
                            this.state.tab==="files" ?
                            <>
                                <div onClick={this.selectTab} id="notes" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-book"></span>Notes ({this.state.webcount})</div>
                                <div onClick={this.selectTab} id="files" className="tabview_item_selected"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-file"></span>Files ({this.state.count})</div>
                                <div onClick={this.selectTab} id="members" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-user"></span>Members ({this.state.usersCount})</div>
                                <div onClick={this.selectTab} id="links" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-external-link"></span>Links ({this.state.linksCount})</div>
                            </>
                            :
                            this.state.tab==="notes"?
                            <>
                                <div onClick={this.selectTab} id="notes" className="tabview_item_selected"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-book"></span>Notes ({this.state.webcount})</div>
                                <div onClick={this.selectTab} id="files" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-file"></span>Files ({this.state.count})</div>
                                <div onClick={this.selectTab} id="members" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-user"></span>Members ({this.state.usersCount})</div>
                                <div onClick={this.selectTab} id="links" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-external-link"></span>Links ({this.state.linksCount})</div>
                            </>
                            :
                            this.state.tab==="members"?
                            <>
                                <div onClick={this.selectTab} id="notes" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-book"></span>Notes ({this.state.webcount})</div>
                                <div onClick={this.selectTab} id="files" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-file"></span>Files ({this.state.count})</div>
                                <div onClick={this.selectTab} id="members" className="tabview_item_selected"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-user"></span>Members ({this.state.usersCount})</div>
                                <div onClick={this.selectTab} id="links" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-external-link"></span>Links ({this.state.linksCount})</div>
                            </>
                            :
                            <>
                                <div onClick={this.selectTab} id="notes" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-book"></span>Notes ({this.state.webcount})</div>
                                <div onClick={this.selectTab} id="files" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-file"></span>Files ({this.state.count})</div>
                                <div onClick={this.selectTab} id="members" className="tabview_item"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-user"></span>Members ({this.state.usersCount})</div>
                                <div onClick={this.selectTab} id="links" className="tabview_item_selected"><span style={{marginRight: "2%"}}class="p-menuitem-icon pi pi-fw pi-external-link"></span>Links ({this.state.linksCount})</div>
                            </>
                        }
                    </div>
                    {
                        this.state.tab==="files" && this.state.selectedGroup.id!==0 ?
                        <>
                        <Button onClick={this.openDialogFile} style={{marginLeft: "85%",marginBottom: "2.5%",marginTop: "2%"}} label="Add File" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-plus-circle"/>
                        {
                            this.state.rows.map(row=><div className="row">
                                {
                                    row[0].n1 && row[0].n1.extenstion==="docx"?
                                    <Card footer={<Button onClick={() => this.downloadWord(row[0].n1.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden"}} className="ui-card-shadow"  header={this.wordHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n1.name}.{row[0].n1.extenstion}</p>
                                
                                    </Card>
                                    :
                                    row[0].n1 && row[0].n1.extenstion==="xlsx" ?
                                    <Card footer={<Button onClick={() => this.downloadExcel(row[0].n1.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.excelHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n1.name}.{row[0].n1.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    row[0].n1 && row[0].n1.extenstion==="pdf" ?
                                    <Card footer={<Button onClick={() => this.downloadPdf(row[0].n1.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden"}} className="ui-card-shadow"  header={this.pdfHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n1.name}.{row[0].n1.extenstion}</p>
            
                                    </Card>
                                    :
                                    null
                                }
                                {
                                    row[0].n2 && row[0].n2.extenstion==="docx"?
                                    <Card footer={<Button onClick={() => this.downloadWord(row[0].n2.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.wordHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n2.name}.{row[0].n2.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    row[0].n2 && row[0].n2.extenstion==="xlsx" ?
                                    <Card footer={<Button onClick={() => this.downloadExcel(row[0].n2.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.excelHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n2.name}.{row[0].n2.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    row[0].n2 && row[0].n2.extenstion==="pdf" ?
                                    <Card footer={<Button onClick={() => this.downloadExcel(row[0].n2.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.pdfHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n2.name}.{row[0].n2.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    null
                                }
                                {
                                    row[0].n3 && row[0].n3.extenstion==="docx"?
                                    <Card footer={<Button onClick={() => this.downloadWord(row[0].n3.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.wordHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n3.name}.{row[0].n3.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    row[0].n3 && row[0].n3.extenstion==="xlsx" ?
                                    <Card footer={<Button onClick={() => this.downloadExcel(row[0].n3.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.excelHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n3.name}.{row[0].n3.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    row[0].n3 && row[0].n3.extenstion==="pdf" ?
                                    <Card footer={<Button onClick={() => this.downloadPdf(row[0].n3.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.pdfHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n3.name}.{row[0].n3.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    null
                                }
                                {
                                    row[0].n4 && row[0].n4.extenstion==="docx"?
                                    <Card footer={<Button onClick={() => this.downloadWord(row[0].n4.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.wordHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n4.name}.{row[0].n4.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    row[0].n4 && row[0].n4.extenstion==="xlsx" ?
                                    <Card footer={<Button onClick={() => this.downloadExcel(row[0].n4.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.excelHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n4.name}.{row[0].n4.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    row[0].n4 && row[0].n4.extenstion==="pdf" ?
                                    <Card footer={<Button onClick={() => this.downloadPdf(row[0].n4.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.pdfHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n4.name}.{row[0].n4.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    null
                                }
                                
                        </div>
                        )
                        }
                        </>
                        :
                        this.state.tab==="members" && this.state.selectedGroup.id!=0 ?
                        <>
                            {
                                this.state.isAdmin  || this.state.isModerator ?
                                <div class="twobuttons">
                                <Button onClick={this.openDialogMember} style={{height: "40%",marginLeft: "65%",marginBottom: "2.5%",marginTop: "2%"}} label="Add Member" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-plus-circle"/>
                                <Button onClick={() => this.deleteMember(this.props.user.user.id)} style={{height: "40%",marginLeft: "3%",marginBottom: "2.5%",marginTop: "2%"}} label="Leave Group" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-sign-out"/>
                                </div> 
                                :
                                <Button onClick={() => this.deleteMember(this.props.user.user.id)} style={{marginLeft: "80%",marginBottom: "2.5%",marginTop: "2%"}} label="Leave Group" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-sign-out"/>
                            }
                          {
                              this.props.users ?
                              this.props.users.map(user=><div className="user_row">
                                  <div className="email">{user.email}</div>
                                  <div className="name">{user.firstName} {user.lastName}</div>
                                  <div className="role">{user.role}</div>
                                  {
                                      this.state.isAdmin ?
                                      <>
                                        <Button onClick={() => this.editMember(user)} style={{marginRight: "5px",marginTop: "1%",width: "3%", height: "50%"}} className="p-button-raised p-ai-center" icon="pi pi-pencil"/>
                                        <Button onClick={() => this.deleteMember(user.id)} style={{marginTop: "1%",width: "3%", height: "50%"}} className="p-button-raised p-ai-center" icon="pi pi-trash"/>
                                      </>
                                      :
                                      null
                                  }
                              </div>)
                              :
                              null
                          }
                        </>
                        :
                        this.state.tab==="notes" && this.state.selectedGroup.id!=0 ?
                        <>
                        {
                            this.state.editNote===false?
                            <>
                            <Button onClick={()=>{this.setState({editNote: true}); this.setState({newNote: true})}} style={{marginLeft:'80%',marginTop: "2%"}} label="Create a note" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-plus-circle"/>
                            {
                                this.state.webrows.map(row=><div className="row">
                                    {
                                        row[0].n1?
                                        <Card footer={() => this.renderNoteCardFooter(row[0].n1.userId,row[0].n1.name,row[0].n1.id)} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.notepadHeader}>
                                            <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n1.name}</p> 
                                        </Card>
                                        :
                                        null
                                    }
                                    {
                                        row[0].n2?
                                        <Card footer={() => this.renderNoteCardFooter(row[0].n2.userId,row[0].n2.name,row[0].n2.id)} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.notepadHeader}>
                                            <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n2.name}</p> 
                                        </Card>
                                        :
                                        null
                                    }
                                    {
                                        row[0].n3?
                                        <Card footer={() => this.renderNoteCardFooter(row[0].n3.userId,row[0].n3.name,row[0].n3.id)} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.notepadHeader}>
                                            <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n3.name}</p> 
                                        </Card>
                                        :
                                        null
                                    }
                                    {
                                        row[0].n4?
                                        <Card footer={() => this.renderNoteCardFooter(row[0].n4.userId,row[0].n4.name,row[0].n4.id)} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.notepadHeader}>
                                            <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n4.name}</p> 
                                        </Card>
                                        :
                                        null
                                    }
                                </div>)
                            }
                            </>
                            :
                            <>
                            <div className="twobuttons1">
                                {
                                    this.state.newNote?
                                    <>
                                        <Button onClick={()=>this.setState({editNote: false})} style={{marginLeft:'10%',marginTop: "2%"}} label="Go Back" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-angle-left"/>
                                        <Button onClick={this.openSaveNoteDialog} style={{marginLeft:'60%',marginTop: "2%"}} label="Save" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-save"/>
                                    </>
                                    :
                                    <>
                                        <Button onClick={()=>this.setState({editNote: false})} style={{marginLeft:'10%',marginTop: "2%"}} label="Go Back" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-angle-left"/>
                                        <Button onClick={this.saveEditedNote} style={{marginLeft:'60%',marginTop: "2%"}} label="Save" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-save"/>
                                    </>
                                }
                                
                            </div>
                            <Editor headerTemplate={this.header} style={{ height: "65vh" }} value={this.state.text} onTextChange={(e) => this.setState({text: e.htmlValue})}/>
                            </>
                        }
                            
                        </>
                        :
                        this.state.tab==="links" && this.state.selectedGroup.id!=0 ?
                        <>
                        <Button onClick={this.openLinkDialog} style={{marginLeft: "80%",marginBottom: "2.5%",marginTop: "2%"}} label="Add Link" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-plus-circle"/>
                         {
                              this.props.links ?
                              this.props.links.map(link=><div className="user_row">
                                  <div className="email">{link.name}</div>
                                  <div className="link"><a style={{color: "#64B5F6"}} href={link.link}>{link.link}</a></div>
                              </div>)
                              :
                              null
                          }
                        </>
                        :
                        null
                    }
                    {
                        this.state.filesDialog ?
                        <Dialog style={{width: "40%", display: "flex" ,justifyContent: "center"}} visible={this.state.filesDialog} header="Add a new file!" onHide={this.hideFilesDialog}>
                            <FileUpload name="demo" url={`${SERVER}/notes/${this.props.user.user.id}/${this.state.selectedGroup.id}`} mode="basic" onUpload={this.upload}/>
                        </Dialog>
                        :
                        this.state.membersDialog ?
                        <Dialog footer={this.addMemberDialogFooter} style={{width: "40%", display: "flex" ,justifyContent: "center"}} visible={this.state.membersDialog} header="Add a new member to the group!" onHide={this.hideMembersDialog}>
                            <InputText onChange={(e) => this.updateProperty('newMember', e.target.value)} value={this.state.newMember} name="newMember" placeholder="User's email" />
                        </Dialog>
                        :
                        this.state.editDialog ?
                        <Dialog footer={this.editFooter} style={{width: "60%"}} visible={this.state.editDialog} header="Edit member's rights!" onHide={this.hideEditDialog}>
                            <Dropdown style={{width: "100%",height: "100%",marginBottom: "20%"}}optionLabel="label" value={this.state.role} options={this.state.roles} onChange={(e) => {this.setState({role: e.value})}} placeholder="Role:"/>
                        </Dialog>
                        :
                        this.state.saveNoteDialog ?
                        <Dialog footer={this.saveFooter} style={{width: "40%", display: "flex" ,justifyContent: "center"}} visible={this.state.saveNoteDialog} header="Add a new new note!" onHide={this.hideSaveNoteDialog}>
                            <InputText onChange={(e) => this.updateProperty('newNoteName', e.target.value)} value={this.state.newNoteName} name="newNoteName" placeholder="Name your note" />
                        </Dialog>
                        :
                        this.state.viewNoteDialog ?
                        <Dialog style={{width: "80%", display: "flex" ,justifyContent: "center"}} visible={this.state.viewNoteDialog} header={this.state.selectedNoteTitle} onHide={this.hideViewNoteDialog}>
                            <div id="viewNote" className="ql-editor">
                            </div>
                        </Dialog>
                        :
                        this.state.linkDialog ?
                        <Dialog footer={ <Button onClick={this.saveLink} label="Save" className="p-button-rounded p-button-raised p-button-lg p-ai-center" icon="pi pi-save"/>}style={{width: "40%", display: "flex",flexDirection: "flex-column" ,justifyContent: "center"}} visible={this.state.linkDialog} header="Add a new link to the group!" onHide={this.hideLinkDialog}>
                            <InputText onChange={(e) => this.updateProperty('linkName', e.target.value)} value={this.state.linkName} name="linkName" placeholder="Add a name for your link" />
                            <br></br>
                            <br></br>
                            <InputText onChange={(e) => this.updateProperty('linkLink', e.target.value)} value={this.state.linkLink} name="linkLink" placeholder="Add your link" />
                        </Dialog>
                        :
                        null
                    }
                    
                    
            </ScrollPanel>
            }
        </>
        
            
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Groups)
