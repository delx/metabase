(ns metabase.api.permissions
  "/api/permissions endpoints."
  (:require [clojure.string :as s]
            [compojure.core :refer [GET]]
            [metabase.api.common :refer :all]
            [metabase.db :as db]
            (metabase.models [database :as database]
                             [permissions-group :refer [PermissionsGroup]]
                             [permissions-group-membership :refer [PermissionsGroupMembership]])
            [metabase.util :as u]))

(defendpoint GET "/groups"
  "Fetch all `PermissionsGroups`."
  []
  (check-superuser)
  (db/query {:select    [:pg.id :pg.name [:%count.* :members]]
             :from      [[:permissions_group :pg]]
             :left-join [[:permissions_group_membership :pgm]
                         [:= :pg.id :pgm.group_id]]
             :group-by  [:pg.id :pg.name]
             :order-by  [:%lower.pg.name]}))

(defendpoint GET "/group/:id"
  "Fetch details for a specific `PermissionsGroup`."
  [id]
  (check-superuser)
  (assoc (PermissionsGroup id)
    :members   (db/query {:select   [:u.first_name :u.last_name :u.email [:u.id :user_id] [:pgm.id :membership_id]]
                          :from     [[:permissions_group_membership :pgm]]
                          :join     [[:core_user :u] [:= :pgm.user_id :u.id]]
                          :where    [:= :pgm.group_id id]
                          :order-by [:pgm.id]})
    :databases (db/query {:select   [:d.name [:d.id :database_id] [:dp.id :permissions_id] :unrestricted_schema_access :native_query_write_access]
                          :from     [[:database_permissions :dp]]
                          :join     [[:metabase_database :d] [:= :dp.database_id :d.id]]
                          :where    [:= :dp.group_id id]
                          :order-by [:%lower.d.name]})))



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
  (let [db-perms           (db/select-one 'DatabasePermissions
                             :database_id database-id
                             :group_id    group-id)
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
