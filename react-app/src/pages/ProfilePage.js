import React from 'react'
import NavBar from '../containers/NavBar';
import styled from 'styled-components'
import emailLogo from '../assets/emailLogo.png'
import phoneLogo from '../assets/phoneLogo.png'
import {Link, Redirect} from 'react-router-dom';
import Axios from 'axios';
import Loading from '../components/Loading'
import ProfilePicture from '../components/ProfilePicture';
import BreadCrumbs from '../components/BreadCrumbs';

const verifFrame = {
    display : 'flex',
    width : '100vw',
    justifyContent : 'center',
    marginTop : '10vh'
}

const container = {
    display : 'flex',
    flexDirection : 'column',
}

const emailPhone ={
    borderRadius : '5px', 
    border : '2px solid lightgrey',
    width : '60vw',
    height : '56%'
}

const title={
    height : '6vw',
    backgroundColor : 'rgba(113,235,164)',
    textAlign : 'center',
    paddingTop : '3vh'
}

const Content = styled('div')`
    width:100%;
    padding:20px;
    box-sizing:border-box;
`

const ChildWrapper = styled('div')`
    width:100%;
    margin-bottom:10px;
    positive:relative;
    display:flex;
    justify-content:space-between;
    padding:20px;
    box-sizing:border-box;
`

const LeftChild = styled('div')`
    display:flex;
`

const VerifyButton = styled('div')`
    color:white;
    background-color:green;
    border-radius:5px;
    padding:10px;
`

const ProfileContainer = styled('div')`
    width:70%;
    height:100%;
    background-color:white;
    margin-top:25%;
    margin-left:14%;
    border-radius:5px;
    border : 2px solid #3cba92;
`

const DivProfile = styled('div')`
    height:100%;
    width:50%;
    text-align:center;
    display:block;
`

const Data = styled('div')`
    padding:10%;
`

const DivPicture = styled('div')`
    width : 100%;
    height :50%;
    display:flex;
    justify-content: center;
`

class ProfilePage extends React.Component{
    constructor(){
        super()

        this.state = {
            status : "",
            name : "",
            city : "",
            joinSince : "",
            email: "",
            emailVerifed :"",
            type : "",
            phoneVerifed : "",
            phone : "",

            message : "",
            path : "",
            allFollowing : ""
        }
    }

    getToken(){
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
                    this.getFollowing()       
                }
            })
        })
    }

    componentDidMount(){
        this.getToken();
    }

    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }

    sendEmail(){
        this.setState({
            loading : true
        })

        // console.log(sessionStorage.getItem('token'));
        Axios.post('http://localhost:8000/api/email/createToken', {
            token: sessionStorage.getItem('token'),
            email: this.state.email
        }).then(response => {
            this.setState({
                message : response.data.message,
                loading : false
            })
        })
    }

    sendPhoneEmail(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/phone/createToken', {
            token: sessionStorage.getItem('token'),
            phone: this.state.phone
        }).then(response => {
            this.setState({
                message : response.data.message,
                loading : false
            })
        })
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
                allFollowing : response.data,
                loading : false
            })
        })
    }

    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type == 3){
            return <Redirect to="/adminDashboard"/>
        }
        
    }

    render(){    
        let errorMessage;
        if(this.state.status){
            errorMessage = <p>{this.state.message}</p>
        }

        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }

        let tagEmail;
        let verifedButton;
        let tagPhone;
        let verifyPhoneButton;
        let phone;

        if(this.state.emailVerifed){
            tagEmail = <span>Verified On : {this.state.emailVerifed}</span>
            verifedButton = ""
            if(this.state.type == 2){
                //owner type = 2
                if(this.state.phoneVerifed){
                    tagPhone = <span>Verified On : {this.state.emailVerifed}</span>
                    verifyPhoneButton = ""
                }
                else{
                    tagPhone = <input type="text" placeholder="Input Phone Number" name="phone" onChange={this.dataChange.bind(this)}></input>
                    verifyPhoneButton = <VerifyButton onClick={()=>this.sendPhoneEmail()}><span>Verifikasi</span></VerifyButton>
                }

                phone = <ChildWrapper>
                    <LeftChild><img src={phoneLogo} style={{width : '5vw', height : '6vh'}}></img> 
                    <span>
                        <div>Phone</div>
                        {tagPhone}
                    </span>
                    </LeftChild>
                    {verifyPhoneButton}
                </ChildWrapper>
            }
        }
        else{
            tagEmail = <input type="text" placeholder="Input Email" name="email" onChange={this.dataChange.bind(this)}></input>
            verifedButton = <VerifyButton onClick={()=>this.sendEmail()}><span>Verifikasi</span></VerifyButton>
        }
        return(
            <div>
                {this.checkUser()}
                {loading}
                <NavBar></NavBar>
                <BreadCrumbs></BreadCrumbs>
                <div style={container}>
                    <div style={{width : '100vw', backgroundColor : 'white' , height : '90vh',  display: 'flex'}}>
                        <div style={{width : '40vw', height : '90vh'}}>
                            <ProfileContainer>
                                <DivPicture>
                                    <ProfilePicture path={this.state.path}></ProfilePicture>
                                </DivPicture>    

                                <DivPicture>     
                                    <DivProfile>
                                        {/* <img src></img> */}
                                        <Data><div>Name</div></Data>
                                        <Data><div>City</div></Data>
                                        <Data><div>Join Since</div></Data>
                                        <Data><div>Online Status</div></Data>
                                        <Data><div>Total Following</div></Data>
                                    </DivProfile>

                                    <DivProfile>
                                        <Data><div> {this.state.name} </div></Data>
                                        <Data><div> {this.state.city} </div></Data>
                                        <Data><div> {this.state.joinSince} </div></Data>
                                        <Data><div> a </div></Data>
                                        <Data><div> {this.state.allFollowing.length} </div></Data>
                                        <Data><Link to="/editProfile">Edit Profile</Link></Data>
                                    </DivProfile>
                                </DivPicture>
                            </ProfileContainer>
                        </div>
                        <div style={verifFrame}>
                            <div style={emailPhone}>
                                <div style={title}><span style={{fontSize : '3vw'}}>Email and Phone</span></div>
                                <Content>
                                    <ChildWrapper>
                                        <LeftChild>
                                            <img src={emailLogo} style={{width : '5vw', height : '6vh'}}></img>
                                            <span>
                                                <div>Email</div>
                                                {tagEmail}
                                            </span>
                                        </LeftChild>           
                                            {verifedButton}
                                    </ChildWrapper>
                                    {phone}
                                    {errorMessage}
                                </Content>
                            </div>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
    )}
}

export default ProfilePage