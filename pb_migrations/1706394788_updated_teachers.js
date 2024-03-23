/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iqelhqccspwy404")

  collection.name = "teacher"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iqelhqccspwy404")

  collection.name = "teachers"

  return dao.saveCollection(collection)
})
