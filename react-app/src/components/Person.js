import React from 'react';

class Person extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return(
            <div>
                <h1>My name is {this.props.name}</h1>
            </div>
        );
    }
}

export default Person;