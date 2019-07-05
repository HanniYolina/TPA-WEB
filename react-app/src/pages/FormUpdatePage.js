import React from 'react'
import Map from '../components/Map';
import styled from 'styled-components';
import NavBar from '../containers/NavBar';
import {withRouter, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Axios from 'axios';
import PublicFacilities from '../containers/PublicFacilities'
import Loading from '../components/Loading';
import BreadCrumbs from '../components/BreadCrumbs';

const Container = styled('div')`
    width : 80vw;
    height : 100vh;
    margin 0 auto;
    padding : 5%;
`
const Next = styled('div')`
    width : 80vw;   
    text-align : center;
    margin-top : 5%;
`
const Buttons = styled('div')`
    width : 48vw;
    display : flex;
    margin : 0 auto;
`

const CheckboxContainer = styled('div')`
    width : 100%;
    display : flex;
    justify-content:space-between;
`

const Checkbox = styled('div')`
    width : 50%;
    flex-direction : column;
`
const Label = styled('div')`
    display : flex;
    width : 50%;
    margin : 0 auto;
    text-align : center;
`
const InputFile = styled('div')`
    border : 0px;
    background-color : #3cba92
`
const Input = styled('div')`
    width : 50%;
    height : 5vh;
`
const CheckboxLabel = styled('div')`
    display : flex;
    height : 5vh;
`

class FormKostPage extends React.Component{
    constructor(){
        super();

        this.state = {
            pageCount : 1,
            message : "",
            status : "",

            //2
            name : "",
            description : "",
            gender_type : "male",

            //price Checkbox
            priceMonth : "",
            priceYear : "",
            priceWeek : "",
            priceDay : "",

            //price value
            pricePerMonth : "",
            pricePerYear : "",
            pricePerWeek : "",
            pricePerDay : "",

            roomLeft : "",
            city : "",
            
            //3
            picture_name : "",
            roomFacilities : [],
            roomPanjang : 0,
            roomLebar : 0,
            banner_picture : "",
            video : "",
            picture_360 : "",

            //4
            parkir_car : "",
            parkir_motor : "",
            publicFacilities : [],
            allPublicFacilities : "",
            addInfo : "",
            feeType : "",
            fee : "",

            //facilities
            allRoomFacilities : "",
            allPublicFacilities : "",

        }
    }    

    incrementPage(){
        this.setState({
            pageCount : this.state.pageCount + 1
        })
    }

    decrementPage(){
        this.setState({
            pageCount : this.state.pageCount - 1 
        })
    }

    backPage(){
        this.props.history.replace('/manageRentHouse');
    }

    dataChange(ev){
        if(ev.target.type == "checkbox"){
            this.setState({
                [ev.target.name] : ev.target.checked
            })
        }
        else if(ev.target.type == "file"){
            this.setState({
                [ev.target.name] : ev.target.files[0]
            }) 
        }
        else{
            this.setState({
                [ev.target.name] : ev.target.value
            })
        }
    }

    getUser(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getUser', {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                owner_id : response.data.user.id,
                type : response.data.user.type
            })
        })
    }

    submit(ev){
        ev.preventDefault();

        let formData = new FormData();
        
        if(this.props.match.params.id){
            formData.append('id', this.props.match.params.id);
        }

        formData.append('owner_id', this.state.owner_id)

        //1
        var address = this.props.address
        if(address==null && this.state.address == null){
            this.setState({
                message : 'Address cannot be empty'
            })
            return
        }
        
        if(this.state.address==null){
            formData.append('latitude', address.lat)
            formData.append('longitude', address.lon)    
        }
        else{
            formData.append('address', this.state.address)
        }
        
        //2
        formData.append('name', this.state.name)
        formData.append('description', this.state.description)
        formData.append('gender_type', this.state.gender_type)

        if(this.state.price){
            formData.append('price', this.state.price)
        }
        else{
            let price = {'month' : 0, 'day': 0, 'week' : 0, 'year' : 0}
            if(this.state.priceMonth || this.state.priceDay || this.state.priceWeek || this.state.priceYear){
                price.month = this.state.pricePerMonth
                price.day = this.state.pricePerDay
                price.week = this.state.pricePerWeek
                price.year = this.state.pricePerYear
            }
            formData.append('price', JSON.stringify(price))
        }
        formData.append('room_left', this.state.room_left)
        formData.append('city', this.state.city)

        //3
        formData.append('picture_name', this.state.picture_name)
        formData.append('room_facilities', this.state.room_facilities)

        if(this.state.roomArea){
            formData.append('room_area', this.state.roomArea)
        }
        else{
            let roomArea = {'panjang' : 0, 'lebar' : 0}
            if(this.state.roomPanjang!=0 || this.state.roomLebar!=0){
                roomArea.panjang = this.state.roomPanjang
                roomArea.lebar = this.state.roomLebar
            }
            formData.append('room_area', JSON.stringify(roomArea))
        }
        formData.append('banner_name', this.state.banner_name)
        formData.append('video_name', this.state.video_name)
        formData.append('picture360_name', this.state.picture360_name)

        //4
        if(this.state.parking_facilities){
            formData.append('parking_facilities', this.state.parking_facilities)
        }
        else{
            let parkingFacilities = {'car' : false, 'motorcycle' : false};
            parkingFacilities.car = this.state.parkir_car;
            parkingFacilities.motorcycle = this.state.parkir_motor;
            formData.append('parking_facilities', JSON.stringify(parkingFacilities))
        }
        
        formData.append('public_facilities', this.state.public_facilities)
        formData.append('additional_info', this.state.additional_info)

        if(this.state.additional_fee){
            formData.append('additional_fee', this.state.additional_fee)    
        }
        else{
            const feeType = this.state.feeType
            let addFee = {feeType : this.state.fee}
            formData.append('additional_fee', JSON.stringify(addFee))
        }
        
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/updateRoom', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            console.log(response.data)
            this.setState({
                message : response.data.message,
                loading : false,
            });
            
            if(response.data.message == "success"){
                this.props.history.replace('/manageRentHouse');
            }
        })
    }

    appendFacilities(f){
        if(f.group == 'public'){
            if(this.state.publicFacilities.length == 0){
                this.state.publicFacilities.push(f);
            }
            else{
                this.state.publicFacilities.map((facilities) => {
                
                    if(facilities.id == f.id){  
                        let temp = this.state.publicFacilities.splice(this.state.publicFacilities.indexOf(f), 0);
                        this.setState({
                            publicFacilities : temp
                        },()=>{
                            // console.log(this.state.publicFacilities)
                        })
                    }
                    else{
                        let temp = this.state.publicFacilities;
                        temp.push(f);
                        this.setState({
                            publicFacilities: temp
                        },()=>{
                            // console.log(this.state.publicFacilities)
                        })
                    }
                })
            }
        }else if(f.group == 'room'){
            if(this.state.roomFacilities.length == 0){
                this.state.roomFacilities.push(f);
            }
            else{
                this.state.roomFacilities.map((facilities) => {
                
                    if(facilities.id == f.id){  
                        let temp = this.state.roomFacilities.splice(this.state.roomFacilities.indexOf(f), 0);
                        this.setState({
                            roomFacilities : temp
                        },()=>{
                            // console.log(this.state.publicFacilities)
                        })
                    }
                    else{
                        let temp = this.state.roomFacilities;
                        temp.push(f);
                        this.setState({
                            roomFacilities: temp
                        },()=>{
                            // console.log(this.state.publicFacilities)
                        })
                    }
                })
            }
        }  
    }

    getAllPublicFacilities(){
        this.setState({
            loading : true
        })
        Axios.post('http://localhost:8000/api/getFacilitiesByGroup',
        {
             token: sessionStorage.getItem('token'),
             group : 'public'
        }
        ).then(response => {
            this.setState({
                allPublicFacilities : response.data,
                loading : false    
            })
        })
    }

    getAllRoomFacilities(){
        this.setState({
            loading : true
        })
        Axios.post('http://localhost:8000/api/getFacilitiesByGroup',
        {
             token: sessionStorage.getItem('token'),
             group : 'room'
        }
        ).then(response => {
            this.setState({
                allRoomFacilities : response.data,
                loading : false    
            })
        })
    }

    getRoomById(){
        this.setState({
            loading : true
        })
        Axios.post(`http://localhost:8000/api/getRoomById`, {
            id : this.props.match.params.id,
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                room : response.data.room,
                kost : response.data.kost,

                address : response.data.room.address,
                name : response.data.room.name,
                description : response.data.room.description,
                gender_type : response.data.kost.gender_type,
                price : response.data.room.price,

                room_left : response.data.kost.room_left,
                city : response.data.room.city,
                
                //3
                picture_name : response.data.room.picture_name,
                roomFacilities : response.data.room.roomFacilities,
                roomArea : response.data.room.roomArea,
                banner_name : response.data.room.banner_name,
                video_name : response.data.room.video_name,
                picture360_name : response.data.room.picture360_name,

                //4
                parking_facilities : response.data.room.parking_facilities,
                public_facilities : response.data.room.public_facilities,
                additional_fee : response.data.room.additional_fee,
                // addFee : 

                loading : false
            })
        })
        // var path = `https://us1.locationiq.com/v1/reverse.php?key=899758dd3d8f41&lat=${parseFloat(e.latlng.lat)}&lon=${parseFloat(e.latlng.lng)}&format=json`
        
        // Axios.get(path).then(response => {
        //     // console.log(response)
        //     this.props.onMapClicked(response.data);
        // })
    }

    componentDidMount(){
        this.getUser();
        this.getAllPublicFacilities();
        this.getAllRoomFacilities();
        this.getRoomById();
    }

    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type != 2){
            if(this.state.type == 1){
                return <Redirect to="/"/>
            }
            else if(this.state.type == 3){
                return <Redirect to="/adminDashboard"/>
            }
        }
    }

    render(){
        let page;
        let clickButton = 
        <Buttons>
            <Next>
                <button type="button" onClick={this.decrementPage.bind(this)}>Previous</button>
            </Next>
            <Next>
                <button type="button" onClick={this.incrementPage.bind(this)}>Next</button>
            </Next>
        </Buttons>;

        if(this.state.pageCount == 1){
            clickButton = <Buttons>
                <Next>
                    <button onClick={this.backPage.bind(this)}>Back</button>
                </Next>
                <Next>
                    <button onClick={this.incrementPage.bind(this)}>Next</button>
                </Next>
            </Buttons>;

            var fullName;
            var address = this.props.address
            if(address){
                fullName = address.display_name
            }
            
            page = <div>
                <h1>Choose Location</h1>
                <Map></Map>
                <input type="text" placeholder="Input Address" name="address" onChange={this.dataChange.bind(this)} required placeholder={fullName} ></input>
            </div>

        }
        if(this.state.pageCount == 2){
            page = 
            <div>
                <h1>Input Data Kost</h1>
                <label htmlFor="name">Nama Kost</label>
                <input type="text" name="name" placeholder="Input Kost Name" onChange={this.dataChange.bind(this)} value={this.state.name} required></input>

                <br></br><br></br>
                <label htmlFor="description">Description</label>
                <input type="text" name="description" placeholder="Input Description" onChange={this.dataChange.bind(this)} value={this.state.description}required></input>

                
                <br></br><br></br>
                <label htmlFor="gender_type">Gender Type  </label>
                <select name="gender_type" required onChange={this.dataChange.bind(this)}>
                    <option name="gender_type" value="male">Male</option>
                    <option name="gender_type" value="female">Female</option>
                </select>

                <br></br><br></br> 
                <label htmlFor="price">Price  </label>
                <CheckboxContainer>
                    <Checkbox>
                        <CheckboxLabel><Input><input type="checkbox" name="priceMonth" onChange={this.dataChange.bind(this)}></input></Input> Month</CheckboxLabel>
                        <CheckboxLabel><Input><input type="checkbox" name="priceYear" onChange={this.dataChange.bind(this)}></input></Input> Year</CheckboxLabel>
                        <CheckboxLabel><Input><input type="checkbox" name="priceDay" onChange={this.dataChange.bind(this)}></input></Input> Day</CheckboxLabel>
                        <CheckboxLabel><Input><input type="checkbox" name="priceWeek" onChange={this.dataChange.bind(this)}></input></Input> Week</CheckboxLabel>
                    </Checkbox>

                    <Checkbox>
                        <Input><input type="number" name="pricePerMonth" style={{display : this.state.priceMonth ? "" : "none"}} onChange={this.dataChange.bind(this)}></input></Input>
                        <Input><input type="number" name="pricePerYear" style={{display : this.state.priceYear ? "" : "none"}} onChange={this.dataChange.bind(this)}></input></Input>
                        <Input><input type="number" name="pricePerDay" style={{display : this.state.priceDay ? "" : "none"}} onChange={this.dataChange.bind(this)}></input></Input>
                        <Input><input type="number" name="pricePerWeek" style={{display : this.state.priceWeek ? "" : "none"}} onChange={this.dataChange.bind(this)}></input></Input>
                    </Checkbox>
                </CheckboxContainer>
                
                <br></br><br></br>
                <label htmlFor="room_left">Room Left</label>
                <input type="number" name="room_left" placeholder="Input Room Left" value={this.state.room_left} onChange={this.dataChange.bind(this)} required></input>

                <br></br><br></br>
                <label htmlFor="city">City</label>
                <input type="text" name="city" placeholder="Input City" value={this.state.city} onChange={this.dataChange.bind(this)} required></input>
            </div>
        }
        if(this.state.pageCount == 3){ 
            page = <div>
                <h1>Input Fasilitas Kost</h1>
                <label htmlFor="picture_name">Picture</label>
                <InputFile><input type="file" name="picture_name" onChange={this.dataChange.bind(this)}></input></InputFile>

                <br></br>
                <label htmlFor="roomFacilities">Room Facilites : </label>

                <CheckboxContainer>
                    <Checkbox>
                        {
                            this.state.allRoomFacilities && this.state.allRoomFacilities.map((facilities, key)=> (
                                <div key={facilities.id} >
                                    <PublicFacilities appendFacilities={(f)=>this.appendFacilities(f)} facilities={facilities} type="show">
                                    </PublicFacilities>
                                </div>
                            ))
                        }
                    </Checkbox>
                </CheckboxContainer>

                <br></br>
                <label htmlFor="roomArea">Room Area</label>
                <br></br>
                <label htmlFor="roomPanjang">Panjang</label>
                <input name="roomPanjang" type="number" onChange={this.dataChange.bind(this)}></input>
                <label htmlFor="roomLebar">Lebar</label>
                <input name="roomLebar" type="number" onChange={this.dataChange.bind(this)}></input>

                <br></br><br></br>
                <label htmlFor="banner_name">Banner Picture</label>
                <InputFile><input type="file" name="banner_name" onChange={this.dataChange.bind(this)}></input></InputFile>
                
                <br></br>
                <label htmlFor="video_name">Video</label>
                <InputFile><input type="file" name="video_name" onChange={this.dataChange.bind(this)}></input></InputFile>

                <br></br>
                <label htmlFor="picture360_name">Picture 360</label>
                <InputFile><input type="file" name="picture360_name" onChange={this.dataChange.bind(this)}></input></InputFile>
            </div>
        }

        if(this.state.pageCount == 4){
            clickButton = 
            <Buttons>
                <Next>
                    <button type="button" onClick={this.decrementPage.bind(this)}>Previous</button>
                </Next>
                <Next>
                    <input type="submit" form="KostForm" />
                </Next>
            </Buttons>;
            page = <div>
                <h1>Input Public Facilites Data</h1>

                <label htmlFor="parkingFacilities">Parking Facilites : </label>
                <CheckboxContainer>
                    <Checkbox>
                        <input type="checkbox" name="parkir_car" onChange={this.dataChange.bind(this)}></input>
                        <input type="checkbox" name="parkir_motor" onChange={this.dataChange.bind(this)}></input>
                    </Checkbox>

                    <Checkbox>
                        <Label><label htmlFor="parkir_car">Car</label></Label>
                        <Label><label htmlFor="parkir_motor">Motorcycle</label></Label>
                        
                    </Checkbox>
                </CheckboxContainer>

                <br></br>

                <label htmlFor="public_facilities">Public Facilites:</label>
                <CheckboxContainer>
                    <Checkbox>
                        {
                            this.state.allPublicFacilities && this.state.allPublicFacilities.map((facilities, key)=> (
                                <div key={facilities.id} >
                                    <PublicFacilities appendFacilities={(f)=>this.appendFacilities(f)} facilities={facilities} type="show">
                                    </PublicFacilities>
                                </div>
                            ))
                        }
                    </Checkbox>

                </CheckboxContainer>

                <br></br>
                <label name="additional_info">Additional Information</label>
                <input type="textarea" name="additional_info" onChange={this.dataChange.bind(this)}></input>

                <br></br><br></br>
                <label name="addFee">Additional Fee</label>
                <br></br>
                <CheckboxContainer>    
                    <Label><label htmlFor="feeType">Fee Type</label></Label>   
                    <Input><input type="textarea" name="feeType" onChange={this.dataChange.bind(this)}></input></Input>

                    <Label><label htmlFor="fee">Fee</label></Label>
                    <Input><input type="number" name="fee" onChange={this.dataChange.bind(this)}></input></Input>
                </CheckboxContainer>
            </div>
        }

        //loading
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }

        //message
        
        let errorMessage = <p>{this.state.message}</p>
        

        return(
            <div>
                {this.checkUser()}
                {this.state.type == 2 ? 
                    <div>
                        {loading}
                        <NavBar></NavBar>
                        <BreadCrumbs></BreadCrumbs>
                        <Container>
                            <form onSubmit={this.submit.bind(this)} id="KostForm">
                                {page}
                            </form>
                            {errorMessage}
                            {clickButton}
                        </Container>
                    </div>

                    : ""
                }
                
            </div>
        )
    }
}

const state = state=>{
    return {
        address : state.address
    }
}
export default withRouter(connect(state)(FormKostPage))