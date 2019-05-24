import React from 'react'
import {Link} from 'react-router-dom'
import SearchForm from '../components/SearchForm'
import logoImg from '../assets/logo.png';

const navStyle = {
    backgroundColor: '#3cba92',
    padding:'20px',
    position: 'sticky',
    top: '0'
}

const searchForm ={
    backgroundColor : 'white',
    width: '30%',
}

const SearchBar = () =>{
    return(
        <div style={navStyle}>
            <Link to='/'><img src={logoImg} id="logo"></img></Link>
            <div style={searchForm}>
                <SearchForm></SearchForm>
            </div>
        </div>
    )
}

export default SearchBar