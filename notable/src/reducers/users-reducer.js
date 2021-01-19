const INITIAL_STATE = {
    groups: null,
    user : null,
    error : null,
    fetching : false,
    fetched : false,
    notes: null,
    webnotes: null,
}
  
export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type){
        case 'GET_USER_PENDING':
        case 'ADD_USER_PENDING':
        case 'GET_USER_GROUPS_PENDING':
        case 'CREATE_GROUP_PENDING' :
        case 'GET_USER_NOTES_PENDING':
        case 'GET_USER_WEBNOTES_PENDING':
            return  {...state, error : null, fetching : true, fetched : false}           
        case 'GET_USER_FULFILLED':
        case 'ADD_USER_FULFILLED':               
            return {...state, user : action.payload, error: null, fetched : true, fetching : false}
        case 'GET_USER_GROUPS_FULFILLED':
        case 'CREATE_GROUP_FULFILLED' :    
            return {...state,groups: action.payload, error: null, fetched : true,fetching: false}    
        case 'GET_USER_NOTES_FULFILLED':
            return {...state,notes: action.payload, error: null, fetched : true,fetching: false}
        case 'GET_USER_WEBNOTES_FULFILLED':
            return {...state,webnotes: action.payload, error: null, fetched : true,fetching: false}       
        case 'GET_USER_REJECTED':
        case 'ADD_USER_REJECTED':
        case 'GET_USER_GROUPS_REJECTED':
        case 'CREATE_GROUP_REJECTED' :
        case 'GET_USER_NOTES_REJECTED': 
        case 'GET_USER_WEBNOTES_REJECTED':                                 
            return {...state, error : action.payload, fetching: false, fetched : false}
        case 'LOGOUT_USER' :
            return {...state, user : null,groups : null, error: null, fetched : true, fetching : false}  
        default:
            break
    }
    return state
}