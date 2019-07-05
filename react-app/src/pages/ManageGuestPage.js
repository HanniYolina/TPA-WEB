import React from 'react'
import NavBar from '../containers/NavBar';
import styled from 'styled-components'
import Axios from 'axios'
import {Redirect} from 'react-router-dom'
import GuestDetail from '../containers/GuestDetail'
import Loading from '../components/Loading'
import BreadCrumbs from '../components/BreadCrumbs';

const Container = styled('div')`
    width : 100vw;
    height : 50vh;
    margin 0 auto;
`
const Tab = styled('div')`
    display : flex;
    width : 50%;
`

const divStyle = {
    width : '30%',
    height : '10%',
    backgroundColor : 'white',
    border : '2px solid #3cba92',
    margin : '0 auto',
    marginTop : '5vh',
    textAlign : 'center',
    fontSize : '100%',
    borderRadius: '10px',
}

const clickedDivStyle = {
    width : '30%',
    height : '10%',
    backgroundColor : '#3cba92',
    border : '2px solid #3cba92',
    margin : '0 auto',
    marginTop : '5vh',
    textAlign : 'center',
    fontSize : '100%',
    borderRadius: '10px',    
}

class ManageGuestPage extends React.Component{
    constructor(){
        super();

        this.state = {
            page : 'all',
            user : [],
            pageNum : 1,
            activeStatus : false,
            emailVerified : false
        }
    }

    getGuest(){
        this.setState({
            loading : true
        })
        Axios.post(`http://localhost:8000/api/getOwnerOrGuest?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token'),
            type : "1"
        }).then(response => {
            this.setState({
                loading : false,
                user : response.data.data,
                last_page : response.data.last_page
            })
        })      
    }

    getFilteredGuest(){
        // console.log(this.state.emailVerified)
        // console.log(this.state.activeStatus)
        this.setState({
            loading : true
        })
        Axios.post(`http://localhost:8000/api/getFilteredUser?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token'),
            type : "1",
            emailVerified : this.state.emailVerified,
            activeStatus : this.state.activeStatus
        }).then(response => {
            this.setState({
                loading : false,
                user : response.data.data,
                last_page : response.data.last_page
            },()=>console.log(this.state.user))
        })
    }

    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type != 3){
            if(this.state.type == 2){
                return <Redirect to="/ownerDashboard"/>
            }
            else if(this.state.type == 1){
                return <Redirect to="/"/>
            }
        }
    }

    componentDidMount(){
        this.getGuest();
    }

    changePageNum(){
        let curr = this.state.pageNum
        if(this.state.pageNum == this.state.last_page){
            this.setState({
                pageNum : 1
            },()=>{
                if(this.state.page == 'all') this.getGuest();
                else this.getFilteredGuest();
            })
        }
        else{
            this.setState({
                pageNum : curr + 1
            },()=>{
                if(this.state.page == 'all') this.getGuest();
                else this.getFilteredGuest();
            })
        }
    }

    pageChange(ev){
        this.setState({
            page : ev.target.value
        },()=>{
            if(this.state.page == 'all') this.getGuest();
            else this.getFilteredGuest();
        })

    }

    emailVerfied(){
        if(this.state.emailVerified){
            this.setState({
                emailVerified : false
            })
        }else{
            this.setState({
                emailVerified : true
            })
        }
    }

    activeStatus(){
        if(this.state.activeStatus){
            this.setState({
                activeStatus : false
            })
        }else{
            this.setState({
                activeStatus : true
            })
        }
    }

    render(){
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        return(
            <div>
                {loading}
                {this.checkUser()}>
                <Container>
                    <NavBar></NavBar>
                    <BreadCrumbs></BreadCrumbs>
                    <Tab>
                        <button style={divStyle} value="all" onClick={this.pageChange.bind(this)}>All</button>
                        <button style={divStyle} value="filtered" onClick={this.pageChange.bind(this)}>Filtered</button>
                    </Tab>
                    
                    <Tab>
                        <button style={this.state.emailVerified ? clickedDivStyle : divStyle} onClick={this.emailVerfied.bind(this)}>Email Verified</button>
                        <button style={this.state.activeStatus ? clickedDivStyle : divStyle} onClick={this.activeStatus.bind(this)}>Status Active</button>
                    </Tab>
                    {
                        this.state.user && this.state.user.map((user, key)=> (
                           <GuestDetail user={user} key={key}></GuestDetail>
                        ))
                    }
                    <button onClick={this.changePageNum.bind(this)}>Next</button>
                </Container>
            </div>
        )
    }
}

export default ManageGuestPage