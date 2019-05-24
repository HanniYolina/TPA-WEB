const initialState = {
    user : null,
    address : null,
    confirm : null
}

function changeReducer(state, object){
    return {
        ...state,
        ...object
    }
}

const reducer = (state = initialState, action) =>{
    if(action.type == 'store'){
        return changeReducer(state, {
            user : action.value
        })
    }

    if(action.type == 'storeMap'){
        return changeReducer(state, {
            address : action.value
        })
    }

    if(action.type == 'deleteConfirm'){
        return changeReducer(state, {
            confirm : action.value
        })
    }

    return initialState
}

export default reducer