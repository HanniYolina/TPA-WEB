import React from 'react'
import styled from 'styled-components'
import Axios from 'axios'
import Loading from '../components/Loading'

const Popup = styled('div')`  
    position: absolute;  
    width: 100%;
    height: 100%;  
    top: 0;
    left: 0; 
    right: 0; 
    bottom: 0;
    margin: auto;  
    background-color: rgba(0,0,0, 0.5);  
    z-index : 999
`
const PopupInner = styled('div')`  
    position: absolute;  
    left: 25%;  
    right: 25%;  
    top: 25%;  
    bottom: 25%;  
    margin: 0 auto;  
    border-radius: 20px;  
    background: white; 
`

const Text = styled('div')`
    font-size : 20px;
    font-weight : 700;  
    margin-top : 20%; 
    margin-left : 18%;
`

const Display = styled('div') `
    display : flex
`

const Label = styled('div')`
    width : 45%;
    text-align : center;
`

const Row = styled('div')`
    padding : 10px;
`

class ChangePassword extends React.Component{
    constructor(){
        super();

        this.state = {
            loading : false
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
                type : response.data.user.type,
                email : response.data.user.email,
                phone : response.data.user.phone,
                loading : false
            } )
        })
    }

    changePass(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/changePassword', {
            token: sessionStorage.getItem('token'),
            type : this.state.type,
            email : this.state.email,
            phone : this.state.phone,
            password : this.state.oldPassword,
            newPassword : this.state.password,
            newPassword_confirmation : this.state.password_confirmation
        }).then(response => {
            this.setState({
                loading : false
            });
            this.props.changeDelete()
        })
    }

    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }

    componentDidMount(){
        this.getUser()
    }

    render() { 
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        let errorMessage;
        if(this.state.status){
            errorMessage = <p>{this.state.message}</p>
        }

        return (  
            <Popup>
                {loading}
                <PopupInner>
                    <Text>Change Password </Text>
                    <Display>
                        <Label>
                            <p>Password</p>
                            <p>New Password</p>
                            <p>Confirm New Password</p>
                        </Label>
                        <Label>
                            <Row><input type="password" name="oldPassword" onChange={this.dataChange.bind(this)}></input></Row>
                            <Row><input type="password" name="password" onChange={this.dataChange.bind(this)}></input></Row>
                            <Row><input type="password" name="password_confirmation" onChange={this.dataChange.bind(this)}></input></Row>
                        </Label>
                    </Display>
                    {errorMessage}
                    <button onClick={this.changePass.bind(this)}>Change Password</button>
                </PopupInner>
            </Popup>
        )}  
}


export default ChangePassword