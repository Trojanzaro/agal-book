/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3905696460")

  // remove field
  collection.fields.removeById("relation2827116352")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "cyzs53es89jkjs5",
    "hidden": false,
    "id": "relation855327463",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "dismissed_students",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "iqelhqccspwy404",
    "hidden": false,
    "id": "relation2073415843",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "dismissed_teachers",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3905696460")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "cyzs53es89jkjs5",
    "hidden": false,
    "id": "relation2827116352",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "dismissed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("relation855327463")

  // remove field
  collection.fields.removeById("relation2073415843")

  return app.save(collection)
})
