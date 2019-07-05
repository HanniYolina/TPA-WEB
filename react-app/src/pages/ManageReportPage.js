import React from 'react'
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import Axios from 'axios'
import {Redirect} from 'react-router-dom'
import ReportDetail from '../containers/ReportDetail';

class ManageReportPage extends React.Component{
    constructor(){
        super();
        this.state = {
            pageNum : 1,
            loading : false,
        }
    }
    getReport(){
        this.setState({
            loading : true
        })

        Axios.post(`http://localhost:8000/api/getReport?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                allReport : response.data.data,
                last_page : response.data.last_page,
                loading : false
            }, ()=>console.log(this.state.allReport))
        })
    }

    getUser(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getUser', {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                status : response.status,
                user : response.data.user,
                type : response.data.user.type,
                user_id : response.data.user.id,
                loading : false
            },()=>{this.getReport()})
        })
    }

    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type != 3){
            if(this.state.type == 1){
                return <Redirect to="/"/>
            }
            else if(this.state.type == 2){
                return <Redirect to="/ownerDashboard"/>
            }
        }
    }

    changePageNum(){
        let curr = this.state.pageNum
        if(this.state.pageNum == this.state.last_page){
            this.setState({
                pageNum : 1
            }, ()=> this.getReport())
        }
        else{
            this.setState({
                pageNum : curr + 1
            }, ()=> this.getReport())
        }
    }

    componentWillMount(){
        this.getUser();
    }

    render(){
        return(
            <div>
                {this.checkUser()}
                <NavBar></NavBar>
                <BreadCrumbs></BreadCrumbs>
                {
                    this.state.allReport && this.state.allReport.map((report, key)=> (
                        <ReportDetail report={report} key={key}></ReportDetail>
                    ))
                }
                <button onClick={this.changePageNum.bind(this)}>Next</button>
            </div>
        )
    }
}

export default ManageReportPage