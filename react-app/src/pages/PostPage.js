import React from 'react'
import {Link} from 'react-router-dom'
import SearchBar from '../containers/SearchBar';
import Map from '../components/Map';
import styled from 'styled-components'
import Axios from 'axios';
import Loading from '../components/Loading'
import PopUp from '../components/PopUp';
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import PostDetail from '../containers/PostDetail'

const Main =styled('div')`
    background-color : white;
    width : 90%;
    height : 80%;
    margin : 0 auto;
    margin-top : 5vh;
    margin-bottom : 5vh;
    border : 2px solid #3cba92;
    border-radius : 10px;
    padding : 3%;
`

const Image = styled('div')`
    height : 50vh;
    width : 80vw;
    border : 2px solid #3cba92;
    margin : 0 auto;
    background-size: cover;
    background-repeat:no-repeat
`
const Tab = styled('div')`
    display : flex;
    width : 50%;
`

const divStyle = {
    width : '30%',
    height : '10%',
    backgroundColor : 'white',
    border : '2px solid #3cba92',
    margin : '0 auto',
    marginTop : '5vh',
    textAlign : 'center',
    fontSize : '100%',
    borderRadius: '10px',
}

const EditButton = styled('div')`
    width : 20%;
    height : 5%;
    margin : 4%;
`
const Editor = styled('div')`
    margin : 10px;
`
class PostPage extends React.Component{
    constructor(){
        super();

        this.state = {
            type : "",
            post : "",
            delete : false,
            confirm : "",
            popup : "",
            tagName : [],
            picture_name : null,
            recommendedPost : null
        }
    }
   
