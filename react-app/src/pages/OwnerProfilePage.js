import React from 'react'
import NavBar from '../containers/NavBar';
import styled from 'styled-components';
import Loading from '../components/Loading';
import Axios from 'axios'
import ProfilePicture from '../components/ProfilePicture';
import {Redirect} from 'react-router-dom'
import BreadCrumbs from '../components/BreadCrumbs';
import RoomDetail from '../containers/RoomDetail'

const Container = styled('div')`
    width : 100vw;
    height : 100vh;
    justify-content : center;
    display : flex;
`
const ProfileContainer = styled('div')`
    background-color : white;
    width : 80vw;
    height : 30vh;
    border : 4px solid #3cba92;
    border-radius: 10px;
    justify-content : center;
    margin-top : 10vh;
`
const TopContainer = styled('div')`
    width : 100%;
    height : 95%;
    display : flex;
    background-color : black;
    margin-top : 8px;
`

const TopLeftContainer = styled('div')`
    width : 50%;
    height : 100%;
    background-color : white;
    justify-content : center;
    display : flex;
`
const MiddleContainer = styled('div')`
    width : 48%;
    height : 100%;
`

const Data = styled('div')`
    display: block;
    margin-top : 7%;
`


class OwnerProfilePage extends React.Component{
    constructor(){
        super();
        this.state = {
            loading : "",
            status : "",

            name : "",
            email : "",
            joinSince : "",
            picture_name : "",
            path : "",

            follower_id : null,
            user_id : null,
            followed : false,
            allAparment : null
        }
    }
    getOwner(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getOwner', {
           id : this.props.match.params.id
        }).then(response => {
            this.setState({
                status : response.status,
                user_id : response.data.user.id,
                name : response.data.user.name,
                email : response.data.user.email,
                picture_name : response.data.user.picture_name,
                joinSince : response.data.user.created_at,
                path : response.data.path,
                loading : false
            }, ()=> this.getUserFollow())
        })
    }

    getUser(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getUser', {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                follower_id : response.data.user.id,
                type : response.data.user.type,
                loading : false
            }, ()=> this.getOwner())
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

    componentDidMount(){
        if(sessionStorage.getItem('token')){
            this.getUser();
        }
    }

    follow(){
        if(this.state.followed == false){
            this.setState({
                loading : true
            })

            Axios.post('http://localhost:8000/api/follow', {
                token: sessionStorage.getItem('token'),
                user_id : this.state.user_id,
                follower_id : this.state.follower_id
            }).then(response => {
                this.setState({
                    loading : false
                })
            })
        }
        else{
            this.setState({
                loading : true
            })

            Axios.post('http://localhost:8000/api/unfollow', {
                token: sessionStorage.getItem('token'),
                id : this.state.userFollowerId
            }).then(response => {
                this.setState({
                    loading : false,
                    followed : false
                })
            })
        }
    }

    getUserFollow(){
        // console.log(this.state.user_id);
        // console.log(this.state.follower_id);
        if(this.state.user_id && this.state.follower_id){
            this.setState({
                loading : true
            })

            Axios.post('http://localhost:8000/api/getUserFollow', {
                token: sessionStorage.getItem('token'),
                user_id : this.state.user_id,
                follower_id : this.state.follower_id
            }).then(response => {
                // console.log(response.data.message)
                if(response.data.message == "success"){
                    this.setState({
                        followed : true,
                        userFollowerId : response.data.userFollower.id
                    })
                }
                this.setState({
                    loading : false
                })
            })
        }
    }

    getAllRentHouse(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getAllRoom', {
           owner_id : this.props.match.params.id,
           token : sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                allRoom : response.data.data,
                loading : false
            })
        })
    }

    getAllApartment(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getAllApartment', {
           owner_id : this.props.match.params.id,
           token : sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                allAparment : response.data.data,
                loading : false
            },()=>console.log(this.state.allAparment))
        })
    }

    componentWillMount(){
        this.getAllApartment();
        this.getAllRentHouse();
    }

    render(){
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        
        let buttonFollow
        if(this.state.followed == false){
            buttonFollow = <button onClick={this.follow.bind(this)}>Follow</button>
        }
        else{
            buttonFollow = <button onClick={this.follow.bind(this)}>Unfollow</button>
        }

        return(
            <div>
                {this.checkUser()}
                {loading}
                <NavBar></NavBar>
                <BreadCrumbs></BreadCrumbs>
                <Container>
                    <ProfileContainer>
                        <TopContainer>
                            <TopLeftContainer>
                                <ProfilePicture path={this.state.path}></ProfilePicture>
                            </TopLeftContainer>
                            <TopLeftContainer>
                                <MiddleContainer>
                                    <Data>
                                        <p>{this.state.name}</p>
                                        <p>{this.state.email}</p>
                                        <p>{this.state.joinSince}</p>
                                        <p>online status</p>
                                        <p>total follower</p>
                                    </Data>
                                </MiddleContainer>
                                <MiddleContainer>
                                        <p>Verified badge</p>
                                        <p>total follower</p>
                                        <p>Total rent House</p>
                                        {buttonFollow}                
                                </MiddleContainer>
                            </TopLeftContainer>
                        </TopContainer>

                        <br></br>
                        <label>Kosan</label>
                        {
                            this.state.allRoom && this.state.allRoom.map((room, key)=> (
                                <RoomDetail room={room} key={key} type="view"></RoomDetail>
                            ))
                        }

                        <label>Apartment</label>
                        {
                            this.state.allAparment && this.state.allAparment.map((room, key)=> (
                                <RoomDetail room={room} key={key} type="view"></RoomDetail>
                            ))
                        }
                    </ProfileContainer>
                </Container>
            </div>
        )
    }
}

export default OwnerProfilePage