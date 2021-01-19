import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {userActions} from '../actions'
import "../css/notable.css"
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Card } from 'primereact/card';
import {SERVER} from '../config/global'

const mapStateToProps = function(state) {
    return {
        user : state.user.user,
        loading : state.user.fetching,
        notes: state.user.notes
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
      actions: bindActionCreators({
          getUserNotes: userActions.getUserNotes
      }, dispatch)
    }
}

class Files extends Component{
    constructor(props){
        super(props)

        this.state = {
            rows: []

        };

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

        this.wordHeader =  <img style={{width: "100%",height: "100%"}}  alt="Card" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Microsoft_Office_Word_%282018%E2%80%93present%29.svg/1200px-Microsoft_Office_Word_%282018%E2%80%93present%29.svg.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        this.excelHeader =  <img style={{width: "100%",height: "100%"}}  alt="Card" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Microsoft_Office_Excel_%282018%E2%80%93present%29.svg/1200px-Microsoft_Office_Excel_%282018%E2%80%93present%29.svg.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
        this.pdfHeader =  <img style={{width: "100%",height: "100%"}}  alt="Card" src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Pdflogogt.png" onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
    }
    componentDidMount(){
        if(this.props.user)
        {
            this.setState({rows: []})
            let newRows=[]
            this.props.actions.getUserNotes(this.props.user.user.id).then(notes=>{
                for(let i=0;i<notes.value.length;i+=5)
                   {
                    newRows.push([{n1: notes.value[i],n2: notes.value[i+1],n3: notes.value[i+2],n4: notes.value[i+3],n5: notes.value[i+4]}])

                   } 
                   this.setState({rows: newRows})
                }
            )
                
        }
        }
    render(){
        return<>
        {
           
         <ScrollPanel id="link" style={{color: "rgb(202, 203, 204)",position: "fixed",marginTop:"4vh",marginRight: "0px",width: "100%", height: '94vh',backgroundColor: "#17212f"}}>
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
                                {
                                    row[0].n5 && row[0].n5.extenstion==="docx"?
                                    <Card footer={<Button onClick={() => this.downloadWord(row[0].n5.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.wordHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n5.name}.{row[0].n5.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    row[0].n5 && row[0].n5.extenstion==="xlsx" ?
                                    <Card footer={<Button onClick={() => this.downloadExcel(row[0].n4.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.excelHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n5.name}.{row[0].n5.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    row[0].n5 && row[0].n5.extenstion==="pdf" ?
                                    <Card footer={<Button onClick={() => this.downloadPdf(row[0].n5.id)}  icon="pi pi-download" style={{width: "100%"}}/>} style={{ width: '15%',borderRadius: "10px", cursor: "pointer", overflow: "hidden" }} className="ui-card-shadow"  header={this.pdfHeader}>
                                        <p className="p-m-0" style={{lineHeight: '1.5'}}>{row[0].n5.name}.{row[0].n5.extenstion}</p>
                                        
                                    </Card>
                                    :
                                    null
                                }
                                
                        </div>
                        )
                        
                        }
                        </ScrollPanel>
                        
    }
                        </>          
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Files)