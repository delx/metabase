import { AngularResourceProxy, createThunkAction, handleActions, combineReducers } from "metabase/lib/redux";

const MetabaseAPI = new AngularResourceProxy("Metabase", ["db_list"]);
const PermissionsAPI = new AngularResourceProxy("Permissions", ["groups", "groupDetails", "databaseDetails", "databasePermissions"]);

export const FETCH_PERMISSIONS_GROUPS = "FETCH_PERMISSIONS_GROUPS";
export const FETCH_PERMISSIONS_GROUP_DETAILS = "FETCH_PERMISSIONS_GROUP_DETAILS";
export const FETCH_DATABASES = "FETCH_DATABASES";
export const FETCH_DATABASE_PERMISSIONS_DETAILS = "FETCH_DATABASE_PERMISSIONS_DETAILS";
export const FETCH_DATABASE_PERMISSIONS = "FETCH_DATABASE_PERMISSIONS";

// ACTIONS

function makeThunkActionHandler(actionType, APIFunction, prepareArgs) {
    return createThunkAction(actionType, function() {
        const args = arguments;
        return async function(dispatch, getState) {
            return await APIFunction.apply(null, prepareArgs ? prepareArgs.apply(null, args) : null);
        };
    });
}

export const fetchGroups = makeThunkActionHandler(FETCH_PERMISSIONS_GROUPS, PermissionsAPI.groups);
export const fetchDatabases = makeThunkActionHandler(FETCH_DATABASES, MetabaseAPI.db_list);
export const fetchGroupDetails = makeThunkActionHandler(FETCH_PERMISSIONS_GROUP_DETAILS, PermissionsAPI.groupDetails,
                                                        (id) => [{id: id}]);
export const fetchDatabaseDetails = makeThunkActionHandler(FETCH_DATABASE_PERMISSIONS_DETAILS, PermissionsAPI.databaseDetails,
                                                           (id) => [{id: id}]);
export const fetchDatabasePermissions = makeThunkActionHandler(FETCH_DATABASE_PERMISSIONS, PermissionsAPI.databasePermissions,
                                                               (databaseID, groupID) => [{databaseID: databaseID, groupID: groupID}]);

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
const databasePermissions = makeActionHandler(FETCH_DATABASE_PERMISSIONS);

export default combineReducers({
    groups,
    group,
    databases,
    database,
    databasePermissions
});
