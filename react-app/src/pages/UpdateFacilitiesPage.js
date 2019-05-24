import React from 'react'
import NavBar from '../containers/NavBar'
import styled from 'styled-components'
import Axios from 'axios'
import { Redirect } from 'react-router-dom'
import Loading from '../components/Loading'

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

class UpdateFacilities extends React.Component{
    constructor(){
        super();

        this.state = {
            loading : "",
            facilities : "",
            redirect : false,

            name : "",
            group : "public",
            icon : "",
        }
    }
    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        }) 
        
    }

    update(ev){
        ev.preventDefault();

        let formData = new FormData();
        formData.append('id', this.props.match.params.id)
        formData.append('name', this.state.name)
        formData.append('icon', document.getElementById('icon').files[0])
        formData.append('group', this.state.group)

        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/updateFacilities', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            if(response.data.message == 'success'){
                this.setState({
                    message : response.data.message,
                    loading : false,
                });
            }
            else{
                this.setState({
                    errorName : response.data.name,
                    errorIcon : response.data.icon,
                    loading : false,
                });
            }

        })

    }

    getFacilityById(){
        this.setState({
            loading : true
        })
        Axios.post('http://localhost:8000/api/getFacilitiesById',
        {
             token: sessionStorage.getItem('token'),
             id : this.props.match.params.id
        }
        ).then(response => {
            this.setState({
                facilities : response.data,
                name : response.data[0].name,
                group : response.data[0].group,
                loading : false
            })
        })
    }

    componentDidMount(){
        this.getFacilityById();
        
    }
    
    changePage(){
        if (this.state.redirect) {
            return <Redirect to="/manageFacilityPage"/>
        }
    }

    setRedirect(){
        this.setState({
          redirect: true
        })
    }

    render(){
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }
        return(
            <div>
                {loading}
                {this.changePage()}
                {this.state.facilities ? <div>
                    <NavBar></NavBar>
                    <MainDisplay>
                        <SplitMain>
                            <Label>Name</Label>
                            {this.state.errorName ? <br></br> : ""}
                            <Label>Icon</Label>
                            {this.state.errorIcon ? <br></br> : ""}
                            <Label>Group</Label>
                        </SplitMain>
                        <SplitMain>
                            <Label><input type="text" name="name" required onChange={this.dataChange.bind(this)} value={this.state.name} placeholder={this.state.facilities[0].name}></input></Label>
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
                    {this.state.message}
                    <MainDisplay>
                        <button onClick={this.setRedirect.bind(this)}>Back</button>
                        <button onClick={this.update.bind(this)}>Update</button>
                    </MainDisplay>
                    
                </div> 
            : null}
            
            
            </div>
        )
    }

}

export default UpdateFacilities