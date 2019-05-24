import React from 'react';
import {Link} from 'react-router-dom'
import gpsLogo from '../assets/gpsLogo.png'
import BackToMainMenu from '../components/BackToMainMenu'
import SearchForm from '../components/SearchForm';

const searchBar = {
    justifyContent : 'center',
    marginLeft: '20%',
    marginRight: '20%',
    padding: '5%',
    border : '2px solid #3cba92'
}
const location = {
    height : '50px',
    paddingTop : '20px'
}

const SearchPage = () => {
    return(
        <div>
            <BackToMainMenu></BackToMainMenu>
            <div style={searchBar}>
                <SearchForm></SearchForm>

                <Link to='/'>
                <div style={location}>
                    <img src={gpsLogo} id="logo"></img>
                    <span>Search near my location</span>
                </div>
                </Link>
            </div>
        </div>
    )
}

export default SearchPage