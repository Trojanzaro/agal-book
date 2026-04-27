/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4049683563")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.auth_type = \"teacher\"",
    "deleteRule": "@request.auth.auth_type = \"teacher\"",
    "updateRule": "@request.auth.auth_type = \"teacher\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4049683563")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "updateRule": null
  }, collection)

  return app.save(collection)
})
