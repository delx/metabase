(ns metabase.models.permissions-group
  (:require [clojure.string :as s]
            [metabase.db :as db]
            [metabase.models.interface :as i]
            [metabase.util :as u]))

(i/defentity PermissionsGroup :permissions_group)


;;; magic permissions groups getter helper fns

(def ^{:arglists '([])}
  ^metabase.models.permissions_group.PermissionsGroupInstance
  default
  "Fetch the `Default` permissions group, creating it if needed."
  (memoize (fn []
             (or (db/select-one PermissionsGroup
                   :name "Default")
                 (db/insert! PermissionsGroup
                   :name "Default")))))

(def
  ^{:arglists '([])}
  ^metabase.models.permissions_group.PermissionsGroupInstance
  admin
  "Fetch the `Admin` permissions group, creating it if needed."
  (memoize (fn []
             (or (db/select-one PermissionsGroup
                   :name "Admin")
                 (db/insert! PermissionsGroup
                   :name "Admin")))))


(defn- throw-exception-when-editing-magic-group
  "Make sure we're not trying to edit/delete one of the magic groups, or throw an exception."
  [{id :id}]
  {:pre [(integer? id)]}
  (when (= id (:id (default)))
    (throw (Exception. "You cannot delete the 'Default' permissions group!")))
  (when (= id (:id (admin)))
    (throw (Exception. "You cannot delete the 'Admin' permissions group!"))))


(defn- pre-cascade-delete [{id :id, :as group}]
  (throw-exception-when-editing-magic-group group)
  (db/cascade-delete! 'DatabasePermissions        :group_id id)
  (db/cascade-delete! 'TablePermissions           :group_id id)
  (db/cascade-delete! 'SchemaPermissions          :group_id id)
  (db/cascade-delete! 'PermissionsGroupMembership :group_id id))

(defn- pre-update [group]
  (throw-exception-when-editing-magic-group group)
  group)

(u/strict-extend (class PermissionsGroup)
  i/IEntity (merge i/IEntityDefaults
                   {:pre-cascade-delete pre-cascade-delete
                    :pre-update         pre-update}))


(defn exists-with-name?
  "Does a `PermissionsGroup` with GROUP-NAME exist in the DB? (case-insensitive)"
  ^Boolean [group-name]
  {:pre [(u/string-or-keyword? group-name)]}
  (db/exists? PermissionsGroup
    :%lower.name (name group-name)))

(defn members
  "Return `Users` that belong to PERMISSIONS-GROUP, ordered by their name (case-insensitive)."
  [{id :id}]
  {:pre [(integer? id)]}
  (when-let [user-ids (seq (db/select-field :user_id 'PermissionsGroupMembership :group_id id))]
    (sort-by (comp :common_name s/lower-case)
             (db/select 'User
               :id [:in user-ids]))))
