(ns metabase.api.permissions
  "/api/permissions endpoints."
  (:require [compojure.core :refer [GET]]
            [metabase.api.common :refer :all]
            [metabase.db :as db]
            #_(metabase.models [permissions-group :refer [PermissionsGroup]])))

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


(define-routes)
