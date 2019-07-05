import React from 'react'
import Axios from 'axios'
import styled from 'styled-components'
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import PremiumOwnerDetail from '../containers/PremiumOwnerDetail';
import {Redirect} from 'react-router-dom'

const Container = styled('div')`
    width : 100vw;
    height : 100vh;
`

class HistoryPremiumPage extends React.Component{
    constructor(){
        super();

        this.state = {
            pageNum : 1,
        }
    }
    getPremium(){
        this.setState({
            loading : true
        })

        Axios.post(`http://localhost:8000/api/getAllPremiumByUserId?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token'),
            id : this.state.id
        }).then(response => {
            this.setState({
                premium : response.data.data,
                last_page : response.data.last_page,
                loading : false
            }, ()=>console.log(this.state.premium))
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
                id : response.data.user.id,
                type : response.data.user.type,
                loading : false
            }, ()=>this.getPremium())
        })
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

    componentWillMount(){
        this.getUser();
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
                            <PremiumOwnerDetail premium={premium} type="delete" key={key}></PremiumOwnerDetail>
                        ))
                    }
                    <button onClick={this.changePageNum.bind(this)}>Next</button>
                </Container>     
            </div>
        )
    }
}

export default HistoryPremiumPage