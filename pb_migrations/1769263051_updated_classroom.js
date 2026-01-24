/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("6wcr28hpjeh8vn6")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number2521392309",
    "max": null,
    "min": null,
    "name": "fee",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("6wcr28hpjeh8vn6")

  // remove field
  collection.fields.removeById("number2521392309")

  return app.save(collection)
})
