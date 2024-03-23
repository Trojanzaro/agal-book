/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cyzs53es89jkjs5")

  collection.listRule = null
  collection.viewRule = "@request.auth.auth_type = \"teacher\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cyzs53es89jkjs5")

  collection.listRule = "@request.auth.auth_type = \"teacher\""
  collection.viewRule = null

  return dao.saveCollection(collection)
})
