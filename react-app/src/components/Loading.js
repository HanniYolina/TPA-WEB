import React from 'react'
import styled, { keyframes } from 'styled-components'

const Container = styled('div')`
    background-color : white;
    width: 100vw;
    height : 100vh;
    position : fixed;
    z-index : 1000;
    justify-content : center;
    display : flex;
`

const Load = styled('div')`
    width : 30vw;
    height : 10vh;
    margin-top : 40vh;
    justify-content : center;
    display : flex;
`

const Bounce = keyframes`
    0% { margin-bottom: 0}
    50% { margin-bottom: 15px }
    100% { margin-bottom: 0 }
`

const DotWrapper = styled('div')`
    display: flex;
    align-items: flex-end;  
`
const Dot = styled('div')`
    background-color: #3cba92;
    width: 20px;
    height: 20px;
    margin: 5px;

    animation: ${Bounce} 0.5s linear infinite;
    animation-delay: ${props => props.delay};
`

class Loading extends React.Component{
    render(){
        return(
            <div>
                <Container>
                    <Load>
                        <DotWrapper>
                            <Dot delay="0s" />
                            <Dot delay=".1s" />
                            <Dot delay=".2s" />
                        </DotWrapper>
                    </Load>
                </Container>
            </div>
        )
    }

}

export default Loading