    getPost(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/getPostById`, {
            id : this.props.match.params.id,
            token: sessionStorage.getItem('token')
        }).then(response => {
            
            this.setState({
                post : response.data,
                title : response.data.title,
                content : response.data.content,
                tags : response.data.tags,
                visibility : response.data.visibility,
                picture_name : response.data.picture_name,
                loading : false
            }, ()=>{
                this.getTagById()
                this.getAllRecommendedPost()
            })
        })
    }

    getTagById(){
        let tags = this.state.post.tags.split(',');
        for(let i=0; i<tags.length; i++){
            Axios.post(`http://localhost:8000/api/getTagNameById`, {
                id : tags[i],
                token: sessionStorage.getItem('token')
            }).then(response => {
                this.state.tagName.push(response.data)
            })
        }        
    }

    componentWillMount(){
        this.getPost();
    }

    deletePost(){
        this.setState({
            delete : true
        })
    }

    deleteFromDB(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/deletePost`,{
            token: sessionStorage.getItem('token'),
            id : this.state.post.id
        }).then(response => {
            this.setState({
                message : response.message,
                loading : false
            })
        })
        this.props.history.replace('/managePost');
    }

    buttonPopup(value){
        this.setState({
            popup : value,
            delete : false
        })
    }

    dataChange(ev){
        if(ev.target.type == "file"){
            this.setState({
                [ev.target.name] : ev.target.files[0]
            }) 
        }
        else if(ev.target.name == "tags"){
            this.state.tags.push(ev.target.value);
            this.getTagNameById(ev.target.value);
        }
        else{
            this.setState({
                [ev.target.name] : ev.target.value
            })
        }
    }
    
    updatePost(ev){
        ev.preventDefault();
        let formData = new FormData();
        formData.append('id', this.state.post.id);
        formData.append('title', this.state.title);
        formData.append('content', document.getElementById('editor').innerText);
        formData.append('role', this.state.visibility)
        formData.append('picture_name', this.state.picture_name)
        formData.append('tags', this.state.tags)

        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/updatePost', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            this.setState({
                loading : false,
            });
            if(response.data.status == "success"){
                this.props.history.replace('/managePost');
            }
            else{
                this.setState({
                    errorTitle : response.data.title,
                    errorTags : response.data.tags
                })
            }
        })

    }

    getAllRecommendedPost(){
        console.log(this.state.post.id)
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/getAllRecommendedPost`,{
            id : this.state.post.id
        }).then(response => {
            this.setState({
                recommendedPost : response.data,
                loading : false
            })
        }) 
    }


    render(){
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        let button;
        let page;
        if(this.props.location.state.type == "update"){
            page = <Main>
            <div>
                <Tab>
                    <EditButton><input type="submit" value="bold" onClick={this.bold}></input></EditButton>
                    <EditButton><input type="submit" value="underline" onClick={this.bold}></input></EditButton>
                    <EditButton><input type="submit" value="italic" onClick={this.bold}></input></EditButton>
                </Tab>
                <Tab>
                    <EditButton><input type="submit" value="justifyCenter" onClick={this.bold}></input></EditButton>
                    <EditButton><input type="submit" value="justifyFull" onClick={this.bold}></input></EditButton>
                    <EditButton><input type="submit" value="justifyLeft" onClick={this.bold}></input></EditButton>
                    <EditButton><input type="submit" value="justifyRight" onClick={this.bold}></input></EditButton>
                </Tab>
                <Editor>
                    <div id="editor" contenteditable="true">
                        {this.state.post.content}
                    </div>
                </Editor>

                <br></br><br></br>
                <label>Title</label>
                <input placeholder="Title" name="title" onChange={this.dataChange.bind(this)} placeholder={this.state.post.title}></input>
                <br></br>
                {this.state.errorTitle}

                <br></br><br></br>
                <label>Visibility  </label>
                <select name="visibility" required onChange={this.dataChange.bind(this)}>
                    <option name="visibility" value="guest">Guest</option>
                    <option name="visibility" value="owner">Owner</option>
                    <option name="visibility" value="admin">Admin</option>
                    <option name="visibility" value="public">Public</option>
                </select>

                <br></br><br></br>
                <label>Picture</label>
                <input type="file" name="picture" onChange={this.dataChange.bind(this)}></input>
                {
                    this.state.tagName && this.state.tagName.map((tagName, key)=> (
                        <span>{tagName}  </span>
                    ))
                }

                <br></br><br></br>
                <label>Tags</label> 
                <select name="tags" required onChange={this.dataChange.bind(this)}>
                <option>--Choose</option>
                {
                    this.state.allTag && this.state.allTag.map((tag, key)=> (
                        <option name="tags" value={tag.id}>{tag.name}</option>
                    ))
                }
                </select>
                <br></br>
                {this.state.errorTags}

            </div>
            </Main>
            button = <button onClick={this.updatePost.bind(this)}>Update Post</button>
        }
        else if(this.props.location.state.type == "delete"){
            page = <div>
                <h4>Do you want to delete this post?</h4>
                <Main>
                    {this.state.post.picture_name ? <Image style={{backgroundImage: 'url(http://localhost:8000' + `${this.state.post.picture_name}` + ')'}}></Image> : null}
                    <h2>{this.state.post.title}</h2>
                    {
                        this.state.tagName && this.state.tagName.map((tagName, key)=> (
                            <span>{tagName}  </span>
                        ))
                    }
                    <p>{this.state.post.content}</p>
                </Main>
            </div>
            button = <button onClick={this.deletePost.bind(this)}>Delete</button>
        }
        else{
            console.log(this.state.tagName)
            page = <div>
                <Main>
                    {this.state.post.picture_name ? <Image style={{backgroundImage: 'url(http://localhost:8000' + `${this.state.post.picture_name}` + ')'}}></Image> : null}
                    <p>{this.state.post.updated_at}</p>
                    <h2>{this.state.post.title}</h2>
                    {
                        this.state.tagName && this.state.tagName.map((name, key)=> (
                            <span>{name}  </span>
                        ))
                    }
                    <p>{this.state.post.content}</p>
                </Main>

                <div>
                    <p>Recommended Post</p>
                    {
                        this.state.recommendedPost && this.state.recommendedPost.map((post, key)=> (
                            <PostDetail post={post} key={key} type="view"></PostDetail>
                        ))
                    }
                </div>
            </div>
        }
        

        let deleteButton
        if(this.state.delete){
            deleteButton = <PopUp text="Are you sure to delete?" type="delete" buttonPopup={this.buttonPopup.bind(this)}></PopUp>
        }
        else{
            if(this.state.popup == "delete"){
                this.deleteFromDB()
            }
        }

        return(
            <div>
                {loading}
                <NavBar></NavBar>
                <BreadCrumbs></BreadCrumbs>
                {page}
                {button}
                {deleteButton}
            </div>
        )
    }
}

export default PostPage