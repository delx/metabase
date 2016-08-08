import { AngularResourceProxy, createThunkAction, handleActions, combineReducers } from "metabase/lib/redux";

const MetabaseAPI = new AngularResourceProxy("Metabase", ["db_list"]);
const PermissionsAPI = new AngularResourceProxy("Permissions", ["groups", "groupDetails"]);

export const FETCH_PERMISSIONS_GROUPS = "FETCH_PERMISSIONS_GROUPS";
export const FETCH_PERMISSIONS_GROUP_DETAILS = "FETCH_PERMISSIONS_GROUP_DETAILS";
export const FETCH_DATABASES = "FETCH_DATABASES";

// ACTIONS

function makeThunkActionHandler(actionType, APIFunction) {
    return createThunkAction(actionType, function() {
        return async function(dispatch, getState) {
            return await APIFunction();
        };
    });
}

export const fetchGroups = makeThunkActionHandler(FETCH_PERMISSIONS_GROUPS, PermissionsAPI.groups);
export const fetchDatabases = makeThunkActionHandler(FETCH_DATABASES, MetabaseAPI.db_list);

export const fetchGroupDetails = createThunkAction(FETCH_PERMISSIONS_GROUP_DETAILS, function(groupID) {
    return async function(dispatch, getState) {
        return await PermissionsAPI.groupDetails({id: groupID});
    };
});


function makeActionHandler(actionType) {
    return handleActions({
        [actionType]: {
            next: function(state, { payload }) {
                return payload;
            }
        }
    }, null);
}

// REDUCERS
const groups = makeActionHandler(FETCH_PERMISSIONS_GROUPS);
const group = makeActionHandler(FETCH_PERMISSIONS_GROUP_DETAILS);
const databases = makeActionHandler(FETCH_DATABASES);

export default combineReducers({
    groups,
    group,
    databases
});
