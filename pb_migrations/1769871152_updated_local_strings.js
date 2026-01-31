/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3229307401")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.auth_type = \"teacher\" || @request.auth.auth_type = \"student\"",
    "deleteRule": "@request.auth.auth_type = \"teacher\" || @request.auth.auth_type = \"student\"",
    "listRule": "@request.auth.auth_type = \"teacher\" || @request.auth.auth_type = \"student\"",
    "updateRule": "@request.auth.auth_type = \"teacher\" || @request.auth.auth_type = \"student\"",
    "viewRule": "@request.auth.auth_type = \"teacher\" || @request.auth.auth_type = \"student\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3229307401")

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
