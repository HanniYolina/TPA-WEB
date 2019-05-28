import React, { Component } from 'react';
import Axios from 'axios';
import './App.css';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NavBar from './containers/NavBar';
import RegisterGuest from './containers/RegisterGuest';
import RegisterOwner from './containers/RegisterOwner';
import SearchPage from './pages/SearchPage';
import RoomPage from './pages/RoomPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage'
import OwnerProfilePage from './pages/OwnerProfilePage'
import ManageRentHousePage from './pages/ManageRentHousePage'
import FormKostPage from './pages/FormKostPage'
import ManageFacilityPage from './pages/ManageFacilityPage';
import UpdateFacilities from './pages/UpdateFacilitiesPage';
import DeleteFacilities from './pages/DeleteFacilityPage';
import ChangePassword from './containers/ChangePassword';
import FormUpdatePage from './pages/FormUpdatePage';
import Chat from './components/Chat';
import {connect, socket} from './Api.js';
import ManageApartmentPage from './pages/ManageApartmentPage';
import FormApartmentPage from './pages/FormApartmentPage';
import FormUpdateApartmentPage from './pages/FormUpdateApartmentPage'
import FollowingPage from './pages/FollowingPage';
import ManageGuestPage from './pages/ManageGuestPage';
import BannedPage from './pages/BannedPage';
import ManageOwnerPage from './pages/ManageOwnerPage';
import ManagePremiumPage from './pages/ManagePremiumPage'
import UpdatePremium from './pages/UpdatePremium';
import PremiumProduct from './pages/PremiumProduct';
import OrderPremiumPage from './pages/OrderPremiumPage'

class App extends Component {
  constructor(){
    super();
    this.state={
      mode : 'desktop',
      id : ""
    }
    connect(this.state.id);
  }

  send(to_id){
    //harusnya newMessagem from_id , to_id
    //kalo gni msh diri sndiri ngirim
    socket.emit('newMessage', to_id, '2', 'asdadasdsa')
  }

  changeMode(){
    if(window.innerWidth < 500){
      this.setState({
        mode : 'mobile'
      })
    }else if(window.innerWidth < 1100){
      this.setState({
        mode : 'table'
      })
    }
    else{
      this.setState({
        mode : 'desktop'
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
              id : response.data.user.id
          })
      })
  }

  componentDidMount(){
    this.getUser();
    this.changeMode();
    window.addEventListener('resize', ()=>{
        this.changeMode();
    })
  }
  render() {
    return (
      <div>
        <BrowserRouter>
            <Route path="/" component={NavBar} exact/>
            <Route path="/" component={HomePage} exact />
            <Route path="/login" component={LoginPage} exact />
            <Route path="/register/guest" component={RegisterGuest} exact/>
            <Route path="/register/owner" component={RegisterOwner} exact/>
            <Route path="/search" component={SearchPage} exact/>
            <Route path='/room/:id' component={RoomPage} exact />
            <Route path='/profile' component={() => <ProfilePage mode={this.state.mode}/>} exact />
            <Route path='/editProfile' component={EditProfilePage}></Route>
            <Route path='/changePassword' component={ChangePassword}></Route>
            <Route path='/banned' component={BannedPage}></Route>

            <Route path='/chat' component={()=> <Chat send={this.send}></Chat>}></Route>

            {/* guest*/}
            <Route path='/ownerProfile/:id' component={OwnerProfilePage}></Route>
        
            {/* owner */}
            <Route path='/manageRentHouse' component={ManageRentHousePage}></Route>
            <Route path='/formKost' component={FormKostPage}></Route>
            <Route path='/formUpdate/:id' component={FormUpdatePage}></Route>
            <Route path='/followingPage' component={FollowingPage}></Route>

            <Route path='/manageApartment' component={ManageApartmentPage}></Route>
            <Route path='/formApartment' component={FormApartmentPage}></Route>
            <Route path='/formUpdateApartment/:id' component={FormUpdateApartmentPage}></Route>
            <Route path='/premiumProduct' component={PremiumProduct}></Route>
            <Route path='/orderPremium' component={OrderPremiumPage}></Route>

            {/* admin */}
            <Route path='/manageFacilityPage' component={ManageFacilityPage}></Route>
            <Route path='/updateFacilitiesPage/:id' component={UpdateFacilities}></Route>
            <Route path='/deleteFacilitiesPage/:id' component={DeleteFacilities}></Route>

            <Route path='/manageGuestPage' component={ManageGuestPage}></Route>
            <Route path='/manageOwnerPage' component={ManageOwnerPage}></Route>

            <Route path='/managePremiumPage' component={ManagePremiumPage}></Route>
            <Route path='/updatePremium/:id' component={UpdatePremium}></Route>
        </BrowserRouter>
     </div>
    );
  }
}

export default App;
