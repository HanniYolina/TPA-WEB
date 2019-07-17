import React from 'react'
import styled from 'styled-components'

const BubbleMe = styled('div')`
    width : 50%;
    height : auto;
    background-color : #3cba92;
    border-radius : 10%;
    margin : 2%;
    padding : 2%;
    align-self : flex-end;
    float : right;
    word-wrap : break-word;
`
const BubblePartner = styled('div')`
    width : 50%;
    height : auto;
    background-color : #3cba92;
    border-radius : 10%;
    margin : 2%;
    padding : 2%;
    word-wrap : break-word;
`

class Bubble extends React.Component{
    render(){
        let chat
        let type = this.props.type
        // console.log(type)
        if(type == "me"){
            chat = <BubbleMe>{this.props.message}</BubbleMe>
        }
        else{
            chat = <BubblePartner>{this.props.message}</BubblePartner>
        }

        return(
            <div style={{width : '100%'}}>
                {chat}
            </div>
        )
    }
}

export default Bubble