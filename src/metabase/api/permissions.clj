(ns metabase.api.permissions
  "/api/permissions endpoints."
  (:require [clojure.string :as s]
            [compojure.core :refer [GET POST]]
            [metabase.api.common :refer :all]
            [metabase.db :as db]
            (metabase.models [database :as database]
                             [hydrate :refer [hydrate]]
                             [permissions-group :refer [PermissionsGroup], :as group]
                             [permissions-group-membership :refer [PermissionsGroupMembership]])
            [metabase.util :as u]))

;; TODO - should be GET /api/permissions/group
(defendpoint GET "/groups"
  "Fetch all `PermissionsGroups`."
  []
  (check-superuser)
  ;; TODO - this is complicated, should we just do normal queries and hydration here?
  (db/query {:select    [:pg.id :pg.name [:%count.pgm.id :members]]
             :from      [[:permissions_group :pg]]
             :left-join [[:permissions_group_membership :pgm]
                         [:= :pg.id :pgm.group_id]]
             :group-by  [:pg.id :pg.name]
             :order-by  [:%lower.pg.name]}))

(defendpoint POST "/group"
  "Create a new `PermissionsGroup`."
  [:as {{:keys [name]} :body}]
  {name [Required NonEmptyString]}
  (println "(group/exists-with-name?" name ") ->" (group/exists-with-name? name))
  (check (not (group/exists-with-name? name))
    400 "A group with that name already exists.")
  (db/insert! PermissionsGroup
    :name name))

;; TODO - should this be moved to `metbabase.models.permission-group`?
(defn- group-id->databases [group-id]
  (let [db-id->permissions  (u/key-by :database_id (db/select ['DatabasePermissions :database_id :unrestricted_schema_access :native_query_write_access [:id :permissions_id]]
                                                     :group_id group-id))
        db-id->schema-perms (u/key-by :database_id (db/select 'SchemaPermissions
                                                     :group_id group-id))]
    (for [db (db/select ['Database [:id :database_id] :name]
               {:order-by [:%lower.name]})]
      (merge db
             (or (db-id->permissions (:database_id db))
                 {:unrestricted_schema_access false, :native_query_write_access false, :permissions_id nil})
             {:schemas (or (db-id->schema-perms (:database_id db))
                           [])}))))

(defendpoint GET "/group/:id"
  "Fetch details for a specific `PermissionsGroup`."
  [id]
  (check-superuser)
  ;; TODO - this is too complicated, just do normal queries and hydration here
  (assoc (PermissionsGroup id)
    :members   (group/members {:id id})
    :databases (group-id->databases id)))

(defendpoint POST "/group/:id/user"
  "Add a `User` to a `PermissionsGroup`. Returns updated list of members belonging to the group."
  [id, :as {{:keys [user_id]} :body}]
  {user_id [Required Integer]}
  (check-superuser)
  (db/insert! PermissionsGroupMembership
    :group_id id
    :user_id user_id)
  (group/members {:id id}))

(defendpoint GET "/database/:id"
  "Fetch details about Permissions for a specific `Database`."
  [id]
  (check-superuser)
  (let [group-id->db-permissions (u/key-by :group_id (db/select 'DatabasePermissions :database_id id))
        ;; TODO - handle schema permissions
        ;; schema-permissions       (db/select 'SchemaPermissions :database_id id)
        schemas                  (database/schemas {:id id})
        groups                   (db/select 'PermissionsGroup
                                   {:order-by [:name]})]
    {:id      id
     :schemas (for [schema schemas]
                {:name schema
                 :groups (cons
                          {:name "FAKE", :access nil, :id 100}
                          (for [group groups
                                :let  [db-perms (group-id->db-permissions (:id group))]]
                            (assoc group
                              :access (when (:unrestricted_schema_access db-perms)
                                        "All tables"))))})}))

(defendpoint GET "/database/:database-id/group/:group-id"
  "Get details about the permissions for a specific Group for a specific Database."
  [database-id group-id]
  (check-superuser)
  (let [db-perms           (or (db/select-one 'DatabasePermissions
                                 :database_id database-id
                                 :group_id    group-id)
                               {:database_id                database-id
                                :group_id                   group-id
                                :unrestricted_schema_access false
                                :native_query_write_access  false
                                :id                         nil})
        schema-name->perms (when-not (:unrestricted_schema_access db-perms)
                             (u/key-by :schema (db/select 'SchemaPermissions :database_id 1, :group_id 1)))]
    (assoc db-perms
      :schemas (for [schema-name (sort-by (comp s/lower-case :name)
                                          (database/schemas {:id database-id}))]
                 {:name schema-name
                  :access (if (:unrestricted_schema_access db-perms)
                            "All tables"
                            (schema-name->perms schema-name))}))))



(define-routes)
