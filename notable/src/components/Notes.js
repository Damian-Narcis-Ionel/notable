import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {userActions} from '../actions'
import "../css/notable.css"
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Card } from 'primereact/card';
import {SERVER} from '../config/global'
import {Dialog} from 'primereact/dialog'
import { Calendar } from 'primereact/calendar';

const mapStateToProps = function(state) {
    return {
        user : state.user.user,
        loading : state.user.fetching,
        webnotes: state.user.webnotes
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
      actions: bindActionCreators({
          getUserWebNotes: userActions.getUserWebNotes
      }, dispatch)
    }
}

class Files extends Component{
    constructor(props){
        super(props)

        this.state = {
            webrows: [],
            viewText: '',
            viewNoteDialog: false,
            selectedNote: 0,
            selectedNoteTitle: '',
            date: ''

        };

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

        this.deleteNote = async(id) =>
        {
            await fetch(`${SERVER}/webnotes/${id}`, {
                method : 'delete',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({})
            }).then(r=>{
                this.setState({webrows: []})
                let newRows=[]
                this.props.actions.getUserWebNotes(this.props.user.user.id).then(notes=>{
                    for(let i=0;i<notes.value.length;i+=5)
                       {
                        newRows.push([{n1: notes.value[i],n2: notes.value[i+1],n3: notes.value[i+2],n4: notes.value[i+3],n5: notes.value[i+4]}])
    
                       } 
                       this.setState({webrows: newRows})
                    }
                )
            }
                )
        }

        this.renderNoteCardFooter = (user_id,name,id) => {
            return (
                <>
                <Button onClick={()=>this.openViewNoteDialog(id,name)}  icon="pi pi-eye" style={{width: "40%",marginLeft: "5%",marginRight: "5%"}}/>
                <Button onClick={()=>this.deleteNote(id)}  icon="pi pi-trash" style={{width: "40%",marginLeft: "5%",marginRight: "5%"}}/>
                </>
            );
          };
        

        this.notepadHeader =  <img style={{width: "100%",height: "100%"}}  alt="Card" src="https://thumbor.forbes.com/thumbor/256x256/https://blogs-images.forbes.com/drewhansen/files/2011/08/Notepad.jpg?width=960" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        
        this.searchNotes = (value) =>
        {
            if(value!==null)
            {
                let string=value.toString()
                let v=string.split(' ')
                let date=`${v[0]} ${v[1]} ${v[2]} ${v[3]}`
                let selected_notes=[]
                for(let note of this.props.webnotes)
                {
                    if(note.date===date)
                        selected_notes.push(note)
                }
                this.setState({webrows: []})
                let newRows=[]
                for(let i=0;i<selected_notes.length;i+=5)
                    {
                        newRows.push([{n1: selected_notes[i],n2: selected_notes[i+1],n3: selected_notes[i+2],n4: selected_notes[i+3],n5: selected_notes[i+4]}])

                    } 
                this.setState({webrows: newRows})
            }
            else{
                this.setState({webrows: []})
                let newRows=[]
                for(let i=0;i<this.props.webnotes.length;i+=5)
                    {
                        newRows.push([{n1: this.props.webnotes[i],n2: this.props.webnotes[i+1],n3: this.props.webnotes[i+2],n4: this.props.webnotes[i+3],n5: this.props.webnotes[i+4]}])

                    } 
                this.setState({webrows: newRows})
            }
        }
    }
    
    componentDidMount(){
        if(this.props.user)
        {
            this.setState({webrows: []})
            let newRows=[]
            this.props.actions.getUserWebNotes(this.props.user.user.id).then(notes=>{
                for(let i=0;i<notes.value.length;i+=5)
                   {
                    newRows.push([{n1: notes.value[i],n2: notes.value[i+1],n3: notes.value[i+2],n4: notes.value[i+3],n5: notes.value[i+4]}])

                   } 
                   this.setState({webrows: newRows})
                }
            )
                
        }
        }
    render(){
        return<>
        {
           
         <ScrollPanel style={{color: "rgb(202, 203, 204)",position: "fixed",marginTop:"4vh",marginRight: "0px",width: "100%", height: '94vh',backgroundColor: "#17212f"}}>
                    <div className="notes_top_bar">
                        <Calendar style={{width: "80%"}}  value={this.state.date} onChange={(e) => this.searchNotes(e.value)} showIcon />
                    </div>
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
                        {
                            row[0].n5?
                            <Card footer={() => this.renderNoteCardFooter(row[0].n5.userId,row[0].n5.name,row[0].n5.id)} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.notepadHeader}>
                                <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n5.name}</p> 
                            </Card>
                            :
                            null
                        }
                    </div>)
                    }  
                    {
                         this.state.viewNoteDialog ?
                         <Dialog style={{width: "80%", display: "flex" ,justifyContent: "center"}} visible={this.state.viewNoteDialog} header={this.state.selectedNoteTitle} onHide={this.hideViewNoteDialog}>
                             <div id="viewNote">
                             </div>
                         </Dialog>
                         :
                         null
                    }
        </ScrollPanel>
                        
    }
                        </>          
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Files)