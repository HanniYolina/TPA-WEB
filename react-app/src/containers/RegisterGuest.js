import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import BackToMainMenu from '../components/BackToMainMenu';
import Axios from 'axios'
import Loading from '../components/Loading'

class RegisterGuest extends React.Component {
    constructor(){
        super()

        this.state = {
            name : "",
            email : "",
            password : "",
            password_confirmation : "",
            message : "",

            status : "",
            loading : ""
        }
    }

    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }

    postData(ev){
        ev.preventDefault();

        const name = this.state.name
        const email = this.state.email
        const password = this.state.password
        const password_confirmation = this.state.password_confirmation
        const type = 1
        const status = 1

        
        this.setState({
            loading: true
        })

        const data = {
            name,email,password,type,status,password_confirmation
        }

        // console.log(data)
        Axios.post('http://localhost:8000/api/registerGuest', data).then(response => {
            // console.log(response.status);
            this.setState({
                loading : false,
                message : response.data.message,
                status : response.status
            });
            if(this.state.status == 200 && this.state.message == 'Register as Guest Success'){
                window.location.href = '/login'
            }    
            else{
                this.setState({
                    errorEmail : response.data.email,
                    errorName : response.data.name,
                    errorPassword : response.data.password,
                })
            }
        })
    }

    checkUser(){
        if(sessionStorage.getItem('token')){
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
        if(sessionStorage.getItem('token')){
            this.setState({
                loading : true
            })

            Axios.post('http://localhost:8000/api/getUser', {
                token: sessionStorage.getItem('token')
            }).then(response => {
                this.setState({
                    type : response.data.user.type,
                    loading : false
                })
            })
        }
    }

    componentDidMount(){
        this.getUser();
    }

    render(){
        let errorMessage;
        if(this.state.status == 200){
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
                <BackToMainMenu></BackToMainMenu>
                <form className="form" onSubmit={this.postData.bind(this)}>
                    <h3>Guest</h3>
                    <div className="formInput">
                        <label htmlFor="name"><span>Full Name</span></label>
                        <input type="text" autoFocus name="name" onChange={this.dataChange.bind(this)}></input>
                    </div>
                    {this.state.errorName}

                    <div className="formInput">
                        <label htmlFor="email"><span>Email</span></label>
                        <input type="email" name="email" onChange={this.dataChange.bind(this)}></input>
                    </div>
                    {this.state.errorEmail}
                    
                    <div className="formInput">
                        <label htmlFor="password"><span>Password</span></label>
                        <input type="password" name="password" onChange={this.dataChange.bind(this)}></input>
                    </div>
                    {this.state.errorPassword}

                    <div className="formInput">
                        <label htmlFor="password_confirmation"><span>Confirm Password</span></label>
                        <input type="password" name="password_confirmation" onChange={this.dataChange.bind(this)}></input>
                    </div>

                    {errorMessage}
                    <button>Register</button>
                    <span>Already have an account?<Link to="/login">Log In!</Link></span>
                    <span style={{float : 'right'}}>I want to <Link to="/register/owner">Register as Owner</Link></span>
                </form>
            </div>
    )}
}

export default RegisterGuest