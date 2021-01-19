const INITIAL_STATE = {
    notes: null,
    webnotes: null,
    links: null,
    users: null,
    error : null,
    fetching : false,
    fetched : false
}


export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type){
       case 'GET_GROUP_NOTES_PENDING':
       case 'GET_GROUP_USERS_PENDING':
       case 'ADD_GROUP_USER_PENDING':
       case 'EDIT_GROUP_USER_PENDING':
       case 'DELETE_GROUP_USER_PENDING':
       case 'GET_GROUP_WEBNOTES_PENDING': 
       case 'ADD_WEBNOTE_PENDING':
       case 'GET_GROUP_LINKS_PENDING': 
       case 'ADD_LINK_PENDING':
       case 'EDIT_WEBNOTE_PENDING':  
        return  {...state, error : null, fetching : true, fetched : false}
       case 'GET_GROUP_NOTES_FULFILLED' :   
        return {...state,notes: action.payload, error: null, fetched : true,fetching: false} 
       case 'GET_GROUP_WEBNOTES_FULFILLED' :
       case 'ADD_WEBNOTE_FULFILLED':
       case 'EDIT_WEBNOTE_FULFILLED':
        return {...state,webnotes: action.payload, error: null, fetched : true,fetching: false} 
       case 'GET_GROUP_LINKS_FULFILLED':
       case 'ADD_LINK_FULFILLED':
        return {...state,links: action.payload, error: null, fetched : true,fetching: false}
       case 'GET_GROUP_USERS_FULFILLED' :
       case 'ADD_GROUP_USER_FULFILLED':
       case 'EDIT_GROUP_USER_FULFILLED':
       case 'DELETE_GROUP_USER_FULFILLED':    
        return {...state,users: action.payload, error: null, fetched : true,fetching: false}
       case 'GET_GROUP_NOTES_REJECTED':
       case 'GET_GROUP_WEBNOTES_REJECTED':
       case 'GET_GROUP_LINKS_REJECTED':
       case 'GET_GROUP_USERS_REJECTED': 
       case 'ADD_GROUP_USER_REJECTED':
       case 'EDIT_GROUP_USER_REEJCTED':
       case 'DELETE_GROUP_USER_REEJCTED':
       case 'ADD_WEBNOTE_REJECTED':
       case 'ADD_LINK_REJECTED':
       case 'EDIT_WEBNOTE_REJECTED':
        return {...state, error: action.payload, fetched : true,fetching: false}
        default:
            break
    }
    return state
}