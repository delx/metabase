import { AngularResourceProxy, createThunkAction, handleActions, combineReducers } from "metabase/lib/redux";

const MetabaseAPI = new AngularResourceProxy("Metabase", ["db_list"]);
const PermissionsAPI = new AngularResourceProxy("Permissions", ["groups", "groupDetails", "databaseDetails"]);

export const FETCH_PERMISSIONS_GROUPS = "FETCH_PERMISSIONS_GROUPS";
export const FETCH_PERMISSIONS_GROUP_DETAILS = "FETCH_PERMISSIONS_GROUP_DETAILS";
export const FETCH_DATABASES = "FETCH_DATABASES";
export const FETCH_DATABASE_PERMISSIONS_DETAILS = "FETCH_DATABASE_PERMISSIONS_DETAILS";

// ACTIONS

function makeThunkActionHandler(actionType, APIFunction) {
    return createThunkAction(actionType, function() {
        return async function(dispatch, getState) {
            return await APIFunction();
        };
    });
}

function makeThunkActionHandlerWithID(actionType, APIFunction) {
    return createThunkAction(actionType, function(id) {
        return async function(dispatch, getState) {
            return await APIFunction({id: id});
        };
    });
}

export const fetchGroups = makeThunkActionHandler(FETCH_PERMISSIONS_GROUPS, PermissionsAPI.groups);
export const fetchDatabases = makeThunkActionHandler(FETCH_DATABASES, MetabaseAPI.db_list);
export const fetchGroupDetails = makeThunkActionHandlerWithID(FETCH_PERMISSIONS_GROUP_DETAILS, PermissionsAPI.groupDetails);
export const fetchDatabaseDetails = makeThunkActionHandlerWithID(FETCH_DATABASE_PERMISSIONS_DETAILS, PermissionsAPI.databaseDetails);


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
const database = makeActionHandler(FETCH_DATABASE_PERMISSIONS_DETAILS);

export default combineReducers({
    groups,
    group,
    databases,
    database
});
