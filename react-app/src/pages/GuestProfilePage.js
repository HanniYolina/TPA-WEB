import React from 'react'
import styled from 'styled-components'
import BreadCrumbs from '../components/BreadCrumbs'
import NavBar from '../containers/NavBar'
import ProfilePicture from '../components/ProfilePicture'
import Axios from 'axios'
import {Redirect} from 'react-router-dom'
import Loading from '../components/Loading'
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

class GuestProfilePage extends React.Component{
    constructor(){
        super();

        this.state = {
            loading : false,
            pageNum : 1,
            favoriteProperties : [],
            showFavorite : false
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
                status : response.status,
                id : response.data.user.id,
                name : response.data.user.name,
                joinSince : response.data.user.created_at,
                emailVerifed : response.data.user.email_verified_at,
                type : response.data.user.type,
                phoneVerifed : response.data.user.phone_verified_at,
                city : response.data.user.city,
                picture_name : response.data.user.picture_name,
                path : response.data.path,
                loading : false
            }, ()=> {
                if(this.state.type == 1){
                    this.countFollowing()       
                }
            })
        })
    }

    checkGuest(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        else if(this.state.type == 2){
            return <Redirect to="/ownerDashboard" />
        }
        else if(this.state.type == 3){
            return <Redirect to="/adminDashboard"/>
        }
        else{
            if(this.props.location.state.user == this.state.id){
                return <Redirect to="/profile" />
            }
        }
    }

    countFollowing(){
        this.setState({
            loading : true
        })

        Axios.post(`http://localhost:8000/api/countFollowing`, {
            token: sessionStorage.getItem('token'),
            id : this.props.location.state.user.id
        }).then(response => {
            this.setState({
                totalFollowing : response.data,
                loading : false
            }, ()=>this.getUserFavorite(this.props.location.state.user.id))
        })
    }

    getUserFavorite(id){
        this.setState({
            loading : true
        })

        Axios.post(`http://localhost:8000/api/getAllFavoriteByUser?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token'),
            user_id : id
        }).then(response => {
            this.setState({
                allFavorite : response.data.data,
                last_page : response.data.last_page,
                loading : false
            }, ()=>this.getFavoriteProperties())
        })
    }

    getFavoriteProperties(){
        this.setState({
            loading : true
        })

        let allFavorite = this.state.allFavorite
        
        for(let i=0; i<allFavorite.length; i++){
            Axios.post('http://localhost:8000/api/getRoomById', {
                token: sessionStorage.getItem('token'),
                id : allFavorite[i].properties_id
            }).then(response => {
                this.setState({
                    favoriteProperties : [...this.state.favoriteProperties, response.data]
                })
                console.log(this.state.favoriteProperties)
            })
        }
       
        this.setState({
            loading : false
        })
    }

    changePageNum(){
        let curr = this.state.pageNum
        this.setState({
            favoriteProperties : []
        })
        if(this.state.pageNum == this.state.last_page){
            this.setState({
                pageNum : 1
            }, ()=> this.countFollowing())
        }
        else{
            this.setState({
                pageNum : curr + 1
            }, ()=> this.countFollowing())
        }
    }

    toggleShowFavorite(){
        if(this.state.showFavorite){
            this.setState({
                showFavorite : false
            })
        }
        else{
            this.setState({
                showFavorite : true
            })
        }
    }
    
    componentDidMount(){
        this.getUser();
    }

    render(){
        let user = this.props.location.state.user

        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }

        let favorites;
        if(this.state.showFavorite){
            favorites = <div>
                {
                    this.state.favoriteProperties && this.state.favoriteProperties.map((properties, key)=> (
                        <RoomDetail room={properties.room} type="view" key={key}></RoomDetail>
                    ))
                }
                <button onClick={this.changePageNum.bind(this)}>Next</button>
            </div>
        }
        return(
            <div>
                {this.checkGuest()}
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
                                        <p>{user.name}</p>
                                        <p>{user.email}</p>
                                        <p>{user.joinSince}</p>
                                        <p>following {this.state.totalFollowing} owner</p>
                                    </Data>
                                </MiddleContainer>
                            </TopLeftContainer>
                        </TopContainer>

                        <div style={{marginTop : '4%'}} onClick={this.toggleShowFavorite.bind(this)}>Favorite Item</div>

                        {favorites}
                    </ProfileContainer>
                </Container>
            </div>
        )
    }
}

export default GuestProfilePage