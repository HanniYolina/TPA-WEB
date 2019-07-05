import React from 'react'
import styled from 'styled-components'
import Axios from 'axios'
import Loading from '../components/Loading'
import NavBar from '../containers/NavBar';
import {Redirect} from 'react-router-dom';
import PremiumDetail from '../containers/PremiumDetail';
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
    height : auto;
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

            durationValue : "month",
            durationDays : 0,
            durationMonth : 0,
            durationWeek : 0,
            durationYear : 0,
            promo : 0,
            price : null,

            pageNum : 0
        }
    }

    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }

    pageChange(ev){
        this.setState({
            page : ev.target.value
        })
    }
    
    submit(ev){
        ev.preventDefault();

        let formData = new FormData();
        
        if(this.state.price){
            formData.append('price', this.state.price)
        }
        
        let duration = {'month' : 0, 'day': 0, 'week' : 0, 'year' : 0}
        if(this.state.durationMonth || this.state.durationDays || this.state.durationWeek || this.state.durationYear){
            duration.month = this.state.durationMonth
            duration.day = this.state.durationDays
            duration.week = this.state.durationWeek
            duration.year = this.state.durationYear
        }        

        formData.append('duration', JSON.stringify(duration))

        this.setState({
            loading : true
        })

        formData.append('promo', this.state.promo)

        Axios.post('http://localhost:8000/api/addPremiumProduct', formData, {
            headers: {
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            console.log(response.data)
            this.setState({
                loading : false,
            });
            if(response.data.status != "success"){
                this.setState({
                    errorDuration : response.data.duration,
                    errorPrice : response.data.price,
                },()=>console.log(response.data))
            }
            else{
                this.props.history.replace('/managePremiumPage');
            }
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
                return <Redirect to="/ownerDashboard"/>
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

    getPremium(){
        this.setState({
            loading : true
        })

        Axios.post(`http://localhost:8000/api/getAllPremium?page=${this.state.pageNum}`, {
            token: sessionStorage.getItem('token')
        }).then(response => {
            this.setState({
                premium : response.data.data,
                last_page : response.data.last_page,
                loading : false
            }, ()=>console.log(this.state.premium))
        })
    }

    componentDidMount(){
        this.getUser();
        this.getPremium();
    }

    changePageNum(){
        let curr = this.state.pageNum
        if(this.state.pageNum == this.state.last_page){
            this.setState({
                pageNum : 1
            }, ()=> this.getPremium())
        }
        else{
            this.setState({
                pageNum : curr + 1
            }, ()=> this.getPremium())
        }
    }

    getFilteredPremium(){

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
                        <Label>Price</Label>
                        {this.state.errorPrice ? <br></br> : ""}
                        <Label>Duration</Label>
                        {this.state.errorDuration ? <br></br> : ""}
                    </SplitMain>
                    <SplitMain>
                        <Label>
                        <input type="number" name="price" min="1000" placeholder="Input Price" required onChange={this.dataChange.bind(this)}></input>        
                        
                        {this.state.errorPrice}

                        </Label>
                        <Label>
                        {this.state.durationValue == "month" ?   
                        <input type="number" name="durationMonth" min="1" max="12" required onChange={this.dataChange.bind(this)}></input> : ""    
                        }
                        
                        {this.state.durationValue == "days" ?   
                        <input type="number" name="durationDays" min="1" max="30" required onChange={this.dataChange.bind(this)}></input> : ""    
                        }

                        {this.state.durationValue == "year" ?   
                        <input type="number" name="durationYear" min="1" max="4" required onChange={this.dataChange.bind(this)}></input> : ""    
                        }
                        
                        {this.state.durationValue == "week" ?   
                        <input type="number" name="durationWeek" min="1" max="10" required onChange={this.dataChange.bind(this)}></input> : ""    
                        }
                            
                        <select name="durationValue" required onChange={this.dataChange.bind(this)}>
                            <option name="durationValue" value="month">Month</option>
                            <option name="durationValue" value="days">Days</option>
                            <option name="durationValue" value="week">Week</option>
                            <option name="durationValue" value="year">Year</option>
                        </select>
                        </Label>
                        {this.state.errorDuration}
                    </SplitMain>
                </MainDisplay>
                {message}
                <button onClick={this.submit.bind(this)}>Submit</button>
            </div>
        }else if(this.state.page == "delete"){
            content = <div>
                {
                    this.state.premium && this.state.premium.map((premium, key)=> (
                        <PremiumDetail premium={premium} type="delete" key={key}></PremiumDetail>
                    ))
                }
                <button onClick={this.changePageNum.bind(this)}>Next</button>
            </div>
        }
        else if(this.state.page == "update"){
            content = <div>
                {
                    this.state.premium && this.state.premium.map((premium, key)=> (
                        <PremiumDetail premium={premium} type="update" key={key}></PremiumDetail>
                    ))
                }
                <button onClick={this.changePageNum.bind(this)}>Next</button>
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
                        <button style={divStyle} value="add" onClick={this.pageChange.bind(this)}>Add Premium</button>
                        <button style={divStyle} value="update" onClick={this.pageChange.bind(this)}>Update Premium</button>
                        <button style={divStyle} value="delete" onClick={this.pageChange.bind(this)}>Delete Premium</button>
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