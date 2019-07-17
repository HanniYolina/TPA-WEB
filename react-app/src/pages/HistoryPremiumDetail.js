import React from 'react'
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import styled from 'styled-components'
import Axios from 'axios'
import moment from 'moment'

const Container = styled('div')`
    width : 100vw;
    height : 100vh;
`

class HistoryPremiumDetail extends React.Component{
    constructor(){
        super();

        this.state = {
            user : "",
            premium : ""
        }
    }
    getPremium(){
        this.setState({
            loading : true
        })

        Axios.post(`http://localhost:8000/api/getPremiumOwnerByItsId`, {
            token: sessionStorage.getItem('token'),
            id : this.props.match.params.id
        }).then(response => {
            this.setState({
                premium : response.data,
                loading : false
            }, ()=>console.log(this.state.premium, this.state.user))
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
                user : response.data.user,
                id : response.data.user.id,
                type : response.data.user.type,
                loading : false
            }, ()=>this.getPremium())
        })
    }

    componentDidMount(){
        this.getUser();
    }

    render(){
        return(
            <div>
                <Container>
                    <NavBar></NavBar>
                    <BreadCrumbs></BreadCrumbs>
                    <div>
                        <p>User Detail</p>
                        <p>Name : {this.state.user.name}</p>
                        <p>Email : {this.state.user.email}</p>
                        <p>Phone : {this.state.user.phone}</p>

                        <br></br>
                        <p>Transaction Detail</p>
                        <p>Start Date : {this.state.premium.start_date}</p>
                        <p>End Date : {this.state.premium.end_date}</p>
                        <p>Transaction Date : {this.state.premium.created_at}</p>
                    </div>

                
                </Container>
            </div>
        )
    }


}

export default HistoryPremiumDetail