import React from 'react'
import PopUp from '../components/PopUp';
import Axios from 'axios'

class BannedPage extends React.Component{
    deleteToken(){
        Axios.post('http://localhost:8000/api/logout', {
            token: sessionStorage.getItem('token')
        })
        sessionStorage.removeItem('token');
    }
    render(){
        this.deleteToken();
        return(
            <PopUp text="Your Account has been banned by admin" type="Banned"></PopUp>
        )
    }
}

export default BannedPage