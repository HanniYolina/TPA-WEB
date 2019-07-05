import React from 'react'
import PopUp from '../components/PopUp'
import Axios from 'axios'

const UserStyle = {
    height: '190px',
    width: '20%',
    margin: '20px',
    padding: '15px',
    border: '2px grey solid',
    boxShadow : '6px 8px lightgrey'
}


class UserDetail extends React.Component{
    constructor(){
        super();

        this.state = {
            pop : false
        }
    }
    buttonPopup(value){
        this.setState({
            popup : value,
            pop : false
        })
    }

    changePop(ev){
        console.log(ev.target.value)
        this.setState({
            pop : true,
            guestId : this.props.user.id,
            popType : ev.target.value
        })
    }

    banGuest(){
        Axios.post(`http://localhost:8000/api/banUser`,{
            token: sessionStorage.getItem('token'),
            id : this.state.guestId
        })
    }

    resetPassword(){
        Axios.post(`http://localhost:8000/api/resetPassword`,{
            token: sessionStorage.getItem('token'),
            id : this.state.guestId
        })
    }
    
    render(){
        let user = this.props.user

        let button; 
        if(user.status == 1){
            //not banned
            button = <div> 
                <button onClick={this.changePop.bind(this)} value ="Ban">Ban User</button> 
                <br/>
                <br/>
                <button onClick={this.changePop.bind(this)} value="Reset">Reset Password</button>
            </div>
        }

        let popup;
        if(this.state.pop){
            if(this.state.popType == 'Ban'){
                popup = <PopUp text="Are you sure to ban the guest?" type="Ban" buttonPopup={this.buttonPopup.bind(this)}></PopUp>
            }
            else{
                popup = <PopUp text="Are you sure to reset password the guest?" type="Reset" buttonPopup={this.buttonPopup.bind(this)}></PopUp>
            }
            
        }
        else{
            if(this.state.popup == "Ban"){
                this.banGuest()
            }
            else if(this.state.popup == "Reset"){
                this.resetPassword()
            }
        }

        return(
        <div style={UserStyle}>
            {popup}
            <span>{user.name}</span>
            <br></br>
            <span>{user.email}</span>
            <br></br>
            <span>{user.created_at}</span>
            <br></br>
            {button}
        </div>
    )}
}

export default UserDetail