import React from 'react'
import {Link} from 'react-router-dom'
import Axios from 'axios'
import styled from 'styled-components'

const RoomStyle = {
    height: '200px',
    width: '20%',
    margin: '20px',
    padding: '15px',
    border: '2px grey solid',
    boxShadow : '6px 8px lightgrey'
}

const PP = styled('div')`
    width : 100%;
    height : 75%;
    border : 2px solid #3cba92;
    margin-top : 2%;
    background-size: 100%;
    background-image:
`

class RoomDetail extends React.Component{
    render(){
        let room = this.props.room
        return(
        <div style={RoomStyle}>
            <Link to={{pathname : `/room/${room.id}`, state : {type : this.props.type}}}>
                {room.picture_name ? <PP style={{backgroundImage: 'url(http://localhost:8000' + `${room.picture_name}` + ')'}}></PP> : null}
                <span>{room.name}</span>
            </Link>
        </div>
    )}
}

export default RoomDetail