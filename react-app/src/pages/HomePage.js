import React from 'react'
import {Link} from 'react-router-dom';
import RoomDetail from '../containers/RoomDetail';
import ApartmentArea from '../containers/ApartmentArea';
import Axios from 'axios';
import Loading from '../components/Loading'
import Footer from '../components/Footer';

const titleStyle = {
    color: 'black',
    fontSize: '40px',
    padding: '20px',
}
const searchHeader = {
    paddingTop : '200px',
    paddingLeft: '10%',
    paddingRight: '10%',
    margin: '0 auto',
    textAlign: 'center',
}

const descStyle = {
    color: 'black',
    fontSize: '20px',
    padding: '20px'
}

const searchBar = {
    backgroundColor : 'white',
    height: '100px',
    margin: '30px',
    padding: '0'
}

const searchButton = {
    color : 'grey',
    border : 'none',
    borderBottom : '2px solid #3cba92',
}

class HomePage extends React.Component{
    constructor(){
        super();

        this.state = {
            room : null,
            urlKost : `http://localhost:8000/api/getNearestKost?page=1`, 
            urlApartment : `http://localhost:8000/api/getNearestApartment?page=1`, 

            nearestKost : [],
            nearestPremiumKost : [],

            nearestApartment : [],
            nearestPremiumApartment : [],

            loadCount : 0,
            loading : false
        }
    }

    getNearestandPremiumKost(){
        let lat;
        let long;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( (position)=> {
                lat = position.coords.latitude;
                long = position.coords.longitude;

                this.setState({
                    loading : true,
                    loadCount : 1
                })

                Axios.post(this.state.urlKost,
                {
                        latitude : lat,
                        longitude : long
                }
                ).then(response => {
                    this.setState({
                        nearestKost : response.data.data,
                        urlKost : response.data.next_page_url,
                        loading : false,
                        loadCount : 0
                    }, ()=>this.checkPremium())
                })
            });
        }
    }

    getNearestandPremiumApartment(){
        let lat;
        let long;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( (position)=> {
                lat = position.coords.latitude;
                long = position.coords.longitude;

                this.setState({
                    loading : true,
                    loadCount : 1
                })

                Axios.post(this.state.urlApartment,
                {
                        latitude : lat,
                        longitude : long
                }
                ).then(response => {
                    this.setState({
                        nearestApartment : response.data.data,
                        urlApartment : response.data.next_page_url,
                        loading : false,
                        loadCount : 0
                    }, ()=>this.checkPremiumApartment())
                })
            });
        }
    }

    checkPremium(){
        this.state.nearestKost.forEach(element => {
            Axios.post('http://localhost:8000/api/getPremiumOwnerById',{
                user_id : element.user_id
            }).then(response => {
                if(response.data != null){
                    this.setState({
                        nearestPremiumKost : [...this.state.nearestPremiumKost, element]
                    },()=>console.log(this.state.nearestPremiumKost))
                }
            }) 
        });
    }

    checkPremiumApartment(){
        this.state.nearestApartment.forEach(element => {
            Axios.post('http://localhost:8000/api/getPremiumOwnerById',{
                user_id : element.user_id
            }).then(response => {
                if(response.data != null){
                    this.setState({
                        nearestPremiumApartment : [...this.state.nearestPremiumApartment, element]
                    })
                }
            }) 
        });
    }

    getProperties(){
        this.getNearestandPremiumKost();
        this.getNearestandPremiumApartment();
        this.setState({
            loading : true
        });
        Axios.post('http://localhost:8000/api/getRoom').then(response => {
            this.setState({
                kost : response.data.kost,
                apartment : response.data.apartment
            }, ()=> {
                this.setState({
                    loading : false
                });
                // console.log(this.state.room);
            })
        })
    }
    
    componentDidMount(){
        this.getProperties();
    }

    render(){
        let load;
        if(this.state.loading) load = <Loading></Loading> 
    return(
        <div>
            {load}
            <div id="headerBackground">
                <Link to="/"></Link>
                <div style={searchHeader}>
                    <span style={titleStyle}>Mau cari kos kosan?</span>
                    <br></br>
                    <span style={descStyle}>Dapatkan info kost murah, kost harian, kost bebas, dan info kosan lainnya di Mamikos!</span>
                    <div style={searchBar}>
                        <form>
                            <div className="formInput">
                                <label htmlFor="location"><span>Choose Location </span></label>
                                <br></br>
                                <Link style={searchButton} to="/search">Cari nama tempat atau alamat</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div style={{marginLeft : '20px'}}> 
                <span>Rekomendasi Kamar Kost untuk anda di </span>
                <select style={{boxShadow : '2px 4px lightgrey'}}>
                    <option>Jakarta</option>
                    <option>Bandung</option>
                </select>
            </div>


             
            <br></br>
            <div style={{display : 'flex'}}>
                <span>Kost</span>
                {
                    this.state.kost && this.state.kost.map((room, key)=> (
                        
                        <RoomDetail room={room} key={key}></RoomDetail>
                    ))
                }
            </div>

            <br></br>
            <div style={{display : 'flex'}}>
                <span>Apartment</span>
                {
                    this.state.apartment && this.state.apartment.map((room, key)=> (
                        
                        <RoomDetail room={room} key={key}></RoomDetail>
                    ))
                }
            </div>

            <div style={{float : 'right', marginRight : '10px'}}>
                <Link to="/">See More</Link>
            </div>

            <div style={{padding : '5%'}}>
                <ApartmentArea></ApartmentArea>
            </div>

            <Footer></Footer>
        </div>
    )}
}

export default HomePage

