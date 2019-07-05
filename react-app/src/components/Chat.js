import React from 'react';
import NavBar from '../containers/NavBar';
import styled from 'styled-components';
import Axios from 'axios';
import {Redirect, withRouter} from 'react-router-dom'
import {setReceive, connect} from '../Api.js'
import Bubble from '../components/Bubble.js'
import Loading from './Loading';

const Container = styled('div')`
    width : 100vw;
    height : 100vh;
`

const ListPartner = styled('div')`
    width : 35%;
    height : calc(100vh - 50px);
    border-right : 2px solid #3cba92;
    padding-top : 100px;

`
const ChatDetail = styled('div')`
    width : 65%;
    height : calc(100vh - 50px);
    padding-top : 100px;
`
const Display = styled('div')`
    display : flex;
    width : 100vw;
    height : 100vh;
`
const InputChat = styled('div')`
    width : 100%;
    height : 10%;
    position  : fixed;
    bottom : 0;
    border-top : 2px solid #3cba92;
    display : flex;
`
const Buttons = styled('div')`
    width : 10%;
    height : 80%;
    position : fixed;
    right : 0;
`

const ListChat = styled('div')`
    width : 100%;
    height : auto;
    border-bottom : 2px solid #3cba92;
    padding-left : 2%;
    overflow : hidden;
`



class Chat extends React.Component{

    constructor(){
        super();

        setReceive(this.receiveChat.bind(this))

        this.state = {
            id : "",
            content : "",
            to_id : null
        }
    }
    
    getUser(){
        console.log("b")
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getUser', {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                id : response.data.user.id,
                type : response.data.user.type,
                loading : false
            },()=>{
                connect(this.state.id);
                this.getChatList()
                if(this.props.location.state != undefined || this.state.to_id!=null)this.getAllChat()
            }
            )
        })
    }

    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type == 3){
            return <Redirect to="/adminDashboard"/>
        }
    }

    dataChange(ev){   
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }

    getChatList(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getChatList', {
            token: sessionStorage.getItem('token'),
            id : this.state.id
        }).then(response => {
            this.setState({
                chatList : response.data,
                loading : false
            })
        })
    }

    getAllChat(){
        // console.log(this.state.to_id)
        // console.log(this.state.id)
        if(this.state.to_id){
            this.setState({
                loading : true
            })

            Axios.post('http://localhost:8000/api/getAllChat', {
                token: sessionStorage.getItem('token'),
                from_id : this.state.id,
                to_id : this.state.to_id
            }).then(response => {
                this.setState({
                    allChat : [],
                    loading : false
                })

                let receiveMessage

                response.data.chat.map(chat => {
                    if(this.state.id == chat.from_id){
                        receiveMessage = <Bubble message={chat.contents} type="me"></Bubble>   
                    }else{
                        receiveMessage = <Bubble message={chat.contents} type="partner"></Bubble>   
                    }
                    
                    this.setState({
                        allChat : [...this.state.allChat, receiveMessage]
                    })
                })

                // for(let i in response.data.chat){
                //     let data = response.data.chat[i]
                //     let receiveMessage

                    
                // }
            })
        }
    }

    sendChat(){
        this.setState({
            loading : true
        })

        let message = this.state.content
        let send = <Bubble message={message} type="me"></Bubble>

        this.setState({
            allChat : [...this.state.allChat, send]
        })

        Axios.post('http://localhost:8000/api/sendChat', {
            token: sessionStorage.getItem('token'),
            to_id : this.state.to_id,
            from_id : this.state.id,
            contents : this.state.content
        }).then(response => {
            this.setState({
                loading : false
            })
        })
    }

    getPartnerChat(id){
        Axios.post('http://localhost:8000/api/getOwner', {
            token: sessionStorage.getItem('token'),
            id : id
        }).then(response => {
            this.setState({
                partner : response.data.user
            })
        })
    }

    componentWillMount(){
        if(this.state.id == "") this.getUser();
        if(this.props.location.state != undefined){
            this.setState({
                to_id : this.props.location.state.to_id
            })
        }

    }

    componentDidMount(){
        document.body.style.overflow = "hidden"
        document.getElementById("chatDiv").style.overflowY = "scroll"
    }
    changeToId(to_id,from_id){
        if(to_id != this.state.id){
            this.setState({
                to_id : to_id
            },()=>this.getAllChat())
        }
        else{
            this.setState({
                to_id : from_id
            },()=>this.getAllChat())
        }
    }

    receiveChat(message){
        let receive
        receive = <Bubble message={message} type="partner"></Bubble>
        

        this.setState({
            allChat : [...this.state.allChat, receive]
        })
    }

    render(){
        let loading
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        return(
            <div>
                {loading}
                {this.checkUser()}
                <Container>
                    <NavBar></NavBar>
                    <Display>
                        <ListPartner>
                        {
                            this.state.chatList && this.state.chatList.map((chatList, key)=> (
                                <ListChat onClick={this.changeToId.bind(this,chatList.last_chat.to_id, chatList.last_chat.from_id)}>
                                    <p>{chatList.user.name}</p>                                    
                                    <p>{chatList.last_chat.contents}</p>
                                </ListChat>
                            ))
                        }

                        </ListPartner>
                        
                        <ChatDetail>
                            <div id="chatDiv" style={{display:'flex', flexDirection : 'column', height : '90%', width : '100%'}}>
                                {this.state.allChat}
                            </div>
                            <InputChat>
                                <input type="text" style={{textAlign : "left"}} name="content" onChange={this.dataChange.bind(this)} ></input>
                                <Buttons>
                                    <button onClick={ () => {
                                        this.props.send(this.state.to_id, this.state.id, this.state.content);
                                        this.sendChat();
                                    }}>Send</button>
                                </Buttons>
                            </InputChat>
                        </ChatDetail>
                    </Display>
                </Container>
            </div>
        )
    }
}

export default withRouter(Chat)