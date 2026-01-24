/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4235983847")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_108570809",
    "hidden": false,
    "id": "relation414645209",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "payment_parent",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2063623452",
    "max": 0,
    "min": 0,
    "name": "status",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "cyzs53es89jkjs5",
    "hidden": false,
    "id": "relation2926223833",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "payment_student",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4235983847")

  // remove field
  collection.fields.removeById("relation414645209")

  // remove field
  collection.fields.removeById("text2063623452")

  // remove field
  collection.fields.removeById("relation2926223833")

  return app.save(collection)
})
