import React from 'react'

const UserStyle = {
    height: '80px',
    width: '20%',
    margin: '20px',
    padding: '15px',
    border: '2px grey solid',
    boxShadow : '6px 8px lightgrey'
}


class UserDetail extends React.Component{
    render(){
        let user = this.props.user
        return(
        <div style={UserStyle}>
            <span>{user.name}</span>
            <br></br>
            <span>{user.email}</span>
            <br></br>
            <span>{user.created_at}</span>
        </div>
    )}
}

export default UserDetail