import React from 'react'
import {Link} from 'react-router-dom'
import searchLogo from '../assets/searchLogo.png'
import styled from 'styled-components'
import Axios from 'axios'

const Container = styled('div')`
    width : 30vw;
    display : flex;
    margin : 0 auto;
    flex-direction : column;
    position : relative;
`
const SearchResult = styled('div')`
    height : auto;
    background-color : lightgrey
    width : 30vw;
    top : 18px;
    text-align : center;
`

class SearchForm extends React.Component{
    constructor(){
        super();

        this.state = {
            result : [],
            keyword : ""
        }
    }
    search(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/search', {
            keyword : document.getElementById('keyword').value
        }).then(response => {
            this.setState({
                result : response.data,
            }, ()=>console.log(this.state.result))
        })
    }

    onFocus(){
        if (this.state.keyword=="" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( (position)=> {
                let lat = position.coords.latitude;
                let long = position.coords.longitude;

                // console.log(lat,long)
                this.setState({
                    loading : true
                })

                Axios.post("http://localhost:8000/api/getNearestKost",
                    {
                            token: sessionStorage.getItem('token'),
                            latitude : lat,
                            longitude : long,
                            type : "get"
                    }
                    ).then(response => {
                        let responseData = response.data.slice(0,3)
                        let tempKost = this.state.result
    
                        responseData.forEach(element => {
                            tempKost.push(element)
                        });

                        this.setState({
                            result : tempKost,
                        })
                    })
                Axios.post("http://localhost:8000/api/getNearestApartment",
                {
                        token: sessionStorage.getItem('token'),
                        latitude : lat,
                        longitude : long,
                        type : "get"
                }
                ).then(response => {
                    let responseData = response.data.slice(0,3)
                    let tempKost = this.state.result

                    responseData.forEach(element => {
                        tempKost.push(element)
                    });

                    this.setState({
                        result : tempKost,
                        loading : false,
                    })
                })
            })
        }
    }
    render(){
        return(
            <Container>
                <input type="text" id="keyword" onChange={this.search.bind(this)} autoComplete="off" 
                 onFocus={this.onFocus.bind(this)} 
                />

                <div style={{position : 'absolute', paddingTop : '18px'}}>
                    {
                        this.state.result && this.state.result.map((result, key)=> (
                            <Link to={{pathname : `/room/${result.id}`, state : {type : 'view'}}}>       
                                <SearchResult>{result.name}</SearchResult>                     
                            </Link>
                        ))
                    }    
                </div>              

            </Container>
        )
    }
}

export default SearchForm