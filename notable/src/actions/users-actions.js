import {SERVER} from '../config/global'

export const GET_USER = 'GET_USER'
export const ADD_USER = 'ADD_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const LOGIN_USER = 'LOGIN_USER'
export const GET_USER_GROUPS = 'GET_USER_GROUPS'
export const CREATE_GROUP = 'CREATE_GROUP'
export const GET_USER_NOTES='GET_USER_NOTES'
export const GET_USER_WEBNOTES='GET_USER_WEBNOTES'

export function addUser(user){
    return {
      type : ADD_USER,
      payload : async () => {
          await fetch(`${SERVER}/users`, {
              method : 'post',
              headers : {
                  'Content-Type' : 'application/json'
              },
              body : JSON.stringify(user)
          })
          let response  = await fetch(`${SERVER}/users/${user.email}`)
          let json = await response.json()
          return json
      }
    }
  }


  export function getUser(email) {
    return {
      type: GET_USER,
      payload: async () => {
          let response  = await fetch(`${SERVER}/users/${email}`)
          let json = await response.json()
          if(json.message==="user not found")
            return null
          else
            return json
      }
    }
}

export function logOutUser() {
  return {
    type: LOGOUT_USER,
  }
}

export function getUserGroups(id) {
  return {
    type: GET_USER_GROUPS,
    payload: async () => {
        let response  = await fetch(`${SERVER}/user-groups/${id}`)
        let json = await response.json()
        let groups=json.grps
        return groups
    }
  }
}

export function getUserNotes(id) {
  return {
    type: GET_USER_NOTES,
    payload: async () => {
        let response  = await fetch(`${SERVER}/users/${id}/notes`)
        let json = await response.json()
        return json
    }
  }
}

export function getUserWebNotes(id) {
  return {
    type: GET_USER_WEBNOTES,
    payload: async () => {
        let response  = await fetch(`${SERVER}/users/${id}/webnotes`)
        let json = await response.json()
        return json
    }
  }
}

export function createGroup(id,name) {
  return {
    type: CREATE_GROUP,
    payload : async () => {
      await fetch(`${SERVER}/groups/${id}`, {
          method : 'post',
          headers : {
              'Content-Type' : 'application/json'
          },
          body : JSON.stringify({group_name: name})
      })
      let response  = await fetch(`${SERVER}/user-groups/${id}`)
        let json = await response.json()
        let groups=json.grps
        return groups
  }
  }
}
