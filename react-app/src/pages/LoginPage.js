import React from 'react'
import {Link, Redirect} from 'react-router-dom'
import GuestLogin from '../components/GuestLogin'
import OwnerLogin from '../components/OwnerLogin'
import BackToMainMenu from '../components/BackToMainMenu'
import Axios from 'axios'

const log = {
    float : 'right',
    paddingRight : '35px'
}

class LoginPage extends React.Component{
    state = {
        type : 'guest'
    };

    toggleLogin(){
        if(this.state.type == 'guest'){
            this.state.type = 'owner'
        }
        else{
            this.state.type = 'guest'
        }
    }

    checkUser(){
        if(this.state.userStatus == 2){
            //banned 
            return <Redirect to="/banned"/>
        }
        else{
            if(this.state.type == 1){
                return <Redirect to="/"/>
            }
            else if(this.state.type == 2){
                return <Redirect to="/ownerDashboard"/>
            }
            else if(this.state.type == 3){
                return <Redirect to="/adminDashboard"/>
            }
        }
    }

    getUser(){
        if(sessionStorage.getItem('token')!=null){
            this.setState({
                loading : true
            })

            Axios.post('http://localhost:8000/api/getUser', {
                token: sessionStorage.getItem('token')
            }).then(response => {
                this.setState({
                    type : response.data.user.type,
                    userStatus : response.data.user.status
                });
            })
        }

    }

    componentWillMount(){
        this.getUser();
    }
    render(){
        if(this.state.type=='owner'){
           return(
               <div>
                    {this.checkUser()}
                    <BackToMainMenu></BackToMainMenu>
                    <OwnerLogin></OwnerLogin>
                    <span style={log}>I want to <Link onClick={this.toggleLogin()} to="/login">Login as Guest</Link></span>
               </div>
           ) 
        }
        return(
            <div>
                {this.checkUser()}
                <BackToMainMenu></BackToMainMenu>
                <GuestLogin></GuestLogin>
                <span style={log}>I want to <Link onClick={this.toggleLogin()} to="/login">Login as Owner</Link></span>
            </div>
        )
    }
}

export default LoginPage

