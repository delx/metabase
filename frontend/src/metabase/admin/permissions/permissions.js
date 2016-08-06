import { AngularResourceProxy, createThunkAction, handleActions, combineReducers } from "metabase/lib/redux";

const PermissionsAPI = new AngularResourceProxy("Permissions", ["groups", "groupDetails"]);

export const FETCH_PERMISSIONS_GROUPS = "FETCH_PERMISSIONS_GROUPS";
export const FETCH_PERMISSIONS_GROUP_DETAILS = "FETCH_PERMISSIONS_GROUP_DETAILS";

// ACTIONS
export const fetchGroups = createThunkAction(FETCH_PERMISSIONS_GROUPS, function() {
    return async function(dispatch, getState) {
        // try {
            return await PermissionsAPI.groups();
        // } catch (error) {
        //     console.error('Error loading groups:', error);
        // }
    };
});

export const fetchGroupDetails = createThunkAction(FETCH_PERMISSIONS_GROUP_DETAILS, function(groupID) {
    return async function(dispatch, getState) {
        // try {
            return await PermissionsAPI.groupDetails({id: groupID});
        // } catch (error) {
        //     console.error('Error loading group details:', error);
        // }
    };
});

// REDUCERS
const groups = handleActions({
    [FETCH_PERMISSIONS_GROUPS]: {
        next: (state, {payload}) => payload
    }
}, null);

const group = handleActions({
    [FETCH_PERMISSIONS_GROUP_DETAILS]: {
        next: (state, {payload}) => payload
    }

}, null);

export default combineReducers({
    groups,
    group
});
