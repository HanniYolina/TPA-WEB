import React from 'react'
import {Link, withRouter} from 'react-router-dom';
import logoImg from '../assets/logo.png';
import styled from 'styled-components';
import Axios from 'axios';
import {connect} from 'react-redux'

const navStyle = {
    backgroundColor: '#3cba92',
    padding:'20px',
    position: 'sticky',
    top: '0',
    zIndex : 999
}

const NavItem = styled.span`
  margin : 10px;
  padding : 10px;
  margin-top: 50px;
  color: white;
  display: inline;
`


class NavBar extends React.Component{
    constructor(){
        super();

        this.state = {
            user : ""
        }
    }
    deleteToken(){
        Axios.post('http://localhost:8000/api/logout', {
            token: sessionStorage.getItem('token')
        }).then(response => {
        //    console.log(response.status)
        })
        sessionStorage.removeItem('token');
    }

    getUser(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getUser', {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                user : response.data.user,
                loading : false
            })
        })
    }

    componentDidMount(){
        this.getUser()
    }
    
    render(){
        let button
        if(sessionStorage.getItem('token')){
            // console.log(this.state.user)
            if(this.state.user.type == 2){
                button = 
                <span>
                    <Link to="/manageRentHouse"><NavItem><span>Manage Rent House</span></NavItem></Link>
                    <Link to="/manageApartment"><NavItem><span>Manage Apartment</span></NavItem></Link>
                </span>
            }
            else if(this.state.user.type == 1){
                button = 
                <span>
                    <Link to="/followingPage"><NavItem><span>Following Page</span></NavItem></Link>
                </span>
            }
            else if(this.state.user.type == 3){
                button = 
                <span>
                    <Link to="/manageGuestPage"><NavItem><span>Manage Guest</span></NavItem></Link>
                </span>
            }
            // else if(this.props)

            return(
                <div style={navStyle}>
                    <Link to='/'><img src={logoImg} id="logo"></img></Link>

                    <div id='navbar'>
                        {button}
                        <Link to="/chat"><NavItem><span>Chat</span></NavItem></Link> 
                        <Link to='/profile'><NavItem><span>Profile</span></NavItem></Link>
                        <Link to='/'><NavItem onClick={this.deleteToken}><span>Log Out</span></NavItem></Link>   
                    </div>
                </div>
            )
        }
        else{
            return(
                <div style={navStyle}>
                    <Link to='/'><img src={logoImg} id="logo"></img></Link>
        
                    <div id='navbar'>
                        <Link to='/#download-app'><NavItem><span>Download App</span></NavItem></Link>
                        <Link to='/'><NavItem><span>Promosikan Iklan Anda</span></NavItem></Link>
                        <Link to='/login'><NavItem><span>Login</span></NavItem></Link>
                        <Link to='/register/guest'><NavItem><span>Register</span></NavItem></Link>
                    </div>
                </div>
            )
        }
    }
}

const state = state=>{
    return {
        user : state.user
    }
}
export default withRouter(connect(state)(NavBar))

