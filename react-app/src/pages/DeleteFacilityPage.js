import React from 'react'
import PopUp from '../components/PopUp';
import Axios from 'axios'
import { Redirect } from 'react-router-dom'

class DeleteFacilityPage extends React.Component{
    constructor(){
        super();

        this.state = {
            delete : true
        }
    }
    deleteFacility(){
        Axios.post('http://localhost:8000/api/destroyFacilities',
        {
                token: sessionStorage.getItem('token'),
                id : this.props.match.params.id
        }
        ).then(response => {
            //reload page
        })
    }
    
    buttonPopup(value){
        this.setState({
            popup : value,
            delete : false
        })
    }

    render(){
        let button
        if(this.state.delete){
            button = <PopUp buttonPopup={this.buttonPopup.bind(this)}></PopUp>
        }
        else{
            button = <Redirect to="/manageFacilityPage"/>
        }

        if(this.state.popup == "delete"){
            this.deleteFacility()
        }
        return(
            <div>
                {button}
            </div>
        )

        
        
    }

}

export default DeleteFacilityPage