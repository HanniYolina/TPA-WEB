import React from 'react'
import moment from 'moment'
import {Link} from 'react-router-dom'

const UserStyle = {
    height: 'auto',
    width: '30%',
    margin: '20px',
    padding: '15px',
    border: '2px grey solid',
    boxShadow : '6px 8px lightgrey'
}


class PremiumOwnerDetail extends React.Component{
    constructor(){
        super();

        this.state = {
            pop : false
        }
    }

    componentWillMount(){
        let premium = this.props.premium
        let currDate = new Date().getDate()

        if(premium.end_date < currDate){
            this.setState({
                status : "inactive"
            })
        }
        else{
            this.setState({
                status : "active"
            })
        }

        let end_date = moment(premium.end_date)
        let start_date = moment(premium.start_date)
        let diff = end_date.diff(start_date)
        let diffDate = moment.duration(diff)

        this.setState({
            diffDate : diffDate
        })
    }
    
    filterPremimum(){

    }

    render(){
        let premium = this.props.premium    
        let diffDate = this.state.diffDate
        
        let status
        if(this.state.status == "inactive"){
            status = <span>Status : Inactive</span>
        }
        else{
            status = <span>Status : Active</span>
        }
        return(
        <div style={UserStyle}>
            <span>Start Date : {premium.start_date}</span>
            <br></br>
            <span>End Date : {premium.end_date}</span>
            <br></br>
            <span>Transaction Date : {premium.created_at}</span>
            <br></br>
            {status}
            <br></br>
            <span>Duration : {diffDate.months()} months, {diffDate.days()} days , {diffDate.hours()} hours, {diffDate.minutes()} minutes</span>
            <br></br>
            <Link to={`/historyPremiumDetail/${premium.id}`}>Detail</Link>
        </div>
    )}
}

export default PremiumOwnerDetail