import React from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

const UserStyle = {
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

class UserDetail extends React.Component{
    render(){
        let user = this.props.user
        return(
        <div style={UserStyle}>
            <Link to={{pathname : `/ownerProfile/${user.user.id}`}}>
                {user.path ? <PP style={{backgroundImage: 'url(http://localhost:8000' + `${user.path}` + ')'}}></PP> : null}
                <span>{user.user.name}</span>
                <br></br>
            </Link>
        </div>
    )}
}

export default UserDetail