import React from 'react';

const PersonItem = (props)=>{
    return(
        <div>
            <h1>
                Functional component
            </h1>
            <span>
                My Name: {props.name}
            </span>
        </div>
    );
}


export default PersonItem;