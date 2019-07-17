import React from 'react'
import styled from 'styled-components'

const Frame = styled('div')`
    width : 100%;
    height : auto;
    border : 2px solid #3cba92;
    align-items : flex-end;
    display : flex;
    justify-content : flex-end;
`
class Notification extends React.Component{
    render(){
        return(
                <Frame>
                    <p>{this.props.content}</p>
                </Frame>
        )
    }
}

export default Notification