import React from 'react';
import NavBar from '../containers/NavBar';
import styled from 'styled-components';
import Axios from 'axios';

const Container = styled('div')`
    width : 100vw;
    height : 100vh;
`

const ListPartner = styled('div')`
    width : 35%;
    height : 100%;
    border-right : 2px solid #3cba92;
`
const ChatDetail = styled('div')`
    width : 65%;
    height : 100%;
`
const Display = styled('div')`
    display : flex;
    width : 100%;
    height : 100%;
`
const InputChat = styled('div')`
    width : 100%;
    height : 10%;
    position  : fixed;
    bottom : 0;
    border-top : 2px solid #3cba92;
`
const Buttons = styled('div')`
    width : 10%;
    height : 80%;
    position : fixed;
    right : 0;
`

class Chat extends React.Component{

    constructor(){
        super();

        this.state = {
            id : ""
        }
    }
    
    getUser(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getUser', {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                id : response.data.user.id
            })
        })
    }

    componentDidMount(){
        this.getUser();
    }

    render(){
        return(
            <div>
                <Container>
                    <NavBar></NavBar>
                    <Display>
                        <ListPartner></ListPartner>
                        <ChatDetail>
                            <InputChat>
                                <Buttons>
                                    <button onClick={ () => this.props.send(this.state.id)}>Send</button>
                                </Buttons>
                            </InputChat>
                        </ChatDetail>
                    </Display>
                </Container>
            </div>
        )
    }
}

export default Chat