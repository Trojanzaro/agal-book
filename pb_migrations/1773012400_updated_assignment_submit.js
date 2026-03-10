/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4049683563")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.auth_type = \"teacher\" ||\n@request.auth.auth_type = \"student\" ",
    "viewRule": "@request.auth.auth_type = \"teacher\"||\n@request.auth.auth_type = \"student\" "
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4049683563")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.auth_type = \"teacher\" ||\n@request.auth.auth_type = \"student\"",
    "viewRule": "@request.auth.auth_type = \"teacher\"||\n@request.auth.auth_type = \"student\""
  }, collection)

  return app.save(collection)
})
