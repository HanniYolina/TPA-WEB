import React from 'react'
import Axios from 'axios'

const UserStyle = {
    height: '160px',
    width: '20%',
    margin: '20px',
    padding: '15px',
    border: '2px grey solid',
    boxShadow : '6px 8px lightgrey'
}


class ReportDetail extends React.Component{
    constructor(){
        super()

        this.state = {
            room : "",
            owner : ""
        }
    }
    getProperties(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/getRoomById`, {
            id : this.props.report.properties_id,
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                room : response.data.room,
                kost : response.data.kost,
                loading : false
            })
        })
    }

    getOwner(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getUser', {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                status : response.status,
                owner : response.data.user ,
                loading : false
            })
        })
    }

    componentWillMount(){
        this.getProperties()
        this.getOwner()
    }

    render(){
        let report = this.props.report
        return(
            <div style={UserStyle}>
                <span>Properties Name : {this.state.room.name}</span>
                <br></br>
                <span>Owner Name : {this.state.owner.name}</span>
                <br></br>
                <span>Report Type: {report.report_type}</span>
                <br></br>
                <span>Report Content: {report.report_content}</span>
            </div>
        )
    }
}

export default ReportDetail