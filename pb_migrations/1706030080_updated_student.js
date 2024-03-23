/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cyzs53es89jkjs5")

  collection.viewRule = "@request.auth.auth_type = \"teacher\""
  collection.createRule = "@request.auth.auth_type = \"teacher\""
  collection.updateRule = "@request.auth.auth_type = \"teacher\""
  collection.deleteRule = "@request.auth.auth_type = \"teacher\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cyzs53es89jkjs5")

  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
