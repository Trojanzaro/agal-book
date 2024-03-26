/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iqelhqccspwy404")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qxreni0s",
    "name": "schedule",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iqelhqccspwy404")

  // remove
  collection.schema.removeField("qxreni0s")

  return dao.saveCollection(collection)
})
