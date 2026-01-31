/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3979697666")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.auth_type = \"teacher\"",
    "deleteRule": "@request.auth.auth_type = \"teacher\"",
    "listRule": "@request.auth.auth_type = \"teacher\"",
    "updateRule": "@request.auth.auth_type = \"teacher\"",
    "viewRule": "@request.auth.auth_type = \"teacher\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3979697666")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
