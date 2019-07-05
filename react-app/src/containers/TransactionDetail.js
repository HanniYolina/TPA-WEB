import React from 'react'
import PopUp from '../components/PopUp'
import Axios from 'axios'

const UserStyle = {
    height: '190px',
    width: '20%',
    margin: '20px',
    padding: '15px',
    border: '2px grey solid',
    boxShadow : '6px 8px lightgrey'
}


class TransactionDetail extends React.Component{
    render(){
        let transaction = this.props.transaction
        return(
        <div style={UserStyle}>
            <span>Invoice Number: {transaction.invoice}</span>
            <br></br>
            <span>Price : {transaction.price}</span>
            <br></br>
            <span>Paid at : {transaction.paid_at}</span>
            
        </div>
    )}
}

export default TransactionDetail