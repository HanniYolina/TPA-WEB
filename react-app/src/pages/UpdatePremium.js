import React from 'react'
import styled from 'styled-components'
import NavBar from '../containers/NavBar';
import Axios from 'axios'
import BreadCrumbs from '../components/BreadCrumbs';

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

const Tab = styled('div')`
    display : flex;
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

class UpdatePremium extends React.Component{
    constructor(){
        super();

        this.state = {
            errorPrice : "",
            errorDuration : "",

            durationValue : 'month',
            page : "update"
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

    getPremiumById(){
        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/getPremiumById', {
            token: sessionStorage.getItem('token'),
            id : this.props.match.params.id
        }).then(response => {
            this.setState({
                price : response.data.price,
                duration : response.data.duration,
                promo : response.data.promo,
                loading : false
            }, ()=> this.getDuration())
        })
    }

    getDuration(){
        let duration = JSON.parse(this.state.duration)
        if(duration.month != 0){
            this.setState({
                durationValue : 'month'
            })
        }
        else if(duration.year != 0){
            this.setState({
                durationValue : 'year'
            })
        }
        else if(duration.day != 0){
            this.setState({
                durationValue : 'days'
            })
        }
        else if(duration.week != 0){
            this.setState({
                durationValue : 'week'
            })
        }
        this.setState({
            durationMonth : duration.month,
            durationYear : duration.year,
            durationDays : duration.day,
            durationWeek : duration.week
        })
    }

    submit(ev){
        console.log(this.state.durationValue)
        ev.preventDefault();

        let formData = new FormData();
        
        formData.append('id', this.props.match.params.id)
        formData.append('price', this.state.price)

        let duration = {'month' : 0, 'day': 0, 'week' : 0, 'year' : 0}
        if(this.state.durationValue == 'month'){
            duration.month = this.state.durationMonth
        }      
        else if(this.state.durationValue == 'year'){
            duration.year = this.state.durationYear
        }  
        else if(this.state.durationValue == 'days'){
            duration.day = this.state.durationDays
        }   
        else if(this.state.durationValue == 'week'){
            duration.week = this.state.durationWeek
        }

        formData.append('duration', JSON.stringify(duration))

        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/updatePremium', formData, {
            headers: {
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            this.setState({
                loading : false,
            });
            if(response.data.status != "success"){
                this.setState({
                    errorDuration : response.data.duration,
                    errorPrice : response.data.price,
                })
            }
            else{
                this.props.history.replace('/managePremiumPage');
            }
        })
    }

    addPromo(ev){
        ev.preventDefault();

        let formData = new FormData();
        
        formData.append('id', this.props.match.params.id)
        formData.append('promo', this.state.promo)

        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/addPromo', formData, {
            headers: {
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            this.setState({
                loading : false,
            });
            if(response.data.status != "success"){
                this.setState({
                    errorPromo : response.data.promo
                })
            }
            else{
                this.props.history.replace('/managePremiumPage');
            }
        })
    }

    deletePromo(ev){
        ev.preventDefault();

        let formData = new FormData();
        
        formData.append('id', this.props.match.params.id)
        formData.append('promo', 0)

        this.setState({
            loading : true
        })

        Axios.post('http://localhost:8000/api/addPromo', formData, {
            headers: {
                'Authorization' : 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(response => {
            this.setState({
                loading : false,
            });
            if(response.data.status == "success"){
                this.props.history.replace('/managePremiumPage');
            }
        })
    }

    componentDidMount(){
        this.getPremiumById();
    }

    render(){
        let content;
        let button;
        if(this.state.page == "add"){
            content = <div> 
                <Label>
                    <input type="number" name="promo" min="1" max="100" placeholder="Input Promo (persen)" value={this.state.promo} required onChange={this.dataChange.bind(this)}></input>        
                    <button onClick={this.addPromo.bind(this)}>Submit</button>
                </Label>
            </div>
        }else if(this.state.page == "delete"){
            content = <div>
                <Label>
                    <input type="number" name="promo" placeholder="There are no promo" value={this.state.promo}></input>        
                    <button onClick={this.deletePromo.bind(this)}>Delete</button>
                </Label>
            </div>
        }
        else if(this.state.page == "update"){
            content = <MainDisplay>
                 <SplitMain>
                    <Label>Price</Label>
                    {this.state.errorPrice ? <br></br> : ""}
                    <Label>Duration</Label>
                    {this.state.errorDuration ? <br></br> : ""}
                </SplitMain>
                <SplitMain>
                    <Label>
                    <input type="number" name="price" min="1000" placeholder="Input Price" value={this.state.price}required onChange={this.dataChange.bind(this)}></input>        
                    
                    {this.state.errorPrice}

                    </Label>
                    <Label>
                    {this.state.durationValue == "month" ?   
                    <input type="number" name="durationMonth" min="1" max="12" value={this.state.durationMonth} required onChange={this.dataChange.bind(this)}></input> : ""    
                    }
                    
                    {this.state.durationValue == "days" ?   
                    <input type="number" name="durationDays" min="1" max="30" value={this.state.durationDays} required onChange={this.dataChange.bind(this)}></input> : ""    
                    }

                    {this.state.durationValue == "year" ?   
                    <input type="number" name="durationYear" min="1" max="4" value={this.state.durationYear} required onChange={this.dataChange.bind(this)}></input> : ""    
                    }
                    
                    {this.state.durationValue == "week" ?   
                    <input type="number" name="durationWeek" min="1" max="10" value={this.state.durationWeek} required onChange={this.dataChange.bind(this)}></input> : ""    
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

            button = <button onClick={this.submit.bind(this)}>Submit</button>
        }
        return(
            <div>
                <NavBar></NavBar>
                <BreadCrumbs></BreadCrumbs>
                <Tab>
                    <button style={divStyle} value="update" onClick={this.pageChange.bind(this)}>Update Premium</button>
                    <button style={divStyle} value="add" onClick={this.pageChange.bind(this)}>Add Promo</button>
                    <button style={divStyle} value="delete" onClick={this.pageChange.bind(this)}>Delete Promo</button>
                </Tab>

                <Main>
                    {content}
                    {button}
                </Main>
            </div>
        )
    }
}

export default UpdatePremium