import React from 'react'
import PopUp from '../components/PopUp'
import Axios from 'axios'

const UserStyle = {
    height: '120px',
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

    changePop(){
        this.setState({
            pop : true,
            guestId : this.props.user.id
        })
    }

    banGuest(){
        Axios.post(`http://localhost:8000/api/banUser`,{
            token: sessionStorage.getItem('token'),
            id : this.state.guestId
        })
    }
    
    render(){
        let user = this.props.user

        let button; 
        if(user.status == 1){
            //not banned
            button = <button onClick={this.changePop.bind(this)}>Ban User</button>
        }

        let popup;
        if(this.state.pop){
            popup = <PopUp text="Are you sure to ban the guest?" type="Ban" buttonPopup={this.buttonPopup.bind(this)}></PopUp>
        }
        else{
            if(this.state.popup == "Ban"){
                this.banGuest()
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