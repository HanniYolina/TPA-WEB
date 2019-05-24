import React from 'react'
import styled from 'styled-components'
import logoImg from '../assets/logo.png';
import emailLogo from '../assets/emailLogo.png'
import phoneLogo from '../assets/phoneLogo.png'

const Container = styled('div')`
    width : 100vw;
    height : 35vh;
`
const Content = styled('div')`
    width : 60vw;
    height : 100%;
    margin : 0 auto;
    text-align : center;
    padding-top : 5%;
`
const Image = styled('div')`
    width : 8vw;
    height : 8vh;
    background-size: 100%;
`
const LogoText = styled('div')`
    display : flex;
    justify-content : center;
`

class Footer extends React.Component{
    render(){
        return(
            <div>
                <Container>
                    <Content>
                        <img src={logoImg} id="logo"></img>
                        <p>Dapatkan "info kost murah" hanya di BarbarKos App.</p>
                        
                        <LogoText>
                        <Image style={{backgroundImage : `url(${emailLogo})`}}></Image>
                        <span style={{marginTop : '5%'}}>saran@barbarkos.com</span>
                        </LogoText>
                        
                        <LogoText>
                        <Image style={{backgroundImage : `url(${phoneLogo})`}}></Image>
                        <span style={{marginTop : '5%'}}>08123123123</span>
                        </LogoText>
                

                    </Content>
                </Container>
            </div>
        )
    }
}

export default Footer