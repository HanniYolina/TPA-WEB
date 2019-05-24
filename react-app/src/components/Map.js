import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import styled from 'styled-components'
import Axios from 'axios'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

const Wrapper = styled.div`
    width : 100%;
    height : 500px; 
`

const mapContainer = {
    padding : '50px'
}
var marker = {};

class Map extends React.Component{
    mapClick(e){
        
        if (marker) { // check
            this.mymap.removeLayer(marker); // remove
        }
        console.log(L);

        marker = L.marker(
            L.latLng(
            parseFloat(e.latlng.lat),
            parseFloat(e.latlng.lng)
            )
        ).addTo(this.mymap);
        

        var path = `https://us1.locationiq.com/v1/reverse.php?key=899758dd3d8f41&lat=${parseFloat(e.latlng.lat)}&lon=${parseFloat(e.latlng.lng)}&format=json`
        
        Axios.get(path).then(response => {
            // console.log(response)
            this.props.onMapClicked(response.data);
        })
    }

    componentDidMount(){
        let lat;
        let long;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( (position)=> {
                lat = position.coords.latitude;
                long = position.coords.longitude;

                this.mymap = L.map('map').setView([lat, long], 17);
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    maxZoom: 25,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoiZG91Z2xhc3N0aG9tYXMiLCJhIjoiY2p2OHNkYmR5MGU3bTRkbzRsdnFxZnV0NiJ9.H6mZ7MiojSngltoufzk7tw'
                }).addTo(this.mymap);

                marker = L.marker(
                    L.latLng(
                    parseFloat(lat),
                    parseFloat(long)
                    )
                ).addTo(this.mymap);
                
                this.mymap.on("click",(e)=> this.mapClick(e));
            });
        }
    }

    render(){
        return(
            <div>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"
                    integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
                    crossOrigin=""/>

                <script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"
                    integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
                    crossOrigin=""></script>

                <div style={mapContainer}>
                <span>Location</span>
                    <Wrapper id='map'/>
                </div>
            </div>
        ) 
    }
}

const action = dispatch=>{
    return {
        onMapClicked : (value) => dispatch({
            type : 'storeMap',
            value : value
        })
    }
}
export default withRouter(connect(null, action)(Map))
