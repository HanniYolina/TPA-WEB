import React from 'react'
import styled from 'styled-components'
import NavBar from '../containers/NavBar';
import BreadCrumbs from '../components/BreadCrumbs';
import Axios from 'axios'

const InvoiceContainer = styled('div')`
    width : 80vw;
`

const Container = styled('div')`
    width : 100vw;
    height : 100vh;
`
class InvoicePage extends React.Component{

    constructor(){
        super();

        this.state = {
            transaction : ""
        }
    }
    getPremiumPurchase(){
        this.setState({
            loading : true
        })

        Axios.post(`http://localhost:8000/api/getTransactionById`, {
            token: sessionStorage.getItem('token'),
            id : this.props.match.params.id
        }).then(response => {
            this.setState({
                loading : false,
                transaction : response.data
            },()=>{console.log(this.state.transaction)})
        })
    }

    componentDidMount(){
        this.getPremiumPurchase();
    }
    render(){
        let id = this.props.match.params.id;
        return(
            <div>
                <Container>
                    <NavBar></NavBar>
                    <BreadCrumbs></BreadCrumbs>
                    <InvoiceContainer>
                    <div class="information">
                        <table width="100%">
                            <tr>
                                <td align="left" style={{width: '40%'}}>
                                    <h3>Premium Product Invoice</h3>
                                    <pre>
                    
                                    <br /><br />
                                    Status: {this.state.transaction.paid_at ? "Paid" : "Not Paid"}
                                    </pre>


                                </td>

                                <td align="right" style={{width: '40%'}}>

                                    <pre>
                                        https://barbarkost.com

                                        Jakarta Barat
                                        Indonesia
                                    </pre>
                                </td>
                            </tr>

                        </table>
                    </div>


                    <br/>

                    <div class="invoice">
                        <h3>Premium Product Transaction</h3>
                        <table width="100%">
                            <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Price</th>
                                <th>Paid At</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{this.state.transaction.invoice}</td>
                                <td>{this.state.transaction.price}</td>
                                <td>{this.state.transaction.paid_at ? this.state.transaction.paid_at : "Not yet"}</td>
                            </tr>

                            </tbody>
                        </table>
                    </div>

                    <div class="information" style={{position: 'absolute', bottom: '0', width: '100%'}}>
                        <table width="100%">
                            <tr>
                                <td align="right" style={{width: '50%'}}>
                                    BarBar Kost
                                </td>
                            </tr>

                        </table>
                    </div>
                    </InvoiceContainer>
                </Container>               
            </div>
        )
    }
}

export default InvoicePage
