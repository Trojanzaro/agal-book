/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4049683563")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "date2862495610",
    "max": "",
    "min": "",
    "name": "date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number2172663386",
    "max": null,
    "min": null,
    "name": "max_score",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4049683563")

  // remove field
  collection.fields.removeById("date2862495610")

  // remove field
  collection.fields.removeById("number2172663386")

  return app.save(collection)
})
