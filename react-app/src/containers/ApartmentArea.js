import React from 'react'
import apartLogo from '../assets/apartmentLogo.png'

const image = {
    width : '100px'
}

const ApartmentArea = () =>{
    return(
        <div style={{textAlign : 'center'}}>
            <img src={apartLogo} style={image}></img>
            <h2 style={{color : '#3cba92'}}>APARTMENT AREA</h2>
            <p>Carilah Apartment di area yang kamu mau</p>
        </div>
    )
}

export default ApartmentArea