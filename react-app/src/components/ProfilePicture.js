import React from 'react'
import Axios from 'axios'
import styled from 'styled-components'

const PP = styled('div')`
    width : 200px;
    height : 200px;
    border-radius : 100%;
    border : 2px solid #3cba92;
    margin-top : 2%;
    background-size: 100%;
    background-image:
`

class ProfilePicture extends React.Component{
    constructor (){
        super()

        this.state = {
            path : ""
        }
    }

    render(){
        return(
            <div>
                {this.props.path ? <PP style={{backgroundImage: 'url(http://localhost:8000' + `${this.props.path}` + ')'}}></PP> : null}
            </div>
        )
    }
}

export default ProfilePicture