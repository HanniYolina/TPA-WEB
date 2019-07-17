import React from 'react'
import {Link, withRouter} from 'react-router-dom';
import logoImg from '../assets/logo.png';
import burgerImg from '../assets/icon.png'
import styled from 'styled-components';
import Axios from 'axios';
import {connect} from 'react-redux'
import SearchForm from '../components/SearchForm';
import {setNotified, connect as connectNotif} from '../Api.js';
import Notification from '../components/Notification.js'

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

        setNotified(this.recieveNotif.bind(this))

        this.state = {
            user : "",
            display : "none",

            loadUser : 0,
            allNotif : []
        }
    }

    recieveNotif(notif){
        let notifComponent
        notifComponent = <Notification content={notif}></Notification>
        

        this.setState({
            allNotif : [...this.state.allNotif, notifComponent]
        })
    }

    deleteToken(){
        Axios.post('http://localhost:8000/api/logout', {
            token: sessionStorage.getItem('token')
        })
        sessionStorage.removeItem('token');
    }

    getUser(){
        if(this.state.loadUser == 0){
        // console.log("a")

            this.setState({
                loading : true,
                loadUser : 1
            })
    
            Axios.post('http://localhost:8000/api/getUser', {
                token: sessionStorage.getItem('token')
            }).then(response => {
                this.setState({
                    user : response.data.user,
                    loading : false,
                    loadUser : 0
                },()=>{
                    console.log("notif"+this.state.user.id)
                    connectNotif("notif"+this.state.user.id);
                    this.getAllNotifs();
                })
            })
        }
        
    }
      
    componentDidMount(){
        if(sessionStorage.getItem('token') != null) this.getUser()
    }
    
    changeDisplay(){
        if(this.state.display == "none"){
            this.setState({
                display : 'block'
            })
        }else{
            this.setState({
                display : 'none'
            }) 
        }
    }

    getAllNotifs(){
        Axios.post('http://localhost:8000/api/getAllNotif', {
                token: sessionStorage.getItem('token'),
                user_id : this.state.user.id
            }).then(response => {
                this.setState({
                    allNotif : [],
                    loading : false
                })

                let notifReceive

                response.data.map(element => {
                    notifReceive = <Notification content={element.content}></Notification>   
                    
                    
                    this.setState({
                        allNotif : [...this.state.allNotif, notifReceive]
                    })
                })
            })
    }

    notifClicked(){
        this.setState({
            showNotification : this.state.showNotification ? false : true
        },()=>{
            if(this.state.showNotification){
                Axios.post('http://localhost:8000/api/readAll', {
                    token: sessionStorage.getItem('token'),
                    user_id : this.state.user.id
                })
            }
            else{
                this.setState({
                    allNotif : []
                })
            }
        })
    }

    render(){
        let button
        if(sessionStorage.getItem('token')){
            // console.log(this.state.user)

            let showNotif
            if(this.state.showNotification){
                showNotif = this.state.allNotif
            }

            if(this.state.user.type == 2){
                button = 
                <span>
                    <Link to='/'><img src={logoImg} id="logo"></img></Link>
                    <div style={{float : 'right'}}>
                        <Link to="/ownerDashboard"><NavItem><span>Dashboard</span></NavItem></Link>                                                                
                        <Link to="/historyPremium"><NavItem><span>History</span></NavItem></Link>                                        
                        <Link to="/generalPostPage"><NavItem><span>Posts</span></NavItem></Link>                                        
                        <Link to="/premiumProduct"><NavItem><span>Premium Product</span></NavItem></Link>                    
                        <Link to="/manageRentHouse"><NavItem><span>Manage Rent House</span></NavItem></Link>
                        <Link to="/manageApartment"><NavItem><span>Manage Apartment</span></NavItem></Link>
                        <Link to="/chat"><NavItem><span>Chat</span></NavItem></Link>
                        <Link to='/profile'><NavItem><span>Profile</span></NavItem></Link>
                        <Link to='/'><NavItem onClick={this.deleteToken}><span>Log Out</span></NavItem></Link>
                        <i className="fa fa-bell" onClick={this.notifClicked.bind(this)} style={{color :  this.state.allNotif.length != 0 ? '#ffaa3b' : 'black'}}></i>
                        {showNotif}
                    </div>
                </span>
                if(window.innerWidth < 1150) {
                    button =
                    <div style={{display : 'flex'}}>
                        <Link to='/'><img src={logoImg} id="logo"></img></Link>
                        <i className="fa fa-bell" onClick={this.notifClicked.bind(this)} style={{color :  this.state.allNotif.length != 0 ? '#ffaa3b' : 'black'}}></i>
                        {showNotif}
                        <SearchForm></SearchForm>
                        <div style={{float : 'right'}} onClick={this.changeDisplay.bind(this)}><img src={burgerImg} id="logo"></img></div>
                        <div style={{display : `${this.state.display}`, backgroundColor : '#3cba92', padding : '5%'}}>
                            <p><Link to="/ownerDashboard">Dashboard</Link></p>
                            <p><Link to="/historyPremium">History</Link></p>
                            <p><Link to="/generalPostPage">Posts</Link></p>
                            <p><Link to="/premiumProduct">Premium Product</Link></p>
                            <p><Link to="/manageRentHouse">Manage Rent House</Link></p>
                            <p><Link to="/manageApartment">Manage Apartment</Link></p>
                            <p><Link to='/chat'>Chat</Link></p>
                            <p><Link to='/profile'>Profile</Link></p>
                            <p><Link to='/login'><button onClick={this.deleteToken}>Log Out</button></Link></p>
                        </div>
                    </div>
                }
            }
            else if(this.state.user.type == 1){
                button = 
                <span style={{display : 'flex'}}>
                    <Link to='/'><img src={logoImg} id="logo"></img></Link>
                    <div>
                        <Link to="/historyPage"><NavItem><span>History</span></NavItem></Link>                        
                        <Link to="/generalPostPage"><NavItem><span>Posts</span></NavItem></Link>
                        <Link to="/chat"><NavItem><span>Chat</span></NavItem></Link>
                        <Link to="/followingPage"><NavItem><span>Following Page</span></NavItem></Link>
                        <Link to='/profile'><NavItem><span>Profile</span></NavItem></Link>
                        <Link to='/'><NavItem onClick={this.deleteToken}><span>Log Out</span></NavItem></Link>
                        <i className="fa fa-bell" onClick={this.notifClicked.bind(this)} style={{color :  this.state.allNotif.length != 0 ? '#ffaa3b' : 'black'}}></i>
                        {showNotif}
                    </div>
                </span>
                if(window.innerWidth < 650) {
                    button =
                    <div style={{display : 'flex'}}>
                        <Link to='/'><img src={logoImg} id="logo"></img></Link>
                        <i className="fa fa-bell" onClick={this.notifClicked.bind(this)} style={{color :  this.state.allNotif.length != 0 ? '#ffaa3b' : 'black'}}></i>
                        {showNotif}
                        <SearchForm></SearchForm>                        
                        <div style={{float : 'right'}} onClick={this.changeDisplay.bind(this)}><img src={burgerImg} id="logo"></img></div>
                        <div style={{display : `${this.state.display}`, backgroundColor : '#3cba92', padding : '5%'}}>
                            <p><Link to="/historyPage">History</Link></p>
                            <p><Link to="/generalPostPage">Posts</Link></p>
                            <p><Link to="/chat">Chat</Link></p>
                            <p><Link to="/followingPage">Following Page</Link></p>
                            <p><Link to='/profile'>Profile</Link></p>
                            <p><Link to='/login'><button onClick={this.deleteToken}>Log Out</button></Link></p>
                            
                        </div>
                    </div>
                }
            }
            else if(this.state.user.type == 3){
                button = 
                <span>
                    <Link to='/'><img src={logoImg} id="logo"></img></Link>
                    <div style={{float : 'right'}}>
                        <Link to="/adminDashboard"><NavItem><span>Dashboard</span></NavItem></Link>                                                                
                        <Link to="/manageReport"><NavItem><span>Report</span></NavItem></Link>                                        
                        <Link to="/managePost"><NavItem><span>Post</span></NavItem></Link>                                        
                        <Link to="/manageTransaction"><NavItem><span>Transaction</span></NavItem></Link>                    
                        <Link to="/managePremiumPage"><NavItem><span>Premium</span></NavItem></Link>
                        <Link to="/manageGuestPage"><NavItem><span>Guest</span></NavItem></Link>
                        <Link to="/manageOwnerPage"><NavItem><span>Owner</span></NavItem></Link>
                        <Link to="/manageFacilityPage"><NavItem><span>Facility</span></NavItem></Link>
                        <Link to='/'><NavItem onClick={this.deleteToken}><span>Log Out</span></NavItem></Link>
                    </div>
                </span>
                if(window.innerWidth < 1300) {
                    button =
                    <div style={{display : 'flex'}}>
                        <Link to='/'><img src={logoImg} id="logo"></img></Link>
                        <SearchForm></SearchForm>
                        <div style={{float : 'right'}} onClick={this.changeDisplay.bind(this)}><img src={burgerImg} id="logo"></img></div>
                        <div style={{display : `${this.state.display}`, backgroundColor : '#3cba92', padding : '5%'}}>
                            <p><Link to="/adminDashboard">Dashboard</Link></p>                            
                            <p><Link to="/manageReport">Report</Link></p>                            
                            <p><Link to="/managePost">Post</Link></p>
                            <p><Link to="/manageTransaction">Transaction</Link></p>
                            <p><Link to="/managePremiumPage">Premium</Link></p>
                            <p><Link to="/manageGuestPage">Guest</Link></p>
                            <p><Link to="/manageOwnerPage">Owner</Link></p>
                            <p><Link to="/manageFacilityPage">Facility</Link></p>
                            <p><Link to='/login'><button onClick={this.deleteToken}>Log Out</button></Link></p>
                            
                        </div>
                    </div>
                }
            }
            // else if(this.props)


            return(
                <div style={navStyle}>
                    {button}
                </div>
            )
        }
        else{
            return(
                <div style={navStyle} >
                    <Link to='/'><img src={logoImg} id="logo"></img></Link> 
                   
                    <div id='navbar' style={{display : 'flex'}}>
                        <SearchForm></SearchForm>
                        <Link to="/generalPostPage"><NavItem><span>Posts</span></NavItem></Link>
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

