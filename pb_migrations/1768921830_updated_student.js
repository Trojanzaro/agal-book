/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("cyzs53es89jkjs5")

  // remove field
  collection.fields.removeById("json393698370")

  // remove field
  collection.fields.removeById("json2390625784")

  // add field
  collection.fields.addAt(11, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_108570809",
    "hidden": false,
    "id": "relation393698370",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "parent_1",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_108570809",
    "hidden": false,
    "id": "relation2390625784",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "parent_2",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("cyzs53es89jkjs5")

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "json393698370",
    "maxSize": 0,
    "name": "parent_1",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "json2390625784",
    "maxSize": 0,
    "name": "parent_2",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // remove field
  collection.fields.removeById("relation393698370")

  // remove field
  collection.fields.removeById("relation2390625784")

  return app.save(collection)
})
