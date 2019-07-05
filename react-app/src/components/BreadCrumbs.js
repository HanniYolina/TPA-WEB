import React from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

const BC = styled('div')`
    height: 45px;
    padding: 10px;
    box-shadow: 0px 2px 24px 0px rgba(0, 0, 0, 0.15)
`
    
const Bread = styled('div')`
    display: inline-block;
    margin-left: 5px;
    color: #525252;
    font-size: 14px;

`

class BreadCrumbs extends React.Component{
    render(){
        var bc = []
        let path = window.location.pathname.split('/')
        bc.push(<Bread><Link to={"/"}>home</Link> </Bread>)
        path.forEach(p => {
            if(p==path[path.length-1]){
                bc.push(<Bread>{p}</Bread>)
            }
            else bc.push(<Bread><Link to={"/"+p}>{p} ></Link></Bread>)
        });
        return(
            <BC>
                {bc}
            </BC>
        )
    }
}

export default BreadCrumbs