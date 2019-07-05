import React from 'react'
import styled from 'styled-components'
import Loading from '../components/Loading'
import Axios from 'axios'

const Popup = styled('div')`  
    position: absolute;  
    width: 100%;
    height: 100%;  
    top: 0;
    left: 0; 
    right: 0; 
    bottom: 0;
    margin: auto;  
    background-color: rgba(0,0,0, 0.5);  
    z-index : 999
`
const PopupInner = styled('div')`  
    position: absolute;  
    left: 25%;  
    right: 25%;  
    top: 25%;  
    bottom: 25%;  
    margin: 0 auto;  
    border-radius: 20px;  
    background: white; 
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
    padding : 5px;
`

const Display = styled('div') `
    display : flex
`

class PopUp extends React.Component{
    constructor(){
        super();

        this.state = {
            loading : false,
            reportType : "price"
        }
    }

    createReport(){
        this.setState({
            loading : true
        });

        Axios.post(`http://localhost:8000/api/createReport`,{
            token: sessionStorage.getItem('token'),
            user_id : this.props.user_id,
            properties_id : this.props.properties_id,
            contents : this.state.contents,
            type : this.state.reportType
        }).then(response => {
            this.setState({
                loading : false,
            })
            this.props.closeReport();
        })
    }

    dataChange(ev){
        this.setState({
            [ev.target.name] : ev.target.value
        })
    }

    render(){  
        let button = 
            <Display>
                <button onClick={this.createReport.bind(this)}>Report</button>
            </Display>
        
        let loading;
        if(this.state.loading){
            loading = <Loading></Loading>
        }

        return (  
            <Popup>
                {loading}
                <PopupInner>
                <Main>
                    <label>Input Report</label>
                    <input type="text" name="contents" placeholder="Input Report" onChange={this.dataChange.bind(this)}></input>

                    <br></br> <br></br>
                    <label>Report Type</label>
                    <select name="reportType" required onChange={this.dataChange.bind(this)}>
                        <option name="reportType" value="price">Price</option>
                        <option name="reportType" value="facilities">Facilities</option>
                        <option name="reportType" value="address">Address</option>
                        <option name="reportType" value="photo">Photo</option>
                    </select>

                    <br></br> <br></br>
                    {button}
                </Main>
                </PopupInner>
            </Popup>
        )}  
}

export default PopUp