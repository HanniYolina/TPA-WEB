import React from 'react'
import Axios from 'axios'
import styled from 'styled-components'
import {Redirect} from 'react-router-dom'
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import RoomDetail from '../containers/RoomDetail';
import Loading from '../components/Loading';

const Container = styled('div')`
    width : 100vw;
    height : 100vh;
`

const Tab = styled('div')`
    display : flex;
`

const divStyle = {
    width : '30%',
    height : '10%',
    backgroundColor : 'white',
    border : '2px solid #3cba92',
    margin : '0 auto',
    marginTop : '5vh',
    textAlign : 'center',
    fontSize : '180%',
    borderRadius: '10px',
}

class HistoryPage extends React.Component{
    constructor(){
        super();

        this.state = {
            type : "",
            page : "latestView",
            properties : [],
            latestView : "",
            favoriteProperties : [],
            pageNum : 1
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
                user : response.data.user,
                type : response.data.user.type,
                loading : false
            }, ()=>{
                this.getLatestView();
                this.getUserFavorite();
            })
        })

    }
    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type != 1){
            if(this.state.type == 3){
                return <Redirect to="/adminDashboard"/>
            }
            else if(this.state.type == 2){
                return <Redirect to="/ownerDashboard"/>
            }
        }
    }

    pageChange(ev){
        this.setState({
            page : ev.target.value
        })
    }

    getLatestView(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getLatestView', {
            token: sessionStorage.getItem('token'),
            user_id : this.state.user.id
        }).then(response => {
            this.setState({
                latestView : response.data,
                loading : false
            }, ()=>this.getProperties())
        })
    }

    getProperties(){
        this.setState({
            loading : true
        })

        let latestView = this.state.latestView
        
        for(let i=0; i<latestView.length; i++){
            Axios.post('http://localhost:8000/api/getRoomById', {
                token: sessionStorage.getItem('token'),
                id : latestView[i].properties_id
            }).then(response => {
                this.state.properties.push(response.data)
            })
        }
       
        this.setState({
            loading : false
        })
    }

    getUserFavorite(){
        this.setState({
            loading : true
        })

        Axios.post(`http://localhost:8000/api/getAllFavoriteByUser?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token'),
            user_id : this.state.user.id
        }).then(response => {
            this.setState({
                allFavorite : response.data.data,
                last_page : response.data.last_page,
                loading : false
            }, ()=>this.getFavoriteProperties())
        })
    }

    getFavoriteProperties(){
        this.setState({
            loading : true
        })

        let allFavorite = this.state.allFavorite
        
        for(let i=0; i<allFavorite.length; i++){
            Axios.post('http://localhost:8000/api/getRoomById', {
                token: sessionStorage.getItem('token'),
                id : allFavorite[i].properties_id
            }).then(response => {
                this.setState({
                    favoriteProperties : [...this.state.favoriteProperties, response.data]
                })
                console.log(this.state.favoriteProperties)
            })
        }
       
        this.setState({
            loading : false
        })
    }

    changePageNum(){
        let curr = this.state.pageNum
        this.setState({
            favoriteProperties : []
        })
        if(this.state.pageNum == this.state.last_page){
            this.setState({
                pageNum : 1
            }, ()=> this.getUserFavorite())
        }
        else{
            this.setState({
                pageNum : curr + 1
            }, ()=> this.getUserFavorite())
        }
    }

    componentWillMount(){
        this.getUser();
        
    }

    render(){
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }

        let content;
        if(this.state.page == "latestView"){
            content = <div>
                {
                    this.state.properties && this.state.properties.map((properties, key)=> (
                        <RoomDetail room={properties.room} type="view" key={key}></RoomDetail>
                    ))
                }
            </div>
        }else if(this.state.page == "favorite"){
            content = <div>
                {
                    this.state.favoriteProperties && this.state.favoriteProperties.map((properties, key)=> (
                        <RoomDetail room={properties.room} type="view" key={key}></RoomDetail>
                    ))
                }
                <button onClick={this.changePageNum.bind(this)}>Next</button>
            </div>
        }
        else if(this.state.page == "chat"){
            content = <div>
                
            </div>
        }
        return(
            <div>
                {loading}
                {this.checkUser()}
                <Container>
                <NavBar></NavBar>
                <BreadCrumbs></BreadCrumbs>
                <Tab>
                    <button style={divStyle} value="latestView" onClick={this.pageChange.bind(this)}>Latest View</button>
                    <button style={divStyle} value="favorite" onClick={this.pageChange.bind(this)}>Favorite</button>
                </Tab>
                {content}
                </Container>
            </div>
        )
    }
}

export default HistoryPage