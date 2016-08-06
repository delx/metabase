(ns metabase.api.permissions
  "/api/permissions endpoints."
  (:require [compojure.core :refer [GET]]
            [metabase.api.common :refer :all]
            [metabase.db :as db]
            (metabase.models [permissions-group :refer [PermissionsGroup]]
                             [permissions-group-membership :refer [PermissionsGroupMembership]])))

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
  [id ]
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


(define-routes)
