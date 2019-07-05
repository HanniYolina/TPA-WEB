import React from 'react'
import styled from 'styled-components'
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import Axios from 'axios'
import Loading from '../components/Loading'
import PostDetail from '../containers/PostDetail';
import {Redirect} from 'react-router-dom'

const Container = styled('div')`
    width : 100vw;
    height : 50vh;
    margin 0 auto;
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

const Main =styled('div')`
    background-color : white;
    width : 90%;
    height : auto;
    margin : 0 auto;
    margin-top : 5vh;
    margin-bottom : 5vh;
    border : 2px solid #3cba92;
    border-radius : 10px;
`
const EditButton = styled('div')`
    width : 20%;
    height : 8%;
    margin : 4%;
`
const Editor = styled('div')`
    margin : 10px;
    height : auto;
`

class ManagePostPage extends React.Component{
    constructor(){
        super();

        this.state = {
            page : "add",
            visibility : "private",
            newTag : false,
            tags : [],
            tagName : [],
            visibility : 'guest',
            title : "",
            pageNum : 1,

            filterRole : null,
            filterTag : null,
            filterTitle : null,
            filtered : false
        }
    }

    pageChange(ev){
        this.setState({
            page : ev.target.value
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
            if(ev.target.value == "null" && ev.target.value == ""){
                this.setState({
                    [ev.target.name] : null
                })    
            }
            else{
                this.setState({
                    [ev.target.name] : ev.target.value
                })
            }
        }
    }

    addTag(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/addTag', {
            token: sessionStorage.getItem('token'),
            name : this.state.newTagName
        }).then(response => {
            this.setState({
                loading : false
            })
        })
    }

    bold(ev){
        document.execCommand(ev.target.value, false, null);
    }

    image(){
        document.execCommand('insertImage', false, 'http://localhost:8000' +this.state.url)
    }

    newTag(){
        this.setState({
            newTag : this.state.newTag ? false : true
        })
    }
    
    getAllTag(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getAllTag', {
            token: sessionStorage.getItem('token'),
        }).then(response => {
            this.setState({
                allTag : response.data,
                loading : false
            })
        })
    }

    getTagNameById(id){
        this.setState({
            loading : true
        })
        Axios.post('http://localhost:8000/api/getTagNameById', {
            token: sessionStorage.getItem('token'),
            id : id
        }).then(response => {
            this.state.tagName.push(response.data);
            this.setState({
                loading : false
            })
        })
        
    }

    uploadImage(ev){
        ev.preventDefault();
        let formData = new FormData();
        formData.append('picture_name', document.getElementById('picture').files[0])
        
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/uploadImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            this.setState({
                url : response.data,
                loading : false,
            },()=>this.image());
            
        })
    }
    addPost(ev){
        ev.preventDefault();
        let formData = new FormData();
        formData.append('title', this.state.title);
        formData.append('content', document.getElementById('editor').innerText);
        formData.append('role', this.state.visibility)
        formData.append('picture_name', this.state.url)
        formData.append('tags', this.state.tags)

        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/addPost', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            this.setState({
                loading : false,
                post_id : response.data.id
            },()=>{
                if(response.data.status == "success"){
                    this.addDetailPost()
                    this.props.history.replace('/managePost');
                }
                else{
                    this.setState({
                        errorTitle : response.data.title,
                        errorTags : response.data.tags
                    })
                }
            });
        })
    }

    addDetailPost(){
        this.setState({
            loading : true
        })
        
        this.state.tags.forEach(element => {
            Axios.post(`http://localhost:8000/api/addDetailPost`, {
                token: sessionStorage.getItem('token'),
                post_id : this.state.post_id,
                tag_id : element
            })    
        });

        this.setState({
            loading : false
        });
        
    }
    getAllPost(){
        this.setState({
            loading : true
        })
        
        Axios.post(`http://localhost:8000/api/getAllPost?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token'),
        }).then(response => {
            this.setState({
                allPost : response.data.data,
                last_page : response.data.last_page,
                loading : false
            });
        })
    }

    getFilteredPost(){
        console.log(this.state.filterRole , this.state.filterTag, this.state.filterTitle)
        this.setState({
            loading : true
        })
        
        Axios.post(`http://localhost:8000/api/getFilteredPost?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token'),
            role : this.state.filterRole,
            tags : this.state.filterTag,
            title : this.state.filterTitle
        }).then(response => {
            this.setState({
                allPost : response.data.data,
                last_page : response.data.last_page,
                loading : false,
                filtered : false
            });
        })
    }

    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type != 3){
            if(this.state.type == 1){
                return <Redirect to="/"/>
            }
            else if(this.state.type == 2){
                return <Redirect to="/ownerDashboard"/>
            }
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
                type : response.data.user.type,
                loading : false
            })
        })
    }

    componentWillMount(){
        this.getUser();
        this.getAllTag();
        if(this.state.filtered == false) this.getAllPost();
    }

    changePageNum(){
        let curr = this.state.pageNum
        if(this.state.pageNum == this.state.last_page){
            this.setState({
                pageNum : 1
            }, ()=> {
                if(this.state.filtered){
                    this.getFilteredPost();
                }
                else{
                    this.getAllPost()
                }
            })
        }
        else{
            this.setState({
                pageNum : curr + 1
            }, ()=> {
                if(this.state.filtered){
                    this.getFilteredPost();
                }
                else{
                    this.getAllPost()
                }
            })
        }
    }

    filterPost(){
        this.setState({
            filtered : true
        }, ()=>this.getFilteredPost())
    }

    render(){
        let content
        let newTagField
        let filter
        if(this.state.newTag){
            newTagField = <Main style={{padding : '5%'}}>
                <label>Input New Tag</label>
                <input name="newTagName" required onChange={this.dataChange.bind(this)} placeholder="Tag Name"></input>
                <button onClick={this.addTag.bind(this)}>Add Tag</button>
            </Main>
        }
        if(this.state.page == "add"){
            content = 
            <div>
                <Main>
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
                    <Tab>
                        <EditButton><input type="file" id="picture"></input></EditButton>
                        <EditButton><input type="submit" onClick={this.uploadImage.bind(this)}></input></EditButton>
                    </Tab>
                    <Editor>
                        <div id="editor" contenteditable="true">
                            <h2>Your Post</h2>
                            <p>Here is your content</p>
                        </div>
                    </Editor>
                </Main>

                <br></br><br></br>
                <label>Title</label>
                <input placeholder="Title" name="title" onChange={this.dataChange.bind(this)}></input>
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

                <button onClick={this.newTag.bind(this)}>Add New Tag</button>

                {newTagField}
                <br></br><br></br>
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

                <button onClick={this.addPost.bind(this)}>Add New Post</button>
            </div>
        }
        else{
            content = <div>
            {
                this.state.allPost && this.state.allPost.map((post, key)=> (
                    <PostDetail post={post} key={key} type={this.state.page}></PostDetail>
                ))
            }
            <button onClick={this.changePageNum.bind(this)}>Next</button>
            </div>

            filter = 
                <Tab>
                    <select name="filterRole" required onChange={this.dataChange.bind(this)}>
                        <option name="filterRole" value="null">Choose Role</option>
                        <option name="filterRole" value="public">Public</option>
                        <option name="filterRole" value="owner">Owner</option>
                        <option name="filterRole" value="guest">Guest</option>
                        <option name="filterRole" value="admin">Admin</option>
                    </select>

                    <select name="filterTag" required onChange={this.dataChange.bind(this)}>
                        <option name="filterTag" value="null">Choose Tag</option>                    
                        {
                            this.state.allTag && this.state.allTag.map((tag, key)=> (
                                <option name="filterTag" value={tag.id}>{tag.name}</option>
                            ))
                        }       
                    </select>

                    <input placeholder="Input Title" name="filterTitle" onChange={this.dataChange.bind(this)}></input>
                    <button style={divStyle} onClick={this.filterPost.bind(this)}>Filter</button>                    
                </Tab>
        }
        
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        return(
            <div>
                {this.checkUser()}
                {loading}
                <Container>
                    <NavBar></NavBar>
                    <BreadCrumbs></BreadCrumbs>
                    <Tab>
                        <button style={divStyle} value="add" onClick={this.pageChange.bind(this)}>Add Post</button>
                        <button style={divStyle} value="update" onClick={this.pageChange.bind(this)}>Update Post</button>
                        <button style={divStyle} value="delete" onClick={this.pageChange.bind(this)}>Delete Post</button>
                    </Tab>

                    {filter}

                    {content}


                    
                </Container>
            </div>
        )
    }
}

export default ManagePostPage