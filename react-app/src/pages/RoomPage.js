import React from 'react'
import {Link} from 'react-router-dom'
import Map from '../components/Map';
import styled from 'styled-components'
import Axios from 'axios';
import Loading from '../components/Loading'
import PopUp from '../components/PopUp';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import ReportPopUp from '../containers/ReportPopUp'
import Review from '../components/Review'
import RoomDetail from '../containers/RoomDetail'

const OwnerProfile = styled('div')`
    text-decoration:none;
    color: green;
    padding : 3%;
    font-weight : 700;  
`
const Picture = styled('div')`
    width : 100%;
    height : 40vh;
    margin : 0 auto;
    border : 2px solid #3cba92;
    border-radius : 10%;
    background-size : cover;
    background-repeat : no-repeat;
`

const ReviewStyle = styled('div')`
    width : 70%;
    height : auto;
    margin : 0 auto;
    border : 2px solid #3cba92;
    border-radius : 10%;
    padding : 5%;
`

const ButtonReply = styled('div')`
    width : 10%;
    background-color : #3cba92;
    text-align : center;
`

const Rating = {
    fontFamily : "FontAwesome",
    content : "\f005"
}

class RoomPage extends React.Component{
    constructor(){
        super();

        this.state = {
            type : "",
            id : "",
            user : "",
            owner_id : "",
            delete : false,
            confirm : "",
            popup : "",
            favorite : "Favorite",
            report : false,
            room : null,
            kost : null,
            reportType : "price",
            totalFavorite : 0,


            contents : "",
            parent_id : null,
            children_id : null,
            average_star : null,
            stars : null,
            allReview : "",

            loadReview : false,
            pageNum : 1,
            seeMore : false,

            cleanliness : 1,
            roomFacilities : 1,
            publicFacilities : 1,
            security : 1
        }
    }
    
    getUser(){
        if(sessionStorage.getItem('token') != null){
            this.setState({
                loading : true
            })
    
            Axios.post('http://localhost:8000/api/getUser', {
                token: sessionStorage.getItem('token')
            }).then(response => {
                this.setState({
                    status : response.status,
                    user : response.data.user,
                    type : response.data.user.type,
                    user_id : response.data.user.id,
                    loading : false
                }, ()=> this.latestView())
            })    
        }
        

    }

    getOwner(){
        if(sessionStorage.getItem('token') != null){
            this.setState({
                loading : true
            })

            Axios.post('http://localhost:8000/api/getUser', {
                token: sessionStorage.getItem('token')
            }).then(response => {
                this.setState({
                    ownerPhone : response.data.user.phone,
                    loading : false
                })
            })
        }
    }

