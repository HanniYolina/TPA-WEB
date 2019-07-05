import React from 'react'
import {Link, Redirect} from 'react-router-dom'
import Axios from 'axios'
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import styled from 'styled-components'
import Loading from '../components/Loading';

const Container = styled('div')`
    width : 100vw;
    height : 50vh;
    margin 0 auto;
`
const BoxStyle = styled('div')`
    height: 20vw;
    width: 20vw;
    margin: 2vw;
    padding: 2%;
    border: 2px #3cba92 solid;
`

const Number = styled('div')`
    border-radius: 50%;
    width: 15vw;
    height: 15vw;
    border: 2px solid #3cba92;
    text-align: center;
    font: 13vw Arial, sans-serif;
    margin : 0 auto;
`

class AdminDashboard extends React.Component{
    constructor(){
        super();

        this.state = {
            loading : false
        }
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
    getUser(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getUser', {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                status : response.status,
                user_id : response.data.user.id,
                type : response.data.user.type,
            }, ()=>{
                this.countUser();
                this.countPost();
                this.countPremium();
                this.countFacility();
                this.countTransaction();
            })
        })
    }

    countUser(){
        Axios.post('http://localhost:8000/api/countUser', {
            token: sessionStorage.getItem('token'),
            type : 1
        }).then(response => {
            this.setState({
                totalGuest : response.data.guestCount,
                totalOwner : response.data.ownerCount,
                totalAdmin : response.data.adminCount,
            })
        })
    }

    countPost(){
        Axios.post('http://localhost:8000/api/countPost', {
            token: sessionStorage.getItem('token'),
        }).then(response => {
            this.setState({
                totalPost : response.data,
            })
        })
    }

    countPremium(){
        Axios.post('http://localhost:8000/api/countPremiumProduct', {
            token: sessionStorage.getItem('token'),
        }).then(response => {
            this.setState({
                totalPremium : response.data,
            })
        })
    }

    countFacility(){
        Axios.post('http://localhost:8000/api/countFacility', {
            token: sessionStorage.getItem('token'),
        }).then(response => {
            this.setState({
                totalFacility : response.data,
            })
        })
    }
    
    countTransaction(){
        Axios.post('http://localhost:8000/api/countTransaction', {
            token: sessionStorage.getItem('token'),
        }).then(response => {
            this.setState({
                totalTransaction : response.data,
                loading : false
            })
        })
    }
    componentDidMount(){
        this.getUser();
    }

    render(){
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
                    <div style={{display : 'flex'}}>  
                        <Link to='/manageGuestPage'>
                            <BoxStyle>
                                <span>Guest</span>
                                <Number>{this.state.totalGuest}</Number>
                            </BoxStyle>
                        </Link>
                        <Link to='/manageOwnerPage'>
                            <BoxStyle>
                                <span>Owner</span>
                                <Number>{this.state.totalOwner}</Number>
                            </BoxStyle>
                        </Link>
                        <Link>
                            <BoxStyle>
                                <span>Admin</span>
                                <Number>{this.state.totalAdmin}</Number>
                            </BoxStyle>
                        </Link>
                        <Link to='/managePost'>                        
                            <BoxStyle>
                                <span>Post</span>
                                <Number>{this.state.totalPost}</Number>
                            </BoxStyle>
                        </Link>

                    </div>

                    <div style={{display : 'flex'}}> 
                        <Link to='/managePremiumPage'>                        
                            <BoxStyle>
                                <span>Premium Product</span>
                                <Number>{this.state.totalPremium}</Number>
                            </BoxStyle>
                        </Link>
                        <Link to='/manageFacilityPage'>                        
                            <BoxStyle>
                                <span>Facility</span>
                                <Number>{this.state.totalFacility}</Number>
                            </BoxStyle>
                        </Link>
                        <Link to='/manageTransaction'>                        
                            <BoxStyle>
                                <span>Transaction</span>
                                <Number>{this.state.totalTransaction}</Number>
                            </BoxStyle>
                        </Link>

                    </div>
                </Container>
            </div>
        )
    }
}

export default AdminDashboard