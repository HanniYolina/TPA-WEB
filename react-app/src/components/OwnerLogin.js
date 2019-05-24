import React from 'react'
import {Link, withRouter, Redirect} from 'react-router-dom'
import Axios from 'axios'
import Loading from '../components/Loading'
import {connect} from 'react-redux'

class OwnerLogin extends React.Component{
    constructor(){
        super()

        this.state = {
            phone : "",
            password : "",
            type : "",
            message : "",

            status : "",
            loading : "",
            user : "",
            type : 0,
            errorPassword : "",
            errorPhone : ""
        }
    }

    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }

    checkUser(){
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

    getUser(){
        if(sessionStorage.getItem('token')!=null){
            this.setState({
                loading : true
            })

            Axios.post('http://localhost:8000/api/getUser', {
                token: sessionStorage.getItem('token')
            }).then(response => {
                this.setState({
                    type : response.data.user.type
                });
                this.props.onLogin(response.data.user);
            })
        }

    }

    login(ev){
        ev.preventDefault();

        const phone = this.state.phone
        const password = this.state.password
        // const type = this.state.type

        const data = {
            phone,password
        }

        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/login/owner', data).then(response => {
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
                        errorPhone: response.data.phone
                    })
                }
            });
        })
        
    }

    componentDidMount(){
        this.getUser()
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
        return(
            <div>
                {this.checkUser()}
                {loading}
                <form className="form" onSubmit={this.login.bind(this)}>
                    <div>
                        <h2>Owner</h2>
                        <div className="formInput">
                            <label htmlFor="phone"><span>Phone Number </span></label>
                            <input type="text" autoFocus name="phone" onChange={this.dataChange.bind(this)}></input>
                        </div>
                        {this.state.errorPhone}
                        
                        <div className="formInput">
                            <label htmlFor="password"><span>Password </span></label>
                            <input type="password" name="password" onChange={this.dataChange.bind(this)}></input>
                        </div>
                        {this.state.errorPassword}

                        {errorMessage}
                        <button>Login</button>

                        <span> <input style={{ width : '40px'}} type="checkbox"/> Remember Me</span>
                        <div>
                            <br></br>
                            <span>Dont have account? <Link to="/register/owner">Register Now!</Link></span>
                        </div>
                    </div>
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

const state = state=>{
    return {
        user : state.user
    }
}
export default withRouter(connect(state, action)(OwnerLogin))

