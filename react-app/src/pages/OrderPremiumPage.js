import React from 'react'
import styled from 'styled-components'
import NavBar from '../containers/NavBar'
import BreadCrumbs from '../components/BreadCrumbs'
import Axios from 'axios'
import Loading from '../components/Loading'
import {Redirect, Link} from 'react-router-dom'

const Main =styled('div')`
    background-color : white;
    width : 90vw;
    height : 50vh;
    margin : 0 auto;
    margin-top : 5vh;
    margin-bottom : 5vh;
    border : 2px solid #3cba92;
`

const Label = styled('div')`
    width : 100%;
    text-align : center;
`

class OrderPremiumPage extends React.Component{
    constructor(){
        super();

        this.state = {
            order : false,
            transaction : ""
        }
    }

    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type != 2){
            if(this.state.type == 1){
                return <Redirect to="/"/>
            }
            else if(this.state.type == 3){
                return <Redirect to="/adminDashboard"/>
            }
        }
    }

    getPremium(){
        this.setState({
            loading : true
        })
        Axios.post('http://localhost:8000/api/getPremiumById', {
            token: sessionStorage.getItem('token'),
            id : this.props.history.location.state.premium.id
        }).then(response => {
            this.setState({
                premium : response.data,
                loading : false
            })
        })
    }

    makeTransaction(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/orderPremium', {
            token: sessionStorage.getItem('token'),
            user_id: this.props.history.location.state.id,
            duration : this.state.premium.duration,
            price : this.state.premium.price,

        }).then(response => {
            this.setState({
                loading : false,
                order : true,
                transaction : response.data,
            })
        })        
    }

    sendPDF(){
        this.setState({
            loading : true
        })
        Axios.post('http://localhost:8000/api/sendPDF', {
            token: sessionStorage.getItem('token'),
            premiumOwner : this.state.premiumOwner,
            price : this.state.premium.price,
        }).then(response => {
            this.setState({
                loading : false,
            })
        })
    }

    addPremiumOwner(){
        this.setState({
            loading : true
        })
        // console.log(this.state.transaction)
        // let transaction = JSON.parse(this.state.transaction)
        Axios.post('http://localhost:8000/api/addPremiumOwner', {
            token: sessionStorage.getItem('token'),
            user_id: this.props.history.location.state.id,
            transaction : this.state.transaction
            // id : this.state.transaction.id
        }).then(response => {
            this.setState({
                loading : false,
                premiumOwner : response.data
            },()=>this.sendPDF())
        })
    }

    doPayment(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/payPremium', {
            token: sessionStorage.getItem('token'),
            id : this.state.transaction.id
        }).then(response => {
            this.setState({
                loading : false,
                transaction : response.data
            })
            this.addPremiumOwner();
        })    
    }

    getPremiumOwnerById(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getPremiumOwnerById', {
            token: sessionStorage.getItem('token'),
            id : this.props.history.location.state.id,
        }).then(response => {
            this.setState({
                loading : false,
                purchaseOwner : response.data
            })
        })
    }

    componentDidMount(){
        this.getPremium();
        this.getPremiumOwnerById();
    }

    render(){
        // console.log(this.state.purchaseOwner)
        let premium = this.props.history.location.state.premium
        let duration;
        let content;

        if(this.state.purchaseOwner){
            content = <Main>
                <Label><h3>You already bought another premium product</h3></Label>
                <Label><Link to="/premiumProduct"><button>Back</button></Link></Label>
            </Main>
        }
        else{
            if(this.state.order == false){
                duration = JSON.parse(premium.duration)
            }
            else{
                // console.log(this.state.transaction.duration)
                duration = JSON.parse(this.state.transaction.duration)
            }
            
            let labelDuration;
    
            if(duration.month!=0){
                labelDuration = <h3>{duration.month} Month</h3>
            }
            else if(duration.day !=0){
                labelDuration = <h3>{duration.days} Days</h3>
            }
            else if(duration.week!=0){
                labelDuration = <h3>{duration.week} Week</h3>
            }
            else if(duration.year!=0){
                labelDuration = <h3>{duration.year} Year</h3>
            }
    
            if(this.state.order == false){
                content = <Main>
                            <Label><h3>Rp. {premium.price},00</h3></Label>
                            <Label>{labelDuration}</Label>
                            <Label><button onClick={this.makeTransaction.bind(this)}>Order</button></Label>
                        </Main>
            }
            else{
                let date;
                if(this.state.transaction.paid_at){
                    date = <Label>
                        <h3>Payment Finished at</h3>
                        <h3>{this.state.transaction.paid_at.date}</h3></Label>          
                }
                else{
                    date = <Label>
                        <h3>Do payment before</h3>
                        <h3>{this.state.transaction.due_date.date}</h3>
                        <button onClick={this.doPayment.bind(this)}>Finish Payment</button></Label>
                }
                content = <Main>
                    <Label><h3>{this.state.transaction.invoice}</h3></Label>
                    <Label><h3>Rp. {this.state.transaction.price},00</h3></Label>
                    <Label>{labelDuration}</Label>
    
                    <br></br>
                    
                    {date}
                </Main>
            }

        }
        
        
        
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }

        return(
            <div>
                {this.checkUser()}
                {loading}
                <NavBar></NavBar>
                <BreadCrumbs></BreadCrumbs>
                {content}
            </div>
        )
    }
}

export default OrderPremiumPage