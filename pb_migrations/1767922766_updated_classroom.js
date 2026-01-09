/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("6wcr28hpjeh8vn6")

  // remove field
  collection.fields.removeById("relation2090728460")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("6wcr28hpjeh8vn6")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "iqelhqccspwy404",
    "hidden": false,
    "id": "relation2090728460",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "assignee",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
