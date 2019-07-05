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
import ManageTransaction from './pages/ManageTransaction'
import ManagePostPage from './pages/ManagePostPage'
import PostPage from './pages/PostPage'
import GeneralPostPage from './pages/GeneralPostPage'
import HistoryPremiumPage from './pages/HistoryPremiumPage'
import HistoryPage from './pages/HistoryPage'
import ManageReport from './pages/ManageReportPage' 
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SearchPost from './pages/SearchPost';
import GuestProfilePage from './pages/GuestProfilePage';
import './font-awesome-4.7.0/css/font-awesome.min.css'

class App extends Component {
  constructor(){
    super();
    this.state = {
      mode : 'desktop',
      id : ""
    }
  }

  send(to_id, from_id, content){
    //harusnya newMessagem from_id , to_id
    //kalo gni msh diri sndiri ngirim
    console.log(content)
    socket.emit('newMessage', to_id, from_id, content)
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
            <Route path="/" component={() => <NavBar mode={this.state.mode}/>} exact/>
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
            <Route path='/generalPostPage' component={GeneralPostPage}></Route>

            {/* guest*/}
            <Route path='/ownerProfile/:id' component={OwnerProfilePage}></Route>
            <Route path='/historyPage' component={HistoryPage}></Route>
            <Route path='/guestProfilePage/:id' component={GuestProfilePage}></Route>            
        
            {/* owner */}
            <Route path='/ownerDashboard' component={OwnerDashboard}></Route>
            <Route path='/manageRentHouse' component={ManageRentHousePage}></Route>
            <Route path='/formKost' component={FormKostPage}></Route>
            <Route path='/formUpdate/:id' component={FormUpdatePage}></Route>
            <Route path='/followingPage' component={FollowingPage}></Route>

            <Route path='/manageApartment' component={ManageApartmentPage}></Route>
            <Route path='/formApartment' component={FormApartmentPage}></Route>
            <Route path='/formUpdateApartment/:id' component={FormUpdateApartmentPage}></Route>
            <Route path='/premiumProduct' component={PremiumProduct}></Route>
            <Route path='/orderPremium' component={OrderPremiumPage}></Route>
            <Route path='/historyPremium' component={HistoryPremiumPage}></Route>

            {/* admin */}
            <Route path='/adminDashboard' component={AdminDashboard}></Route>
            <Route path='/manageFacilityPage' component={ManageFacilityPage}></Route>
            <Route path='/updateFacilitiesPage/:id' component={UpdateFacilities}></Route>
            <Route path='/deleteFacilitiesPage/:id' component={DeleteFacilities}></Route>

            <Route path='/manageGuestPage' component={ManageGuestPage}></Route>
            <Route path='/manageOwnerPage' component={ManageOwnerPage}></Route>

            <Route path='/managePremiumPage' component={ManagePremiumPage}></Route>
            <Route path='/updatePremium/:id' component={UpdatePremium}></Route>

            <Route path='/manageTransaction' component={ManageTransaction}></Route>
            <Route path='/managePost' component={ManagePostPage}></Route>
            <Route path='/post/:id' component={PostPage} exact />

            <Route path='/searchPost/:tag_id' component={SearchPost} exact />            

            <Route path='/manageReport' component={ManageReport}></Route>

        </BrowserRouter>
     </div>
    );
  }
}

export default App;
