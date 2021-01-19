import {SERVER} from '../config/global'

export const GET_GROUP_NOTES = 'GET_GROUP_NOTES'
export const GET_GROUP_WEBNOTES = 'GET_GROUP_WEBNOTES'
export const GET_GROUP_USERS = 'GET_GROUP_USERS'
export const GET_GROUP_LINKS = 'GET_GROUP_LINKS'
export const ADD_GROUP_USER = 'ADD_GROUP_USER'
export const ADD_WEBNOTE = 'ADD_WEBNOTE'
export const ADD_LINK = 'ADD_LINK'
export const EDIT_WEBNOTE = 'EDIT_WEBNOTE'
export const EDIT_GROUP_USER = 'ADD_GROUP_USER'
export const DELETE_GROUP_USER = 'DELETE_GROUP_USER'

export function getGroupNotes(id) {
    return {
      type: GET_GROUP_NOTES,
      payload: async () => {
          let response  = await fetch(`${SERVER}/groups/${id}/notes`)
          let json = await response.json()
          return json
      }
    }
}

export function getGroupWebNotes(id) {
  return {
    type: GET_GROUP_WEBNOTES,
    payload: async () => {
        let response  = await fetch(`${SERVER}/groups/${id}/webnotes`)
        let json = await response.json()
        return json
    }
  }
}

export function getGroupLinks(id) {
  return {
    type: GET_GROUP_LINKS,
    payload: async () => {
        let response  = await fetch(`${SERVER}/groups/${id}/links`)
        let json = await response.json()
        return json
    }
  }
}

export function getGroupUsers(id) {
  return {
    type: GET_GROUP_USERS,
    payload: async () => {
        let response  = await fetch(`${SERVER}/groups/${id}/users`)
        let json = await response.json()
        return json
    }
  }
}

export function addGroupUser(id,email){
  return {
    type : ADD_GROUP_USER,
    payload : async () => {
        await fetch(`${SERVER}/groups/${id}/${email}/add`, {
            method : 'post',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({})
        })
        let response  = await fetch(`${SERVER}/groups/${id}/users`)
        let json = await response.json()
        return json
    }
  }
}

export function addGroupWebNote(user_id,group_id,name,content){
  return {
    type : ADD_WEBNOTE,
    payload : async () => {
        await fetch(`${SERVER}/webnotes/${user_id}/${group_id}`, {
            method : 'post',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
              'name': name,
              'content': content
            })
        })
        let response  = await fetch(`${SERVER}/groups/${group_id}/webnotes`)
        let json = await response.json()
        return json
    }
  }
}

export function addGroupLink(user_id,group_id,name,link){
  return {
    type : ADD_LINK,
    payload : async () => {
        await fetch(`${SERVER}/links/${user_id}/${group_id}`, {
            method : 'post',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
              'name': name,
              'link': link
            })
        })
        let response  = await fetch(`${SERVER}/groups/${group_id}/links`)
        let json = await response.json()
        return json
    }
  }
}

export function editGroupWebNote(id,content,group_id){
  return {
    type : EDIT_WEBNOTE,
    payload : async () => {
        await fetch(`${SERVER}/webnotes/${id}`, {
            method : 'put',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
              'content': content
            })
        })
        let response  = await fetch(`${SERVER}/groups/${group_id}/webnotes`)
        let json = await response.json()
        return json
    }
  }
}

export function editGroupUser(group_id,user_id,role){
  return {
    type : EDIT_GROUP_USER,
    payload : async () => {
        await fetch(`${SERVER}/groups/${group_id}/${user_id}/edit/${role}`, {
            method : 'put',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({})
        })
        let response  = await fetch(`${SERVER}/groups/${group_id}/users`)
        let json = await response.json()
        return json
    }
  }
}

export function deleteGroupUser(group_id,user_id){
  return {
    type : DELETE_GROUP_USER,
    payload : async () => {
        await fetch(`${SERVER}/groups/${group_id}/${user_id}`, {
            method : 'delete',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({})
        })
        let response  = await fetch(`${SERVER}/groups/${group_id}/users`)
        let json = await response.json()
        return json
    }
  }
}