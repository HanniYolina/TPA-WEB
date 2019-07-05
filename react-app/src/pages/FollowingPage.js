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
    height : auto;
    margin 0 auto;
`

class FollowingPage extends React.Component{
    constructor(){
        super();

        this.state = {
            user : [],
            id : 0,

            loadCount : 0,
            url : 'http://localhost:8000/api/getAllFollowing?page=1',
            follow : []
        }
    }
    getFollowing(){
        if(this.state.loadCount == 0){
            this.setState({
                loading : true,
                loadCount : 1
            })

            
            Axios.post(this.state.url, {
                token: sessionStorage.getItem('token'),
                id : this.state.id
            }).then(response => {
                let responseData = response.data.data
                let tempFollow = this.state.follow

                responseData.forEach(element => {
                    tempFollow.push(element)
                });
                
                this.setState({
                    follow : tempFollow,
                    loading : false,
                    loadCount : 0
                },()=>this.getOwner())
            })
        }
    }

    getOwner(){
        this.setState({
            loading : true
        })

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
                return <Redirect to="/ownerDashboard"/>
            }
            else if(this.state.type == 3){
                return <Redirect to="/adminDashboard"/>
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
        window.addEventListener('scroll', this.registerScrollEvent.bind(this))
        this.getUser();
    }

    registerScrollEvent(){
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight){
            if(this.state.loadCount == 0){
                this.changePoint(this.state.lat, this.state.lng);
            }
        }
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.registerScrollEvent.bind(this))
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