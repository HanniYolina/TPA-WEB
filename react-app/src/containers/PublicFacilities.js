import React from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import Axios from 'axios';

const PP = styled('div')`
    width : 200px;
    height : 200px;
    border-radius : 100%;
    border : 2px solid #3cba92;
    margin-top : 2%;
    background-size: 100%;
    background-image:
`

const DivStyle = styled('div')`
    display : flex;
    margin-left : 5%;
`

const Label = styled('div')`
    margin : 10%;
    margin-top : 8%;
    margin-bottom : 8%;
`
const Button = styled('div')`
    
`

class PublicFacilities extends React.Component{
    constructor (){
        super()

        this.state = {
            path : "",
            redirect : false
        }
    }

    changePage(){
        if (this.state.redirect) {
            if(this.props.type == "update"){
                let path = '/updateFacilitiesPage/' + `${this.props.facilities.id}`;
                return <Redirect to={path}/>
            }
            else if(this.props.type == "delete"){
                let path = '/deleteFacilitiesPage/' + `${this.props.facilities.id}`;
                return <Redirect to={path}/>
            }
        }
    }

    setRedirect(){
        this.setState({
          redirect: true
        })
    }

    clickClick(){
       this.props.appendFacilities(this.props.facilities)

    }

    render(){
        let facilities = this.props.facilities
        let button;
        let clicked;
        if(this.props.type == 'show'){
            button = null
            clicked = ()=>this.clickClick()
        }
        else{
            clicked = null
            button = <Button><button onClick={this.setRedirect.bind(this)}>{this.props.type}</button></Button>
        }

        
        return(
            <div onClick={clicked}>
                {this.changePage()}
                <DivStyle>
                    {this.props.facilities ? <PP style={{backgroundImage: 'url(http://localhost:8000' + `${this.props.facilities.icon}` + ')'}}></PP> : null}
                    <Label>
                        <span>{facilities.name}</span>
                        <br></br>
                        <span>{facilities.group}</span>
                        {button}
                    </Label>
                </DivStyle>
            </div>
        )
    }

}

export default PublicFacilities