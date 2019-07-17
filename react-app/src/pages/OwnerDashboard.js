import React from 'react'
import {Link, Redirect} from 'react-router-dom'
import Axios from 'axios'
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import styled from 'styled-components'
import Loading from '../components/Loading';

const Container = styled('div')`
    width : 100vw;
    height : 50vh;
    margin 0 auto;
`

const BoxStyle = styled('div')`
    height: 20vw;
    width: 20vw;
    margin: 2vw;
    padding: 2%;
    border: 2px #3cba92 solid;
`

const Number = styled('div')`
    border-radius: 50%;
    width: 15vw;
    height: 15vw;
    border: 2px solid #3cba92;
    text-align: center;
    font: 13vw Arial, sans-serif;
    margin : 0 auto;
`

class OwnerDashboard extends React.Component{
    constructor(){
        super();

        this.state = {
            loading : false
        }
    }
    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type != 2){
            if(this.state.type == 1){
                return <Redirect to="/"/>
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
                status : response.status,
                user_id : response.data.user.id,
                type : response.data.user.type,
            }, ()=>{
                this.countProperties();
                this.countFollower();
            })
        })
    }

    countProperties(){
        Axios.post('http://localhost:8000/api/countProperties', {
            token: sessionStorage.getItem('token'),
            owner_id : this.state.user_id
        }).then(response => {
            this.setState({
                totalKost : response.data.countKost,
                totalApartment : response.data.countApartment,
                loading : false
            })
        })
    }

    countFollower(){
        Axios.post('http://localhost:8000/api/countFollower', {
            token: sessionStorage.getItem('token'),
            id : this.state.user_id
        }).then(response => {
            this.setState({
                followerCount : response.data,
                loading : false
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
                    <div style={{display : 'flex'}}> 
                        <Link to='/manageRentHouse'>                        
                            <BoxStyle>
                                <span>Kost</span>
                                <Number>{this.state.totalKost}</Number>
                            </BoxStyle>
                        </Link>
                        <Link to='/manageApartment'>                        
                            <BoxStyle>
                                <span>Apartment</span>
                                <Number>{this.state.totalApartment}</Number>
                            </BoxStyle>
                        </Link>
                        <Link to='/'>                        
                            <BoxStyle>
                                <span>Follower</span>
                                <Number>{this.state.followerCount}</Number>
                            </BoxStyle>
                        </Link>
                    </div>
                </Container>
            </div>
        )
    }
}

export default OwnerDashboard