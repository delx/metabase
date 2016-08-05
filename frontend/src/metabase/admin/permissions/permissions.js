import { AngularResourceProxy, createThunkAction, handleActions, combineReducers } from "metabase/lib/redux";

const PermissionsAPI = new AngularResourceProxy("Permissions", ["groups"]);

export const FETCH_PERMISSIONS_GROUPS = "FETCH_PERMISSIONS_GROUPS";

// ACTIONS
export const fetchGroups = createThunkAction(FETCH_PERMISSIONS_GROUPS, function() {
    return async function(dispatch, getState) {
        let groups = await PermissionsAPI.groups();

        console.log('groups = ', groups);

        return groups;
    };
});

// REDUCERS
const groups = handleActions({
    [FETCH_PERMISSIONS_GROUPS]: {
        next: (state, {payload}) => payload
    }
}, null);

export default combineReducers({
    groups
});
