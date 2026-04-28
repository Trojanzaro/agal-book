/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("cyzs53es89jkjs5")

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "number2212372233",
    "max": null,
    "min": null,
    "name": "fee_discount",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("cyzs53es89jkjs5")

  // remove field
  collection.fields.removeById("number2212372233")

  return app.save(collection)
})
