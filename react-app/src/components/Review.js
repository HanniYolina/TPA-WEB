import React from 'react'
import styled from 'styled-components'
import Axios from 'axios'
import {Link} from 'react-router-dom'

const Style = styled('div')`
    width : 100vw-5%;
    padding-left : 5%;
`

const ButtonReply = styled('div')`
    width : 10%;
    background-color : #3cba92;
    text-align : center;
`

class Review extends React.Component{
    constructor(){
        super();

        this.state = {
            replyBoolean : false,
            allChild : null,
            user : ""
        }
    }

    replyLayout(){
        if(this.state.replyBoolean){
            this.setState({
                replyBoolean : false
            })
        }
        else{
            this.setState({
                replyBoolean : true
            })
        }
    }

    addReview(properties_id, parent_id, user_id){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/addReview`,{
            token: sessionStorage.getItem('token'),
            properties_id : properties_id,
            contents : this.state.contents,
            parent_id : parent_id,
            user_id : user_id,
        }).then(response => {
            this.setState({
                loading : false,
            },()=>{
                this.replyLayout()
            })
        })
    }

    getAllReview(properties_id,parent_id){
        // console.log('>>> ' + properties_id, parent_id)

        this.setState({
            loading : true, 
            allChild : []
        });
        Axios.post(`http://localhost:8000/api/getAllReview`,{
            token: sessionStorage.getItem('token'),
            properties_id : properties_id,
            parent_id : parent_id,
            type : "child"
        }).then(response => {
            this.setState({
                allChild : response.data,
                loading : false,
                last_page : response.data.last_page
            })
        })
    }

    getUser(user_id){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getOwner', {
            token: sessionStorage.getItem('token'),
            id : user_id
        }).then(response => {
            this.setState({
                status : response.status,
                user : response.data.user,
                type : response.data.user.type,
                path : response.data.path,
                loading : false
            })
        })    
        
    }

    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }

    componentDidMount(){
        let parent_id = this.props.review.id
        let properties_id = this.props.properties_id
        this.getAllReview(properties_id,parent_id)
        this.getUser(this.props.review.user_id);
    }

    render(){
        let review = this.props.review
        let parent_id = review.id
        let properties_id = this.props.properties_id
        let user_id = this.props.user_id
        let reply
        if(this.state.replyBoolean){
            reply = 
            <div style={{display : 'flex'}}>
                <br></br>
                <input style={{width : '40%'}} type="text" placeholder="Input Review" name="contents" onChange={this.dataChange.bind(this)}></input>
                <ButtonReply onClick={this.addReview.bind(this, properties_id, parent_id, user_id)}>Add Reply</ButtonReply>                            
            </div>
        }
        
        let child
        child = <div>
            {
                this.state.allChild && this.state.allChild.map((child, key)=> (
                    <Review review={child} properties_id={properties_id} user_id={user_id}></Review>
                ))
            }
        </div>
    
        let reviewer
        if(this.state.type == 1){
            reviewer = <Link to={{pathname : `/guestProfilePage/${this.state.user.id}`, state : {user : this.state.user, path : this.state.path}}}>{this.state.user.name}</Link>
        }
        else if(this.state.type == 2){
            reviewer = <Link to={{pathname : `/ownerProfile/${this.state.user.id}`}}>{this.state.user.name}</Link>
        }
        return(
            <Style>
                <i className="fa fa-tag"></i>
                {reviewer}
                <p>{review.contents}</p>
                <ButtonReply onClick={this.replyLayout.bind(this)}>Reply</ButtonReply>
                {child}
                {reply}
                <br></br>
            </Style>
        )}
}

export default Review