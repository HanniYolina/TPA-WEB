import React from 'react'
import styled from 'styled-components'
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import Axios from 'axios';
import TransactionDetail from '../containers/TransactionDetail';
import {Redirect} from 'react-router-dom';
import Loading from '../components/Loading'

const Container = styled('div')`
    width : 100vw;
    height : 50vh;
    margin 0 auto;
`

const divStyle = {
    width : '30%',
    height : '10%',
    backgroundColor : 'white',
    border : '2px solid #3cba92',
    margin : '0 auto',
    marginTop : '5vh',
    textAlign : 'center',
    fontSize : '100%',
    borderRadius: '10px',
}

const Tab = styled('div')`
    display : flex;
    width : 50%;
`

class ManageTransaction extends React.Component{
    constructor(){
        super();

        this.state = {
            page : "All Transaction",
            transaction : "",
            pageNum : 1,
            completePageNum : 1
        }
    }
    getAllTransaction(){
        this.setState({
            loading : true
        })

        Axios.post(`http://localhost:8000/api/getAllTransaction?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                transaction : response.data.data,
                last_page : response.data.last_page,
                loading : false
            })
            
        })
    }

    getCompletedTransaction(){
        this.setState({
            loading : true
        })

        Axios.post(`http://localhost:8000/api/getCompletedTransaction?page=${this.state.completePageNum}`, {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                completedTransaction : response.data.data,
                completed_last_page : response.data.last_page,
                loading : false
            })
            
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
                type : response.data.user.type,
                loading : false
            })
        })

    }

    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type != 3){
            if(this.state.type == 2){
                return <Redirect to="/ownerDashboard"/>
            }
            else if(this.state.type == 1){
                return <Redirect to="/"/>
            }
        }
    }

    componentDidMount(){
        this.getUser();
        this.getAllTransaction()
        this.getCompletedTransaction()
    }

    pageChange(ev){
        this.setState({
            page : ev.target.value
        })
    }

    changePageNum(){
        let curr = this.state.pageNum
        if(this.state.pageNum == this.state.last_page){
            this.setState({
                pageNum : 1
            }, ()=> this.getAllTransaction())
        }
        else{
            this.setState({
                pageNum : curr + 1
            }, ()=> this.getAllTransaction())
        }
    }

    changeCompletePageNum(){
        let curr = this.state.completePageNum
        if(this.state.completePageNum == this.state.completed_last_page){
            this.setState({
                completePageNum : 1
            }, ()=> this.getCompletedTransaction())
        }
        else{
            this.setState({
                completePageNum : curr + 1
            }, ()=> this.getCompletedTransaction())
        }
    }

    render(){
        let content
        if(this.state.page == "All Transaction"){
            content = <div>
                {
                    this.state.transaction && this.state.transaction.map((transaction, key)=> (
                        <TransactionDetail transaction={transaction} key={key}></TransactionDetail>
                    ))
                }
                <button onClick={this.changePageNum.bind(this)}>Next</button>
            </div>
        }
        else if(this.state.page == "Complete Transaction"){
            content = <div>
                {
                    this.state.completedTransaction && this.state.completedTransaction.map((transaction, key)=> (
                        <TransactionDetail transaction={transaction} key={key}></TransactionDetail>
                    ))
                }
                <button onClick={this.changeCompletePageNum.bind(this)}>Next</button>
            </div>
        }

        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        return(
            <div>
                {this.checkUser()}
                {loading}
                <Container>
                    <NavBar></NavBar>
                    <BreadCrumbs></BreadCrumbs>
                    <Tab>
                        <button style={divStyle} value="All Transaction" onClick={this.pageChange.bind(this)}>All Transaction</button>
                        <button style={divStyle} value="Complete Transaction" onClick={this.pageChange.bind(this)}>Complete Transaction</button>
                    </Tab>
                    {content}
                </Container>
            </div>
        )
    }
}

export default ManageTransaction