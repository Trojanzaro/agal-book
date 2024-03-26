/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6wcr28hpjeh8vn6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kluqhmcq",
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
  const collection = dao.findCollectionByNameOrId("6wcr28hpjeh8vn6")

  // remove
  collection.schema.removeField("kluqhmcq")

  return dao.saveCollection(collection)
})
