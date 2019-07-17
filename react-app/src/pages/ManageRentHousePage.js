import React from 'react'
import NavBar from '../containers/NavBar'
import styled from 'styled-components'
import {Link} from 'react-router-dom';
import Axios from 'axios'
import RoomDetail from '../containers/RoomDetail';
import { Redirect } from 'react-router-dom'
import BreadCrumbs from '../components/BreadCrumbs';

const Container = styled('div')`
    width : 100vw;
    height : 50vh;
    margin 0 auto;
`
const FormButton = styled('div')`
    width : 85%;
    height : 55%;
    border-bottom : 2px solid #3cba92;
    margin 0 auto;
    bottom : 0;
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

class ManageRentHousePage extends React.Component{
    constructor(){
        super();

        this.state = {
            type : 0,
            pageNum : 1,
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
                status : response.status,
                owner_id : response.data.user.id,
                type : response.data.user.type,
                loading : false
            }, () => this.getAllRoomById())
        })
    }

    getAllRoomById(){
        this.setState({
            loading : true
        })
        
        Axios.post(`http://localhost:8000/api/getAllRoom?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token'),
            owner_id : this.state.owner_id
        }).then(response => {
            this.setState({
                status : response.status,
                allRoom : response.data.data,
                last_page : response.data.last_page,
                loading : false
            });
        })
    }

    buttonClicked(ev){
        ev.preventDefault();
        if(ev.target.value == 'add'){
            this.props.history.replace('/formKost');
        }
        else{
            this.setState({
                type : ev.target.value
            })
        }
    }

    componentDidMount(){
        this.getUser();
    }

    changePageNum(){
        let curr = this.state.pageNum
        if(this.state.pageNum == this.state.last_page){
            this.setState({
                pageNum : 1
            }, ()=> this.getAllRoomById())
        }
        else{
            this.setState({
                pageNum : curr + 1
            }, ()=> this.getAllRoomById())
        }
    }

    render(){
        let content = ""
        if(this.state.type == "update" || this.state.type == "delete"){
            content = 
            <div>
                {
                    this.state.allRoom && this.state.allRoom.map((room, key)=> (
                        <RoomDetail room={room} key={key} type={this.state.type}></RoomDetail>
                    ))
                }
                <button onClick={this.changePageNum.bind(this)}>Next</button>
            </div>
        }
        return(
            <div>
                {this.checkUser()}
                <Container>
                   <NavBar></NavBar>
                   <BreadCrumbs></BreadCrumbs>
                    <Tab>
                        <button style={divStyle} value="add" onClick={this.buttonClicked.bind(this)}>Add Rent House</button>
                        <button style={divStyle} value="update" onClick={this.buttonClicked.bind(this)}>Update Rent House</button>
                        <button style={divStyle} value="delete" onClick={this.buttonClicked.bind(this)}>Delete Rent House</button>
                    </Tab>

                    {content}
                    
                </Container>
            </div>
        )
    }
}

export default ManageRentHousePage