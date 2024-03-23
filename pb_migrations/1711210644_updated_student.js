/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cyzs53es89jkjs5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oiq7ft6e",
    "name": "email",
    "type": "email",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cyzs53es89jkjs5")

  // remove
  collection.schema.removeField("oiq7ft6e")

  return dao.saveCollection(collection)
})
