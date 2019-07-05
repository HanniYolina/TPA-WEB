import React from 'react'
import Axios from 'axios'
import styled from 'styled-components'
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import PostDetail from '../containers/PostDetail'
import Loading from '../components/Loading'

const Container = styled('div')`
    width : 100vw;
    height : auto;
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

class GeneralPostPage extends React.Component{
    constructor(){
        super()

        this.state = {
            allPost : "",
            pageNum : 1,
            filtered : false,
            filterTag : null,
            filterTitle : null
        }
    }
    
    changePageNum(){
        let curr = this.state.pageNum
        if(this.state.pageNum == this.state.last_page){
            this.setState({
                pageNum : 1
            }, ()=> this.getFilteredPost())
        }
        else{
            this.setState({
                pageNum : curr + 1
            }, ()=> this.getFilteredPost())
        }
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
            if(ev.target.value == "null" || ev.target.value == ""){
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

    filterPost(){
        this.setState({
            filtered : true
        }, ()=>this.getFilteredPost())
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

    getUser(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getUser', {
            token: sessionStorage.getItem('token')
        }).then(response => {
            let role
            if(response.data.user.type == 3){
                role = "admin"
            }
            else if(response.data.user.type == 2){
                role = "owner"
            }
            else if(response.data.user.type == 1){
                role = "guest"
            }

            this.setState({
                type : response.data.user.type,
                filterRole : role,
                loading : false
            },()=>this.getFilteredPost())
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


    componentWillMount(){
        this.getAllTag()
        let role = null
        if(sessionStorage.getItem('token') == null){
            role = "public"
                
            this.setState({
                filterRole : role
            },()=>this.getFilteredPost())
        }
        else{
            this.getUser();
        }
    }
    

    render(){
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        return(
            <div>
                {loading}
                <Container>
                    <NavBar></NavBar>
                        <BreadCrumbs></BreadCrumbs>
                        <Tab>
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
                    {
                        this.state.allPost && this.state.allPost.map((post, key)=> (
                            <PostDetail post={post} key={key} type="view"></PostDetail>
                        ))
                    }
                    <button onClick={this.changePageNum.bind(this)}>Next</button>
                </Container>
            </div>
        )
    }
}

export default GeneralPostPage