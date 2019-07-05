import React from 'react'
import Axios from 'axios'
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import PostDetail from '../containers/PostDetail';
import styled from 'styled-components'

const Container = styled('div')`
    width : 100vw;
    height : 50vh;
    margin 0 auto;
`

class SearchPost extends React.Component{
    constructor(){
        super();

        this.state = {
            pageNum : 1,
            allPost : null,
            tags : null
        }
    }

    getFilteredPost(){
        console.log(this.state.filterRole , this.state.filterTag, this.state.filterTitle)
        this.setState({
            loading : true
        })
        
        Axios.post(`http://localhost:8000/api/getFilteredPost?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token'),
            role : null,
            tags : this.state.tags,
            title : null
        }).then(response => {
            console.log(response.data)
            this.setState({
                allPost : response.data.data,
                last_page : response.data.last_page,
                loading : false,
                filtered : false
            });
        })
    }

    componentDidMount(){
        this.setState({
            tags : this.props.match.params.tag_id
        },()=>{
            if(this.state.allPost == null){
                this.getFilteredPost();
            }
        })
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

    render(){
        return(
            <div>
                <Container>
                    <NavBar></NavBar>
                    <BreadCrumbs></BreadCrumbs>
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

export default SearchPost