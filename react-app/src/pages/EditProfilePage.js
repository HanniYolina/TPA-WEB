import React from 'react'
import NavBar from '../containers/NavBar';
import styled from 'styled-components';
import Axios from 'axios';
import Loading from '../components/Loading';
import ProfilePicture from '../components/ProfilePicture';
import {Link} from 'react-router-dom'
import ChangePassword from '../containers/ChangePassword';
import BreadCrumbs from '../components/BreadCrumbs';

const Container = styled('div')`
    height : 100vh;
    width : 100vw;
    justify-content : center;
    display : flex;
`
const ProfileContainer = styled('div')`
    background-color : white;
    width : 70vw;
    height : 70vh;
    margin-top : 7vw;
    border : 4px solid #3cba92;
    border-radius: 10px;
    justify-content : center;

`

const LabelContainer = styled('div')`
    width : 45%;
    height : 95%;
`

const Input = styled('div')`
    display : flex;
`
const TopContainer = styled('div')`
    width : 100%;
    height : 50%;
    background-color : 100%;
    display: flex;
    justify-content : center;
`

const Row = styled('div')`
    margin : 5%;
`
const Margin = styled('div')`
    margin-top : 5%;
`

class EditProfilePage extends React.Component{
    constructor(){
        super()

        this.state = {
            status : "",
            username : "",
            city : "",
            picture_name : null,
            path : "",

            statusUsername : false,
            statusCity : false,
            message : "",
            loading : '',
            delete : false
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
                username : response.data.user.username,
                city : response.data.user.city,
                picture_name : response.data.user.picture_name,
                path: response.data.path,
                loading : false
            }, () => {
                if(response.data.user.username) this.setState({statusUsername : true});
                if(response.data.user.city) this.setState({statusCity : true});
            })
        })

    }

    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }

    componentDidMount(){
        this.getUser();
    }

    updatePP(ev){
        ev.preventDefault();
        let formData = new FormData();
        formData.append('image', document.getElementById('image').files[0])

        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/uploadProfilePicture', formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            this.setState({
                message : response.data.message,
                loading : false
            })
        })
    }

    updateUsername(ev){
        ev.preventDefault();
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/updateUsername', {
            username : this.state.username
        },
        {
            headers: {
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            this.setState({
                message : response.data.message,
                loading : false
            })
        })

    }

    updateProfile(ev){
        ev.preventDefault();

        const city = this.state.city;
        

        const data = {
            city
        }

        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/uploadProfile', data,
        {
            headers: {
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            this.setState({
                message : response.data.message,
                loading : false
            })
        })
    }

    changeDelete(){
        if(this.state.delete == false){
            this.setState({
                delete : true
            })
        }
        else{
            this.setState({
                delete : false
            })
        }
    }
    render(){
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        let errorMessage;
        if(this.state.status){
            errorMessage = <p>{this.state.message}</p>
        }

        let inputUsername;
        if(this.state.statusUsername && this.state.username){
            inputUsername = <p>{this.state.username}</p>
        }
        else{
            inputUsername = 
                 <form onSubmit={this.updateUsername.bind(this)}>
                    <Input>
                        <input type='text' name='username' onChange={this.dataChange.bind(this)}></input>
                        <input type='submit' style={{border : '0px', backgroundColor : '#3cba92'}} placeholder='Submit Username'></input>
                    </Input>
                </form>            
        }

        let deleteButton;
        if(this.state.delete){
            deleteButton = <ChangePassword changeDelete={this.changeDelete.bind(this)}></ChangePassword>
        }

        return(
            <div>
                {deleteButton}
                {loading}
                <NavBar></NavBar>
                <BreadCrumbs></BreadCrumbs>
                <Container>
                    <ProfileContainer>
                        <TopContainer>
                            <ProfilePicture path={this.state.path}></ProfilePicture>
                        </TopContainer>
                        <TopContainer>
                        <LabelContainer>
                            <Row><p>Profile Picture</p></Row>
                            <Row><p>Username</p></Row>
                            <Row><p>City</p></Row>

                        </LabelContainer>
                        <LabelContainer>
                            <form onSubmit={this.updatePP.bind(this)}>
                                <Row>
                                    <Input>
                                        <input type='file' style={{border : '0px'}} id='image' name='image' onChange={this.dataChange.bind(this)}></input>
                                        <input type='submit' style={{border : '0px', backgroundColor : '#3cba92'}} placeholder='Submit Photo'></input>
                                    </Input>
                                </Row>
                            </form>

                            
                            <Row>
                                {inputUsername}
                            </Row>
                            <form>
                                <Row>
                                    <Input><input type='text' name='city' onChange={this.dataChange.bind(this)}></input></Input>
                                </Row>

                                
                                {errorMessage}
                                <button onClick={this.updateProfile.bind(this)}>Submit Changes</button>
                            </form>
                        </LabelContainer>
                        </TopContainer>
                        <Margin><button onClick={this.changeDelete.bind(this)}>Change Password</button></Margin>
                    </ProfileContainer>
                </Container>
            </div>
        )
    }
}

export default EditProfilePage