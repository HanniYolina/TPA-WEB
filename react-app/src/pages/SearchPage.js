import React from 'react';
import styled from 'styled-components'
import NavBar from '../containers/NavBar';
import Map from '../components/Map';
import Axios from 'axios'
import RoomDetail from '../containers/RoomDetail';
import Loading from '../components/Loading';

const Container = styled('div')`
    width : 100vw;
    height : auto;
`

const Tab = styled('div')`
    display : flex;
`
const divStyle = {
    width : 'auto',
    height : '8%',
    backgroundColor : 'white',
    border : '2px solid #3cba92',
    margin : '0 auto',
    marginTop : '5vh',
    textAlign : 'center',
    fontSize : 'auto',
    borderRadius: '10px',
}

class SearchPage extends React.Component {
    constructor(){
        super();

        this.state = {
            page : 'kost',
            lat : '',
            lng : '',
            urlKost : `http://localhost:8000/api/getNearestKost?page=1`, 
            urlApartment : `http://localhost:8000/api/getNearestApartment?page=1`, 
            kost : [],
            apartment : [],

            loading  : false,
            loadedAll : false,
            loadCount : 0,
            filtered : false
        }
    }

    pageChange(ev){
        this.setState({
            page : ev.target.value,
            loadCount : 0
        })
    }

    clearAll(){
        this.setState({
            kost : [],
            apartment : []
        })
    }

    changePoint(lat,lng,type){
        if(lat != this.state.lat && lng != this.state.lng){
            if(lat == null && lng == null){
                lat = this.state.lat
                lng = this.state.lng
            }
            else{
                this.setState({
                    lat : lat,
                    lng : lng,
                })
            }
    
            // console.log(lat, lng, this.state.loadCount, this.state.page, this.state.urlKost)    
            if(lat !="" && lng != "" && this.state.loadCount == 0){
                if(this.state.page == 'kost' && this.state.urlKost != null){
                    this.setState({
                        loading : true,
                        loadCount : 1,
                        filtered : false
                    })
    
                    console.log("Tes")
                    Axios.post(this.state.urlKost,
                    {
                            token: sessionStorage.getItem('token'),
                            latitude : lat,
                            longitude : lng
                    }
                    ).then(response => {
                        let responseData = response.data.data
                        let tempKost = this.state.kost
    
                        // console.log("Point",lat,lng, response.data)
    
                        let newUrl = "http://localhost:8000/api/getNearestKost?page=1"
                        if(type == "fromMarker"){
                            tempKost = responseData
                        }
                        else if(type == "scroll"){
                            newUrl = response.data.next_page_url
                        }
                        else{
                            responseData.forEach(element => {
                                tempKost.push(element)
                            });
                        }

                        this.setState({
                            kost : tempKost,
                            urlKost : newUrl,
                            loading : false,
                            loadCount : 0
                        })
                    })
                }
                else if(this.state.page == 'apartment' && this.state.urlApartment != null){
                    this.setState({
                        loading : true,
                        loadCount : 1,
                        filtered : false
                    })
    
                    Axios.post(this.state.urlApartment,
                    {
                        token: sessionStorage.getItem('token'),
                        latitude : lat,
                        longitude : lng
                    }
                    ).then(response => {
                        let responseData = response.data.data
                        let tempApartment = this.state.apartment
    

                        // console.log("Point",lat,lng, response.data)

                        let newUrl = "http://localhost:8000/api/getNearestApartment?page=1"
                        if(type == "fromMarker"){
                            tempApartment = responseData
                        }
                        else if(type == "scroll"){
                            newUrl = response.data.next_page_url
                        }
                        else{
                            responseData.forEach(element => {
                                tempApartment.push(element)
                            });
                        }
    
                        this.setState({
                            apartment : tempApartment,
                            urlApartment : newUrl,
                            loading : false,
                            loadCount : 0
                        })
                    })
                }
                
            }
    
            else{
                window.removeEventListener('scroll', this.registerScrollEvent.bind(this))    
            }
        }
        
    }

    registerScrollEvent(){
        // console.log(window.innerHeight + window.scrollY, document.body.offsetHeight)
        if(window.innerHeight + window.scrollY >= document.body.offsetHeight + 30){
            if(this.state.loadCount == 0){
                this.changePoint(this.state.lat, this.state.lng, "scroll");
            }
        }
    }

