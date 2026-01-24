/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4235983847")

  // add field
  collection.fields.addAt(4, new Field({
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4235983847")

  // remove field
  collection.fields.removeById("relation414645209")

  return app.save(collection)
})
