import React from 'react'
import {Link} from 'react-router-dom'
import SearchBar from '../containers/SearchBar';
import Map from '../components/Map';
import styled from 'styled-components'
import Axios from 'axios';
import Loading from '../components/Loading'
import PopUp from '../components/PopUp';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import NavBar from '../containers/NavBar';

const OwnerProfile = styled('div')`
    text-decoration:none;
    color: green;
    padding : 3%;
    font-weight : 700;  
`
class RoomPage extends React.Component{
    constructor(){
        super();

        this.state = {
            type : "",
            id : "",
            user : "",
            owner_id : "",
            delete : false,
            confirm : "",
            popup : ""
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
            })
        })

    }

    getProperties(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/getRoomById`, {
            id : this.props.match.params.id,
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                room : response.data.room,
                kost : response.data.kost,
                owner_id : response.data.room.owner_id,
                propertiesable_type : response.data.room.propertiesable_type,
                loading : false
            })
        })
    }

    componentDidMount(){
        this.getUser();
        
        this.setState({
            id : this.props.match.params.id
        }, ()=> this.getProperties())
        
    }

    deleteRoom(){
        this.setState({
            delete : true
        })
    }

    deleteFromDB(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/destroyRoom/`,{
            token: sessionStorage.getItem('token'),
            id : this.state.id
        }).then(response => {
            this.setState({
                message : response.message,
                loading : false
            })
        })
        this.props.history.replace('/manageRentHouse');
    }

    buttonPopup(value){
        this.setState({
            popup : value,
            delete : false
        })
    }

    updateRoom(){
        var type = "App"+ "\\" +"Kost";
        if(this.state.propertiesable_type == type){
            this.props.history.replace(`/formUpdate/${this.props.match.params.id}`);
        }

        else{
            this.props.history.replace(`/formUpdateApartment/${this.props.match.params.id}`);
        }
        
    }

    render(){
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        let button;
        let page;
        if(this.state.type == 1){
            button = <div>
                    <Link to={`/ownerProfile/${this.state.owner_id}`}><OwnerProfile>Go to Owner Profile</OwnerProfile></Link>
                    <button>Contact Kost</button>
                </div>
        }
        else if(this.state.type == 2){
            if(this.props.location.state.type == "update"){
                page = <h4>Do you want to update?</h4>
                button = <button onClick={this.updateRoom.bind(this)}>Update</button>
            }
            else if(this.props.location.state.type == "delete"){
                page = <Map lat={this.state.lat} lon={this.state.lon}></Map>
                button = <button onClick={this.deleteRoom.bind(this)}>Delete</button>
            }
        }

        let deleteButton
        if(this.state.delete){
            deleteButton = <PopUp buttonPopup={this.buttonPopup.bind(this)}></PopUp>
        }
        else{
            if(this.state.popup == "delete"){
                this.deleteFromDB()
            }
        }

        return(
            <div>
                {loading}
                <NavBar></NavBar>
                {page}
                {button}
                {deleteButton}
            </div>
        )
    }
}

const state = state=>{
    return {
        confirm : state.confirm
    }
}
export default withRouter(connect(state)(RoomPage))