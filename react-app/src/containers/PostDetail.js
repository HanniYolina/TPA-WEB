import React from 'react'
import {Link} from 'react-router-dom'
import Axios from 'axios'
import styled from 'styled-components'

const PostStyle = {
    height: '30vh',
    width: '20%',
    margin: '20px',
    padding: '15px',
    border: '2px grey solid',
    boxShadow : '6px 8px lightgrey'
}

const image = {
    width : '100%',
    height : '70%',
}

const PP = styled('div')`
    width : 100%;
    height : 70%;
    border : 2px solid #3cba92;
    margin-top : 2%;
    background-size: 100%;
    background-image:
`

class PostDetail extends React.Component{
    constructor(){
        super();

        this.state = {
            tagName : [],
        }
    }

    getTagNameById(id){
        Axios.post('http://localhost:8000/api/getTagNameById', {
            token: sessionStorage.getItem('token'),
            id : id
        }).then(response => {
            this.setState({
                tagName : [...this.state.tagName, <Link to={{pathname : `/searchPost/${id}`}}>{response.data}  </Link>]
            })
        })
    }

    componentWillMount(){
        let post = this.props.post
        let tags = post.tags.split(',')

        tags.forEach(element => {
            this.getTagNameById(element)      
        })
    }

    render(){

        // console.log(this.state.tagName)
        let post = this.props.post
        return(
        <div style={PostStyle}>
            <Link to={{pathname : `/post/${post.id}`, state : {type : this.props.type}}}>
                {post.picture_name ? <PP style={{backgroundImage: 'url(http://localhost:8000' + `${post.picture_name}` + ')'}}></PP> : null}
                <span>{post.title}</span>
                <br></br>
                <span>{post.created_at}</span>
                <br></br>
                {this.state.tagName}
            </Link>
        </div>
    )}
}

export default PostDetail