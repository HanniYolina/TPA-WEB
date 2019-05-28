import React from 'react'
import styled from 'styled-components'

const Popup = styled('div')`  
    position: absolute;  
    width: 100%;
    height: 100%;  
    top: 0;
    left: 0; 
    right: 0; 
    bottom: 0;
    margin: auto;  
    background-color: rgba(0,0,0, 0.5);  
    z-index : 999
`
const PopupInner = styled('div')`  
    position: absolute;  
    left: 25%;  
    right: 25%;  
    top: 25%;  
    bottom: 25%;  
    margin: 0 auto;  
    border-radius: 20px;  
    background: white; 
`

const Text = styled('div')`
    font-size : 30px;
    font-weight : 700;  
    margin-top : 25%; 
    margin-left : 18%;
`

const Display = styled('div') `
    display : flex
`

class PopUp extends React.Component{
    change(ev){
        this.props.buttonPopup(ev.target.value)
    }

    render() {  
        let button;
        if(this.props.type != 'Banned'){
            button = 
            <Display>
                <button onClick={this.change.bind(this)} value="cancel">Cancel</button>
                <button onClick={this.change.bind(this)} value={this.props.type}>{this.props.type}</button>
            </Display>
        }
        return (  
            <Popup>
                <PopupInner>
                    <Text>{this.props.text}</Text>
                    {button}
                </PopupInner>
            </Popup>
        )}  
}

export default PopUp