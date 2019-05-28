import React from 'react'
import NavBar from '../containers/NavBar';
import styled from 'styled-components'
import Axios from 'axios'
import {Redirect} from 'react-router-dom'
import GuestDetail from '../containers/GuestDetail'
import Loading from '../components/Loading'
import BreadCrumbs from '../components/BreadCrumbs';

const Container = styled('div')`
    width : 100vw;
    height : 50vh;
    margin 0 auto;
`

class ManageGuestPage extends React.Component{
    constructor(){
        super();

        this.state = {
            user : []
        }
    }

    getGuest(){
        this.setState({
            loading : true
        })
        Axios.post('http://localhost:8000/api/getOwnerOrGuest', {
            token: sessionStorage.getItem('token'),
            type : "1"
        }).then(response => {
            this.setState({
                loading : false,
                user : response.data
            }, ()=>console.log(this.state.user))
        })      
    }

    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type != 3){
            if(this.state.type == 2){
                return <Redirect to="/manageRentHouse"/>
            }
            else if(this.state.type == 1){
                return <Redirect to="/"/>
            }
        }
    }

    componentDidMount(){
        this.getGuest();
    }
    render(){
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        return(
            <div>
                {loading}
                {this.checkUser()}
                <Container>
                    <NavBar></NavBar>
                    <BreadCrumbs></BreadCrumbs>
                    {
                        this.state.user && this.state.user.map((user, key)=> (
                           <GuestDetail user={user} key={key}></GuestDetail>
                        ))
                    }
                </Container>
            </div>
        )
    }
}

export default ManageGuestPage