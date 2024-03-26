/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6wcr28hpjeh8vn6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tgz8gmxm",
    "name": "room",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6wcr28hpjeh8vn6")

  // remove
  collection.schema.removeField("tgz8gmxm")

  return dao.saveCollection(collection)
})
