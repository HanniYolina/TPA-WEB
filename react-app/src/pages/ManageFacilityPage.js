import React from 'react'
import styled from 'styled-components'
import Axios from 'axios'
import Loading from '../components/Loading'
import NavBar from '../containers/NavBar';
import PublicFacilities from '../containers/PublicFacilities';
import {Redirect} from 'react-router-dom';
import BreadCrumbs from '../components/BreadCrumbs';

const Container = styled('div')`
    width : 100vw;
    height : 100vh;
`
const divStyle = {
    width : '30%',
    height : '10%',
    backgroundColor : 'white',
    border : '2px solid #3cba92',
    margin : '0 auto',
    marginTop : '5vh',
    textAlign : 'center',
    fontSize : '180%',
    borderRadius: '10px',
}

const Tab = styled('div')`
    display : flex;
`

const Main =styled('div')`
    background-color : white;
    width : 90%;
    height : 80%;
    margin : 0 auto;
    margin-top : 5vh;
    margin-bottom : 5vh;
    border : 2px solid #3cba92;
    border-radius : 10px;
`
const SplitMain = styled('div')`
    width : 50%;
    height : 100%;
    border-radius : 10px;
    text-align : center;
`
const Label = styled('div')`
    margin : 20%;
    margin-top : 8%;
    margin-bottom : 8%;
    font-size : 20px;
`
const MainDisplay = styled('div')`
    display : flex;
`
class ManageFacilityPage extends React.Component{
    constructor(){
        super();

        this.state={
            page : "add",
            loading : "",
            message : "",

            name : "",
            icon : "",
            group : "public",
            facilities : ""
        }
    }

    pageChange(ev){
        this.setState({
            page : ev.target.value
        })
    }

    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }
    
    submit(ev){
        ev.preventDefault();

        let formData = new FormData();
        formData.append('name', this.state.name)
        formData.append('icon', document.getElementById('icon').files[0])
        formData.append('group', this.state.group)

        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/addFacilities', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            if(response.data.message == 'success'){
                this.setState({
                    message : response.data.message,
                    loading : false
                });
            }
            else{
                this.setState({
                    errorName : response.data.name,
                    errorIcon : response.data.icon,
                    loading : false
                });
            }
            
        })
    }
  
    getAllFacilities(){
        this.setState({
            loading : true
        })
        Axios.post('http://localhost:8000/api/getFacilities',
        {
             token: sessionStorage.getItem('token'),
        }
        ).then(response => {
            this.setState({
                facilities : response.data
            }, ()=> {
                this.setState({
                    loading : false
                });
                // console.log(this.state.facilities)
            })
        })
    }

    checkUser(){
        if(sessionStorage.getItem('token') == null){
            return <Redirect to="/login" />
        }
        if(this.state.type != 3){
            if(this.state.type == 1){
                return <Redirect to="/"/>
            }
            else if(this.state.type == 2){
                return <Redirect to="/manageRentHouse"/>
            }
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
                type : response.data.user.type,
                loading : false
            })
        })
    }

    componentDidMount(){
        this.getUser();
        this.getAllFacilities();
    }

    render(){
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }

        let message = <Label>{this.state.message}</Label>;
        let content;
        if(this.state.page == "add"){
            content = <div>
                <MainDisplay>
                    <SplitMain>
                        <Label>Name</Label>
                        {this.state.errorName ? <br></br> : ""}
                        <Label>Icon</Label>
                        {this.state.errorIcon ? <br></br> : ""}
                        <Label>Group</Label>
                    </SplitMain>
                    <SplitMain>
                        <Label><input type="text" name="name" required onChange={this.dataChange.bind(this)}></input></Label>
                        {this.state.errorName}

                        <Label><input type="file" name="icon" id ="icon" required ></input></Label>
                        {this.state.errorIcon}
                        
                        <Label>
                            <select name="group" required onChange={this.dataChange.bind(this)}>
                                <option name="group" value="public">Public</option>
                                <option name="group" value="room">Room</option>
                            </select>
                            </Label>
                    </SplitMain>
                </MainDisplay>
                {message}
                <button onClick={this.submit.bind(this)}>Submit</button>
            </div>
        }else if(this.state.page == "delete"){
            content = <div>
                {
                    this.state.facilities && this.state.facilities.map((facilities, key)=> (
                        <PublicFacilities facilities={facilities} key={key} type="delete"></PublicFacilities>
                    ))
                }
            </div>
        }
        else if(this.state.page == "update"){
            content = <div>
                {
                    this.state.facilities && this.state.facilities.map((facilities, key)=> (
                        <PublicFacilities facilities={facilities} key={key} type="update"></PublicFacilities>
                    ))
                }
            </div>
        }
        return(
            <div>
                {this.checkUser()}
                {loading}
               <Container>
                   <NavBar></NavBar>
                   <BreadCrumbs></BreadCrumbs>
                    <Tab>
                        <button style={divStyle} value="add" onClick={this.pageChange.bind(this)}>Add Facility</button>
                        <button style={divStyle} value="update" onClick={this.pageChange.bind(this)}>Update Facility</button>
                        <button style={divStyle} value="delete" onClick={this.pageChange.bind(this)}>Delete Facility</button>
                    </Tab>
                    
                    <Main>
                        {content}
                    </Main>
                </Container>
            </div>
        )
    }
}

export default ManageFacilityPage