    componentDidMount(){
        window.addEventListener('scroll', this.registerScrollEvent.bind(this))
    
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.registerScrollEvent.bind(this))
    }
    
    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }


    filter(){
        if(this.state.page == 'kost'){
            this.setState({
                urlKostFilter : "http://localhost:8000/api/getNearestKost?page=1",
                urlKost : "http://localhost:8000/api/getNearestKost?page=1",
                filteredKost : null,
                filtered : true,
                kost : []
            }, ()=>{
                Axios.post(this.state.urlKostFilter,
                    {
                        token: sessionStorage.getItem('token'),
                        latitude : this.state.lat,
                        longitude : this.state.lng,
                        name : this.state.filterName
                    }
                    ).then(response => {
                        console.log(this.state.kost)
                        let responseData = response.data.data
                        let tempKost = []
    
                        responseData.forEach(element => {
                            tempKost.push(element)
                        });
    
                        this.setState({
                            filteredKost : tempKost,
                            urlKostFilter : response.data.next_page_url,
                            loading : false,
                            loadCount : 0
                        })
                })
            })
        }
        if(this.state.page == 'apartment'){
            this.setState({
                urlApartmentFilter : "http://localhost:8000/api/getNearestApartment?page=1",
                urlApartment : "http://localhost:8000/api/getNearestApartment?page=1",
                filteredApartment : null,
                filtered : true,
                apartment : []
            }, ()=>{
                Axios.post(this.state.urlApartmentFilter,
                    {
                        token: sessionStorage.getItem('token'),
                        latitude : this.state.lat,
                        longitude : this.state.lng,
                        name : this.state.filterName
                    }
                    ).then(response => {
                        let responseData = response.data.data
                        let tempKost = []
    
                        responseData.forEach(element => {
                            tempKost.push(element)
                        });
    
                        this.setState({
                            filteredApartment : tempKost,
                            urlApartmentFilter : response.data.next_page_url,
                            loading : false,
                            loadCount : 0
                        })
                })
            })
        }
    }

    render(){
        let page;
        let filter
        if(this.state.kost != 0 || this.state.apartment != 0){
            filter = <div>
                <input type="text" name="filterName" style={{width : "50%"}} onChange={this.dataChange.bind(this)} placeholder="input name"></input>
                <button style={divStyle} onClick={this.filter.bind(this)}>Filter</button>
            </div>
        }
        if(this.state.page == 'kost'){
            if(this.state.filtered){
                page = <div>
                    {filter}
                    {
                        this.state.filteredKost && this.state.filteredKost.map((room, key)=> (
                            
                            <RoomDetail room={room} key={key}></RoomDetail>
                        ))
                    }
                </div>    
            }
            else{
                page = <div>
                {filter}
                {
                    this.state.kost && this.state.kost.map((room, key)=> (
                        
                        <RoomDetail room={room} key={key}></RoomDetail>
                    ))
                }
            </div>
            }             
        }
        else if(this.state.page == 'apartment'){
            if(this.state.filtered){
                page = <div>
                    {filter}
                    {
                        this.state.filteredApartment && this.state.filteredApartment.map((room, key)=> (
                            
                            <RoomDetail room={room} key={key}></RoomDetail>
                        ))
                    }
                </div>    
            }
            else{
                page = <div>
                    {filter}
                    {
                        this.state.apartment && this.state.apartment.map((room, key)=> (
                            
                            <RoomDetail room={room} key={key}></RoomDetail>
                        ))
                    }
                </div>
            }
        }

        let loadedAll
        if(this.state.urlKost == null && this.state.page == "kost"){
            loadedAll = <p>All Kost have been loaded</p>
        }

        if(this.state.urlApartment == null && this.state.page == "apartment"){
            loadedAll = <p>All Apartment have been loaded</p>
        }

        let loading;
        if(this.state.loading){ 
            loading = <Loading></Loading>
        }

        return(
            <div>
                {loading}
                <Container>
                    <NavBar></NavBar>
                    <Tab>
                        <button style={divStyle} value="kost" onClick={this.pageChange.bind(this)}>Kost</button>
                        <button style={divStyle} value="apartment" onClick={this.pageChange.bind(this)}>Apartment</button>
                    </Tab>
                    <Map point={this.changePoint.bind(this)} page={this.state.page} clearAll={this.clearAll.bind(this)} search="true"></Map>
                    {page}
                    {loadedAll}
                </Container>
            </div>
        )
    }
}

export default SearchPage