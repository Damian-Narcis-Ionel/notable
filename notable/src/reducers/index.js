import { combineReducers } from 'redux'
import user from './users-reducer'
import group from './groups-reducer'

export default combineReducers({
    user,group
})