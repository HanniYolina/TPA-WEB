import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import styled from 'styled-components'
import Axios from 'axios'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import markerIcon from '../assets/markerIcon.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Wrapper = styled.div`
    width : 100%;
    height : 500px; 
`

const mapContainer = {
    padding : '50px'
}
var marker = {};
var randomMarker = [];

var greenIcon = L.icon({
    iconUrl: markerIcon,

    iconSize:     [38, 50], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

class Map extends React.Component{
    mapClick(e){
        
        if (marker) { // check
            this.mymap.removeLayer(marker); // remove

            if(this.props.search == "true"){
                for(let i=0; i<randomMarker.length; i++){
                    this.mymap.removeLayer(randomMarker[i])
                }
                const min = -0.005;
                const max = 0.005;
                for(let i=0; i<5; i++){
                    const randLat = min + Math.random() * (max - min);
                    const randLong = min + Math.random() * (max - min);
                    const newLat = parseFloat(e.latlng.lat)+randLat;
                    const newLong = parseFloat(e.latlng.lng)+randLong;
                    var marks = L.marker(L.latLng(parseFloat(newLat), parseFloat(newLong)),{icon : greenIcon}).addTo(this.mymap);
                    this.countProperties(newLat, newLong, marks)
                }
            }
        }

        if(this.props.point){
            this.props.point(parseFloat(e.latlng.lat), parseFloat(e.latlng.lng));
            this.props.clearAll();
        }
        marker = L.marker(
            L.latLng(
            parseFloat(e.latlng.lat),
            parseFloat(e.latlng.lng)
            )
        ).addTo(this.mymap);
        

        var path = `https://us1.locationiq.com/v1/reverse.php?key=899758dd3d8f41&lat=${parseFloat(e.latlng.lat)}&lon=${parseFloat(e.latlng.lng)}&format=json`
        
        Axios.get(path).then(response => {
            this.props.onMapClicked(response.data);
        })
    }

    onMarkerClicked(marks){
        var point = marks.getLatLng()
        if(this.props.point){
            this.props.point(point.lat, point.lng, "fromMarker");
        }
    }

    countProperties(lat, long, marks){
        Axios.post("http://localhost:8000/api/getRadius",
            {
                latitude : lat,
                longitude : long,
            }
            ).then(response => {
                var count = response.data
                marks.bindPopup("There is " + count + " properties near this area").on('click', this.onMarkerClicked.bind(this,marks));

                randomMarker.push(marks)
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

                if(this.props.search == "true"){
                    const min = -0.01;
                    const max = 0.01;
                    for(let i=0; i<5; i++){
                        const randLat = min + Math.random() * (max - min);
                        const randLong = min + Math.random() * (max - min);
                        const newLat = lat+randLat;
                        const newLong = long+randLong;
                        var marks = L.marker(L.latLng(parseFloat(newLat), parseFloat(newLong)), {icon : greenIcon}).addTo(this.mymap);
                        this.countProperties(newLat, newLong, marks)
                    }
                }
                this.mymap.on("click",(e)=> this.mapClick(e));
            });
        }
    }

    componentWillUnmount(){
        this.mymap = null;
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
