import React from 'react'
import {Link, withRouter, Redirect} from 'react-router-dom'
import Loading from '../components/Loading'
import {connect} from 'react-redux'
import Axios from 'axios'

class GuestLogin extends React.Component {
    constructor(){
        super()

        this.state = {
            email : "",
            password : "",
            type : "0",
            message : "",
            loading : '',

            status : "",
            errorEmail : "",
            errorPassword : "",
            rememberme : false
        }
    }

    dataChange(ev){
        if(ev.target.type == "checkbox"){
            this.setState({
                [ev.target.name] : ev.target.checked
            })
        }
        else{
            this.setState({
                [ev.target.name] : ev.target.value
            })
        }
    }

    checkUser(){
        if(this.state.userStatus == 2){
            //banned 
            return <Redirect to="/banned"/>
        }
        else{
            if(this.state.type == 1){
                return <Redirect to="/"/>
            }
            else if(this.state.type == 2){
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
                type : response.data.user.type,
                userStatus : response.data.user.status
            });
            this.props.onLogin(response.data.user);
        })

    }

    login(ev){
        ev.preventDefault();

        const email = this.state.email
        const password = this.state.password
        const type = this.state.type
        const rememberme = this.state.rememberme
        
        const data = {
            email,password,type,rememberme
        }

        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/login/guest', data).then(response => {
            this.setState({
                message : response.data.message,
                status : response.status,
                loading : false
            }, () => {
                if(this.state.message == 'success') {
                    sessionStorage.setItem('token', response.data.data.token);
                    this.getUser();
                }
                else{
                    this.setState({
                        errorPassword : response.data.password,
                        errorEmail : response.data.email
                    })
                }

               
            })
        })
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
        return(
            <div>
                {this.checkUser()}
                {loading}
                <form className="form" onSubmit={this.login.bind(this)}>
                    {
                        <div>
                            
                            <h2>Guest</h2>
                            <div className="formInput">
                                <label htmlFor="email"><span>Email </span></label>
                                <input type="email" autoFocus name="email" onChange={this.dataChange.bind(this)}></input>
                            </div>
                            {this.state.errorEmail}
                            
                            <div className="formInput">
                                <label htmlFor="password"><span>Password </span></label>
                                <input type="password" name="password" onChange={this.dataChange.bind(this)}></input>
                            </div>

                            {this.state.errorPassword}
                            {errorMessage}
                            <button>Login</button>
                            
                            <span> <input style={{ width : '40px'}} name="rememberme" type="checkbox" onChange={this.dataChange.bind(this)} /> Remember Me</span>
                            <div>
                                <br></br>
                                <span>Dont have account? <Link to="/register/guest">Register Now!</Link></span>
                            </div>
                        </div>     
                    }
                </form>
            </div>
        )}
}

const action = dispatch=>{
    return {
        onLogin : (value) => dispatch({
            type : 'store',
            value : value
        })
    }
}
export default withRouter(connect(null, action)(GuestLogin))

