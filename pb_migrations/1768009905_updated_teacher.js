/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("iqelhqccspwy404")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && (\n@request.auth.auth_type = \"student\" || \n@request.auth.auth_type = \"teacher\")",
    "viewRule": "@request.auth.auth_type = \"student\" ||\n@request.auth.auth_type = \"teacher\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("iqelhqccspwy404")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && (\n@request.auth.auth_type ?= \"student\" || \n@request.auth.auth_type ?= \"teacher\")",
    "viewRule": "@request.auth.auth_type = \"student\" ||\n@request.auth.auth_type ?= \"teacher\""
  }, collection)

  return app.save(collection)
})
