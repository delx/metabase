import { AngularResourceProxy, createThunkAction, handleActions, combineReducers } from "metabase/lib/redux";

const MetabaseAPI = new AngularResourceProxy("Metabase", ["db_list"]);
const PermissionsAPI = new AngularResourceProxy("Permissions", ["groups", "groupDetails", "databaseDetails", "databasePermissions"]);
const UsersAPI = new AngularResourceProxy("User", ["list"]);

export const FETCH_PERMISSIONS_GROUPS = "FETCH_PERMISSIONS_GROUPS";
export const FETCH_PERMISSIONS_GROUP_DETAILS = "FETCH_PERMISSIONS_GROUP_DETAILS";
export const FETCH_DATABASES = "FETCH_DATABASES";
export const FETCH_DATABASE_PERMISSIONS_DETAILS = "FETCH_DATABASE_PERMISSIONS_DETAILS";
export const FETCH_DATABASE_PERMISSIONS = "FETCH_DATABASE_PERMISSIONS";
export const PERMISSIONS_FETCH_USERS = "PERMISSIONS_FETCH_USERS";

// ACTIONS

function makeThunkActionHandler(actionType, APIFunction, prepareArgsFn) {
    return createThunkAction(actionType, function() {
        const args = arguments;
        return async function(dispatch, getState) {
            return await APIFunction.apply(null, prepareArgsFn ? prepareArgsFn.apply(null, args) : args);
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
export const fetchUsers = makeThunkActionHandler(PERMISSIONS_FETCH_USERS, UsersAPI.list);

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
const users = makeActionHandler(PERMISSIONS_FETCH_USERS);

export default combineReducers({
    groups,
    group,
    databases,
    database,
    databasePermissions,
    users
});
