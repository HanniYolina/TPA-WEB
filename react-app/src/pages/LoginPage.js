import React from 'react'
import {Link} from 'react-router-dom'
import GuestLogin from '../components/GuestLogin'
import OwnerLogin from '../components/OwnerLogin'
import BackToMainMenu from '../components/BackToMainMenu'

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

    render(){
        if(this.state.type=='owner'){
           return(
               <div>
                    <BackToMainMenu></BackToMainMenu>
                    <OwnerLogin></OwnerLogin>
                    <span style={log}>I want to <Link onClick={this.toggleLogin()} to="/login">Login as Guest</Link></span>
               </div>
           ) 
        }
        return(
            <div>
                <BackToMainMenu></BackToMainMenu>
                <GuestLogin></GuestLogin>
                <span style={log}>I want to <Link onClick={this.toggleLogin()} to="/login">Login as Owner</Link></span>
            </div>
        )
    }
}

export default LoginPage

