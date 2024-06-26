/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iqelhqccspwy404")

  collection.listRule = "@request.auth.id != \"\" &&\n@request.auth.auth_type ?= \"student\" || \n@request.auth.auth_type ?= \"teacher\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iqelhqccspwy404")

  collection.listRule = "@request.auth.auth_type ?= \"student\""

  return dao.saveCollection(collection)
})
