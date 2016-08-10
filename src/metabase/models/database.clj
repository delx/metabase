(ns metabase.models.database
  (:require [clojure.string :as s]
            [cheshire.generate :refer [add-encoder encode-map]]
            [metabase.api.common :refer [*current-user*]]
            [metabase.db :as db]
            (metabase.models [interface :as i]
                             [permissions-group :as perm-group])
            [metabase.util :as u]))

(def ^:const protected-password
  "The string to replace passwords with when serializing Databases."
  "**MetabasePass**")


(i/defentity Database :metabase_database)

(defn- post-insert [{id :id, :as database}]
  (u/prog1 database
    ;; add this database to the magic permissions groups
    (doseq [group [(perm-group/admin)
                   (perm-group/default)]]
      (db/insert! 'DatabasePermissions
        :database_id id
        :group_id    (:id group)))))

(defn- post-select [{:keys [engine] :as database}]
  (if-not engine database
          (assoc database :features (or (when-let [driver ((resolve 'metabase.driver/engine->driver) engine)]
                                          (seq ((resolve 'metabase.driver/features) driver)))
                                        []))))

(defn- pre-cascade-delete [{:keys [id]}]
  (db/cascade-delete! 'Card                :database_id id)
  (db/cascade-delete! 'DatabasePermissions :database_id id)
  (db/cascade-delete! 'SchemaPermissions   :database_id id)
  (db/cascade-delete! 'Table               :db_id       id)
  (db/cascade-delete! 'RawTable            :database_id id))

(u/strict-extend (class Database)
  i/IEntity
  (merge i/IEntityDefaults
         {:hydration-keys     (constantly [:database :db])
          :types              (constantly {:details :json, :engine :keyword})
          :timestamped?       (constantly true)
          :can-read?          (constantly true)
          :can-write?         i/superuser?
          :post-insert        post-insert
          :post-select        post-select
          :pre-cascade-delete pre-cascade-delete}))


(defn ^:hydrate tables
  "Return the `Tables` associated with this `Database`."
  [{:keys [id]}]
  (db/select 'Table, :db_id id, :active true, {:order-by [[:display_name :asc]]}))

(defn schema-names
  "Return a *sorted set* of schema names (as strings) associated with this `Database`."
  [{:keys [id]}]
  (when id
    (apply sorted-set (sort-by (comp s/lower-case :name)
                               (db/select-field :schema 'Table
                                 :db_id id
                                 {:modifiers [:DISTINCT]})))))


(add-encoder DatabaseInstance (fn [db json-generator]
                                (encode-map (cond
                                              (not (:is_superuser @*current-user*)) (dissoc db :details)
                                              (get-in db [:details :password])      (assoc-in db [:details :password] protected-password)
                                              (get-in db [:details :pass])          (assoc-in db [:details :pass] protected-password)     ; MongoDB uses "pass" instead of password
                                              :else                                 db)
                                            json-generator)))
