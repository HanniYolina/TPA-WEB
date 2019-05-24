import React from 'react'
import {Link} from 'react-router-dom'
import searchLogo from '../assets/searchLogo.png'

const SearchForm = () =>{
    return(
        <div>
            <input type="text"/>
            <Link to='/'><img src={searchLogo} id="logo" style={{float: 'right'}}></img></Link>
        </div>
    )
}

export default SearchForm