/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3979697666")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "6wcr28hpjeh8vn6",
    "hidden": false,
    "id": "relation1232941213",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "classroom",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3979697666")

  // remove field
  collection.fields.removeById("relation1232941213")

  return app.save(collection)
})
