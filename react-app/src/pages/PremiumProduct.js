import React from 'react'
import styled from 'styled-components'
import Axios from 'axios'
import NavBar from '../containers/NavBar'
import PremiumDetail from '../containers/PremiumDetail'
import {Redirect} from 'react-router-dom'
import BreadCrumbs from '../components/BreadCrumbs';

const Container = styled('div')`
    width : 100vw;
    height : 50vh;
    margin 0 auto;
`

class PremiumProduct extends React.Component{
    constructor(){
        super();
        this.state = {
            premium : ""
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
                user : response.data.user,
                type : response.data.user.type,
                loading : false
            })
        })
    }

    getPremium(){
        this.setState({
            loading : true
        })

        Axios.post(`http://localhost:8000/api/getAllPremium?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                premium : response.data.data,
                last_page : response.data.last_page,
                loading : false
            })
        })
    }

    componentDidMount(){
        this.getUser();
        this.getPremium();
    }

    changePageNum(){
        let curr = this.state.pageNum
        if(this.state.pageNum == this.state.last_page){
            this.setState({
                pageNum : 1
            }, ()=> this.getPremium())
        }
        else{
            this.setState({
                pageNum : curr + 1
            }, ()=> this.getPremium())
        }
    }

    render(){
        return(
            <div>
                {this.checkUser()}
                 <Container>
                    <NavBar></NavBar>
                    <BreadCrumbs></BreadCrumbs>
                    {
                        this.state.premium && this.state.premium.map((premium, key)=> (
                           <PremiumDetail premium={premium} key={key} type="order" id={this.state.user.id} history={this.props.history}></PremiumDetail>
                        ))
                    }
                    <button onClick={this.changePageNum.bind(this)}>Next</button>
                </Container>
            </div>
        )
    }
}

export default PremiumProduct