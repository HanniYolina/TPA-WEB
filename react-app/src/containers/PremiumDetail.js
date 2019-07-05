import React from 'react'
import PopUp from '../components/PopUp'
import Axios from 'axios'
import {Link} from 'react-router-dom'

const UserStyle = {
    height: '120px',
    width: '20%',
    margin: '20px',
    padding: '15px',
    border: '2px grey solid',
    boxShadow : '6px 8px lightgrey'
}


class PremiumDetail extends React.Component{
    constructor(){
        super();

        this.state = {
            pop : false
        }
    }
    buttonPopup(value){
        this.setState({
            popup : value,
            pop : false
        })
    }

    changePop(){
        this.setState({
            pop : true,
            premium : this.props.premium.id
        })
    }

    deleteFromDB(){
        Axios.post(`http://localhost:8000/api/destroyPremium`,{
            token: sessionStorage.getItem('token'),
            id : this.state.premium
        })
    }
    
    gotoOrder(){
        this.props.history.push({
            pathname : '/orderPremium',
            state : {
                premium : this.props.premium,
                id : this.props.id
            }
        })
    }
    render(){
        let premium = this.props.premium

        let popup;
        if(this.state.pop){
            popup = <PopUp text="Are you sure to delete?" type="delete" buttonPopup={this.buttonPopup.bind(this)}></PopUp>
        }
        else{
            if(this.state.popup == "delete"){
                //delete
                this.deleteFromDB();
            }
        }

        let duration = JSON.parse(premium.duration)
        let labelDuration;
        if(duration.month!=0){
            labelDuration = <span>{duration.month} Month</span>
        }
        else if(duration.day !=0){
            labelDuration = <span>{duration.days} Days</span>
        }
        else if(duration.week!=0){
            labelDuration = <span>{duration.week} Week</span>
        }
        else if(duration.year!=0){
            labelDuration = <span>{duration.year} Year</span>
        }

        let button
        if(this.props.type == "delete"){
            button = <button onClick={this.changePop.bind(this)}>Delete</button>
        }
        else if(this.props.type == "update"){
            // console.log(this.props.premium.id)
            let path = '/updatePremium/' + `${this.props.premium.id}`;
            button = <Link to={path}><button>Update</button></Link>   
        }
        else if(this.props.type == "order"){
            button = <button onClick={this.gotoOrder.bind(this)}>Order</button>
        }

        return(
        <div style={UserStyle}>
            {popup}
            {labelDuration}
            <br></br>
            <span>Rp. {premium.price},00</span>
            <br></br>
            <span>Promo : {premium.promo}</span>
            <br></br>
            {button}
        </div>
    )}
}

export default PremiumDetail