    getProperties(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/getRoomById`, {
            id : this.props.match.params.id,
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                room : response.data.room,
                kost : response.data.kost,
                owner_id : response.data.room.owner_id,
                propertiesable_type : response.data.room.propertiesable_type,
                properties_status : response.data.room.status,
                loading : false
            }, ()=>{
                // console.log(response.data.kost)
                this.getFavorite();
                this.getOwner();
                this.getTotalFavorite();
                console.log(this.state.seeMore)
                if(this.state.seeMore == false){
                    this.getAllReview();
                }
                this.getNearestandPremiumApartment();
                this.getNearestandPremiumKost();
            })
        })
    }

    latestView(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/view`, {
            properties_id : this.props.match.params.id,
            user_id : this.state.user_id,
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                loading : false
            })
        })
    }

    deleteRoom(){
        this.setState({
            delete : true
        })
    }

    deleteFromDB(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/destroyRoom/`,{
            token: sessionStorage.getItem('token'),
            id : this.props.match.params.id,
        }).then(response => {
            this.setState({
                message : response.message,
                loading : false
            })
        })
        this.props.history.replace('/manageRentHouse');
    }

    buttonPopup(value){
        this.setState({
            popup : value,
            delete : false
        })
    }

    updateRoom(){
        var type = "App"+ "\\" +"Kost";
        if(this.state.propertiesable_type == type){
            this.props.history.replace(`/formUpdate/${this.props.match.params.id}`);
        }

        else{
            this.props.history.replace(`/formUpdateApartment/${this.props.match.params.id}`);
        }
        
    }

    getFavorite(){
        console.log(this.state.room.name)
        Axios.post(`http://localhost:8000/api/getFavorite`,{
            token: sessionStorage.getItem('token'),
            user_id : this.state.user_id,
            properties_id : this.props.match.params.id
        }).then(response => {
            console.log(response.data.type)
            if(response.data.type == 'Unfavorite'){
                this.setState({
                    favorite : "Unfavorite"
                })
            }
        })
    }
    
    favorite(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/favorite`,{
            token: sessionStorage.getItem('token'),
            user_id : this.state.user_id,
            properties_id : this.props.match.params.id
        }).then(response => {
            this.setState({
                loading : false,
                favorite : response.data.type
            })
        })
    }

    reportDisplay(){
        this.setState({
            report : true
        })
    }

    closeReport(){
        this.setState({
            report : false
        })
    }

    banProperties(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/banProperties`,{
            token: sessionStorage.getItem('token'),
            id : this.props.match.params.id
        }).then(response => {
            this.setState({
                loading : false,
            })
        })
    }

    getTotalFavorite(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/countFavorite`,{
            token: sessionStorage.getItem('token'),
            properties_id : this.props.match.params.id
        }).then(response => {
            this.setState({
                totalFavorite : response.data,
                loading : false,
            })
        })

    }

    componentWillMount(){
        this.getUser();
        this.getProperties();
    }

    
    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }

    addReview(){
        let average = (this.state.roomFacilities + this.state.cleanliness + this.state.publicFacilities + this.state.security)/4;
        let stars = {
            cleanliness : this.state.cleanliness,
            publicFacilities : this.state.publicFacilities,
            roomFacilities : this.state.roomFacilities,
            security : this.state.security
        }

        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/addReview`,{
            token: sessionStorage.getItem('token'),
            properties_id : this.props.match.params.id,
            contents : this.state.contents,
            parent_id : this.state.parent_id,
            children_id : this.state.children_id,
            user_id : this.state.user.id,
            average_star : average,
            stars : stars
        }).then(response => {
            this.setState({
                loading : false,
                errorReview : response.data.contents,
            })
        })
    }

    getAllReview(){
        this.setState({
            loading : true
        });
        Axios.post(`http://localhost:8000/api/getAllReview?page=${this.state.pageNum}`,{
            token: sessionStorage.getItem('token'),
            properties_id : this.props.match.params.id,
            parent_id : null
        }).then(response => {
            this.setState({
                allReview : response.data.data,
                loading : false,
                last_page : response.data.last_page,
                firstReview : response.data.data.slice(0,3)
            })
        })
    }

    changePageNum(){
        let curr = this.state.pageNum
        if(this.state.pageNum == this.state.last_page){
            this.setState({
                pageNum : 1
            },()=>{
                this.getAllReview()
            })
        }
        else{
            this.setState({
                pageNum : curr + 1
            },()=>{
                this.getAllReview()
            })
        }
    }

    changeSeeMore(){
        if(this.state.seeMore){
            this.setState({
                seeMore : false
            })
        }
        else{
            this.setState({
                seeMore : true
            })
        }
    }

    getNearestandPremiumKost(){
        console.log(this.state.room)
        let lat = this.state.room.latitude;
        let long = this.state.room.longitude;

        this.setState({
            loading : true,
        })

        Axios.post("http://localhost:8000/api/getNearestKost",
        {
            latitude : lat,
            longitude : long,
            type : "get",
            id: this.state.room.id
        }
        ).then(response => {
            this.setState({
                nearestKost : response.data.slice(0,4),
                loading : false,
            })
        
        })
    }

    getNearestandPremiumApartment(){
        let lat = this.state.room.latitude;
        let long = this.state.room.longitude;

        this.setState({
            loading : true,
            loadCount : 1
        })

        Axios.post("http://localhost:8000/api/getNearestApartment",
        {
            latitude : lat,
            longitude : long,
            type : "get",
            id: this.state.room.id
        }
        ).then(response => {
            this.setState({
                nearestApartment : response.data.slice(0,4),
                loading : false,
            })
        })
    }


    render(){
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        let button;

        let data;
        if(this.state.propertiesable_type == ("App" + "\\" +"Kost")){
            data = <div>
                <p>Gender : {this.state.kost.gender_type}</p>
                <p>Room Left : {this.state.kost.room_left}</p>
            </div>
        }

        let page

        if(this.state.room != null){
            // console.log(this.state.room)
            page = <div>
            <Map></Map>
            <p>Name : {this.state.room.name}</p>
            <p>Description : {this.state.room.description}</p>
            <Picture style={{backgroundImage: 'url(http://localhost:8000' + `${this.state.room.picture_name}` + ')'}}></Picture>
            <p>City : {this.state.room.city}</p>
            <p>Address : {this.state.room.address}</p>
            <p>Total Favorite : {this.state.totalFavorite}</p>

            <br></br>
            <p>Room Area</p>
            <p>Panjang : {JSON.parse(this.state.room.room_area).panjang}</p>
            <p>Lebar : {JSON.parse(this.state.room.room_area).lebar}</p>

            <br></br>
            <p>Additional</p>
            <p>Additional Information : {this.state.room.additional_info}</p>
            {data}
        </div>;
        }
        
        // room_area = JSON.parse(room_area)
        

        let reportForm;
        if(this.state.report){
            reportForm = <ReportPopUp user_id={this.state.user_id} properties_id={this.props.match.params.id} closeReport={this.closeReport.bind(this)}></ReportPopUp>
        }

        if(this.state.type == 1){
            if(this.state.properties_status == 1){
                let phone = "tel:"+ this.state.ownerPhone
                // console.log(phone)
                button = <div>
                        <ReviewStyle>
                            <div>
                                <span>Cleanliness </span>
                                <i className={this.state.cleanliness>=1 ? "fa fa-star" : this.state.cleanliness > 0.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({cleanliness : 1})
                                }}></i>

                                <i className={this.state.cleanliness>=2 ? "fa fa-star" : this.state.cleanliness > 1.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({cleanliness : 2})
                                }}></i>

                                <i className={this.state.cleanliness>=3 ? "fa fa-star" : this.state.cleanliness > 2.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({cleanliness : 3})
                                }}></i>

                                <i className={this.state.cleanliness>=4 ? "fa fa-star" : this.state.cleanliness > 3.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({cleanliness : 4})
                                }}></i>

                                <i className={this.state.cleanliness>=5 ? "fa fa-star" : this.state.cleanliness > 4.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({cleanliness : 5})
                                }}></i>
                            
                                <br></br>
                                <span>Room Facilities </span>
                                <i className={this.state.roomFacilities>=1 ? "fa fa-star" : this.state.roomFacilities > 0.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({roomFacilities : 1})
                                }}></i>

                                <i className={this.state.roomFacilities>=2 ? "fa fa-star" : this.state.roomFacilities > 1.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({roomFacilities : 2})
                                }}></i>

                                <i className={this.state.roomFacilities>=3 ? "fa fa-star" : this.state.roomFacilities > 2.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({roomFacilities : 3})
                                }}></i>

                                <i className={this.state.roomFacilities>=4 ? "fa fa-star" : this.state.roomFacilities > 3.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({roomFacilities : 4})
                                }}></i>

                                <i className={this.state.roomFacilities>=5 ? "fa fa-star" : this.state.roomFacilities > 4.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({roomFacilities : 5})
                                }}></i>

                                <br></br>
                                <span>Public Facilities </span>
                                <i className={this.state.publicFacilities>=1 ? "fa fa-star" : this.state.publicFacilities > 0.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({publicFacilities : 1})
                                }}></i>

                                <i className={this.state.publicFacilities>=2 ? "fa fa-star" : this.state.publicFacilities > 1.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({publicFacilities : 2})
                                }}></i>

                                <i className={this.state.publicFacilities>=3 ? "fa fa-star" : this.state.publicFacilities > 2.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({publicFacilities : 3})
                                }}></i>

                                <i className={this.state.publicFacilities>=4 ? "fa fa-star" : this.state.publicFacilities > 3.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({publicFacilities : 4})
                                }}></i>

                                <i className={this.state.publicFacilities>=5 ? "fa fa-star" : this.state.publicFacilities > 4.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({publicFacilities : 5})
                                }}></i>

                                <br></br>
                                <span>Security </span>
                                <i className={this.state.security>=1 ? "fa fa-star" : this.state.security > 0.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({security : 1})
                                }}></i>

                                <i className={this.state.security>=2 ? "fa fa-star" : this.state.security > 1.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({security : 2})
                                }}></i>

                                <i className={this.state.security>=3 ? "fa fa-star" : this.state.security > 2.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({security : 3})
                                }}></i>

                                <i className={this.state.security>=4 ? "fa fa-star" : this.state.security > 3.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({security : 4})
                                }}></i>

                                <i className={this.state.security>=5 ? "fa fa-star" : this.state.security > 4.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                    style={{color : '#ffaa3b'}} onClick={()=>{
                                    this.setState({security : 5})
                                }}></i>
                            </div>
                            <input type="text" placeholder="Input Review" name="contents" onChange={this.dataChange.bind(this)}></input>
                            {console.log(this.state.errorReview)}
                            <span>{this.state.errorReview}</span>
                            <button onClick={this.addReview.bind(this)}>Review</button>                            
                        </ReviewStyle>

                        <Link to={`/ownerProfile/${this.state.owner_id}`}><OwnerProfile>Go to Owner Profile</OwnerProfile></Link>
                        <button onClick={this.favorite.bind(this)}>{this.state.favorite}</button>
                        <button><a href={phone}>Telephone</a></button>
                        <button><Link to={{pathname : '/chat', state :{to_id : this.state.owner_id}}}>Chat with Owner</Link></button>
                        <button onClick={this.reportDisplay.bind(this)}>Report</button>
                        {reportForm}
                    </div>
            }
            else{
                button = <h4>This Properties has been banned by admin</h4>
            }
        }
        else if(this.state.type == 2){
            if(this.state.properties_status == 1){
                if(this.props.location.state.type == "update"){
                    button = <div>
                        <h4>Do you want to update?</h4>
                        <button onClick={this.updateRoom.bind(this)}>Update</button>
                    </div>
                }
                else if(this.props.location.state.type == "delete"){
                    button = <div>
                        <h4>Do you want to delete?</h4>
                        <button onClick={this.deleteRoom.bind(this)}>Delete</button>
                    </div>
                }
            }else{
                button = <h4>This Properties has been banned by admin</h4>
            }
        }else if(this.state.type == 3){
            if(this.state.properties_status == 1){
                button = <div>
                        <h4>Do you want to Ban this property?</h4>
                        <button onClick={this.banProperties.bind(this)}>Ban</button>
                    </div>
            }else{
                button = <h4>This Properties has been banned by admin</h4>
            }
        }

        let deleteButton
        if(this.state.delete){
            deleteButton = <PopUp text="Are you sure to delete?" type="delete" buttonPopup={this.buttonPopup.bind(this)}></PopUp>
        }
        else{
            if(this.state.popup == "delete"){
                this.deleteFromDB()
            }
        }

        let review
        if(this.state.seeMore){
            if(this.state.allReview != ""){
                review = <div>
                    <p>Reviews</p>                    
                    {
                        this.state.allReview && this.state.allReview.map((review, key)=> (
                            <div>
                                <div style={{paddingLeft : '5%'}}>
                                    <i className={review.average_star>=1 ? "fa fa-star" : review.average_star > 0.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                        style={{color : '#ffaa3b'}}></i>

                                    <i className={review.average_star>=2 ? "fa fa-star" : review.average_star > 1.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                        style={{color : '#ffaa3b'}}></i>

                                    <i className={review.average_star>=3 ? "fa fa-star" : review.average_star > 2.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                        style={{color : '#ffaa3b'}}></i>

                                    <i className={review.average_star>=4 ? "fa fa-star" : review.average_star > 3.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                        style={{color : '#ffaa3b'}}></i>

                                    <i className={review.average_star>=5 ? "fa fa-star" : review.average_star > 4.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                        style={{color : '#ffaa3b'}}></i>
                                </div>
                            <Review review={review} properties_id={this.props.match.params.id} user_id={this.state.user.id}></Review>
                            </div>
                        ))  
                    }
                    <ButtonReply onClick={this.changeSeeMore.bind(this)}>See Less</ButtonReply>
                    <ButtonReply onClick={this.changePageNum.bind(this)}>Next</ButtonReply>
                </div>
            }
        }
        else{
            if(this.state.firstReview != ""){
                review = <div>
                    <p>Reviews</p>
                    {
                        this.state.firstReview && this.state.firstReview.map((review, key)=> (
                            <div>
                                <div style={{paddingLeft : '5%'}}>
                                    <i className={review.average_star>=1 ? "fa fa-star" : review.average_star > 0.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                        style={{color : '#ffaa3b'}}></i>

                                    <i className={review.average_star>=2 ? "fa fa-star" : review.average_star > 1.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                        style={{color : '#ffaa3b'}}></i>

                                    <i className={review.average_star>=3 ? "fa fa-star" : review.average_star > 2.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                        style={{color : '#ffaa3b'}}></i>

                                    <i className={review.average_star>=4 ? "fa fa-star" : review.average_star > 3.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                        style={{color : '#ffaa3b'}}></i>

                                    <i className={review.average_star>=5 ? "fa fa-star" : review.average_star > 4.1 ?'fa fa-star-half': 'fa fa-star-o' } 
                                        style={{color : '#ffaa3b'}}></i>
                                </div>
                                <Review key={key} review={review} properties_id={this.props.match.params.id} user_id={this.state.user.id}></Review>
                            </div>
                        )) 
                    }
                    
                    <ButtonReply onClick={this.changeSeeMore.bind(this)}>See More</ButtonReply>
                </div>
            }
        }

        
        

        return(
            <div>
                {loading}
                <NavBar></NavBar>
                <BreadCrumbs></BreadCrumbs>
                {page}
                {review}
                <br></br>
                <br></br>

                {button}
                {deleteButton}

                <br></br>
                <span>Kost</span>
                <br></br>
                <div style={{display : 'flex'}}>
                    {
                        this.state.nearestKost && this.state.nearestKost.map((room, key)=> (
                            
                            <RoomDetail room={room} key={key}></RoomDetail>
                        ))
                    }
                </div>

                <br></br>
                <span>Apartment</span>
                <br></br>
                <div style={{display : 'flex'}}>
                    {
                        this.state.nearestApartment && this.state.nearestApartment.map((room, key)=> (
                            
                            <RoomDetail room={room} key={key}></RoomDetail>
                        ))
                    }
                </div>
            </div>
        )
    }
}

const state = state=>{
    return {
        confirm : state.confirm
    }
}
export default withRouter(connect(state)(RoomPage))