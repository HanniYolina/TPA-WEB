import React from 'react'
import styled from 'styled-components'
import NavBar from '../containers/NavBar'
import Axios from 'axios'
import UserDetail from '../containers/UserDetail';
import Loading from '../components/Loading';
import {Redirect} from 'react-router-dom'
import BreadCrumbs from '../components/BreadCrumbs';

const Container = styled('div')`
    width : 100vw;
    height : 50vh;
    margin 0 auto;
`

class FollowingPage extends React.Component{
    constructor(){
        super();

        this.state = {
            user : [],
            id : 0
        }
    }
    getFollowing(){
        this.setState({
            loading : true
        })
        Axios.post('http://localhost:8000/api/getAllFollowing', {
            token: sessionStorage.getItem('token'),
            id : this.state.id
        }).then(response => {
            this.setState({
                follow : response.data,
                loading : false
            },()=>this.getOwner())
        })
    }

    getOwner(){
        this.setState({
            loading : true
        })

        console.log(this.state.follow)

        this.state.follow && this.state.follow.map((follow, key)=> (
            //get owner = get user by id
            Axios.post('http://localhost:8000/api/getOwner', {
                token: sessionStorage.getItem('token'),
                id : follow.user_id
            }).then(response => {
                let user = this.state.user
                user.push(response.data)

                this.setState({
                    user : user
                })
            })      
        ))
        
        this.setState({
            loading : false,
        })
    }

    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type != 1){
            if(this.state.type == 2){
                return <Redirect to="/manageRentHouse"/>
            }
            else if(this.state.type == 3){
                return <Redirect to="/manageFacilityPage"/>
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
                id : response.data.user.id,
                type : response.data.user.type,
                loading : false
            }, ()=>{
                this.getFollowing()
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
                    {
                        this.state.user && this.state.user.map((user, key)=> (
                           <UserDetail user={user} key={key}></UserDetail>
                        ))
                    }
                </Container>
            </div>
        )
    }
}

export default FollowingPage;