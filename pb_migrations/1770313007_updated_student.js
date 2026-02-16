/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("cyzs53es89jkjs5")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.auth_type = \"teacher\"",
    "deleteRule": "@request.auth.auth_type = \"teacher\"",
    "updateRule": "@request.auth.auth_type = \"teacher\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("cyzs53es89jkjs5")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.auth_type = \"teacher\"||\n@request.auth.auth_type = \"student\" ",
    "deleteRule": "@request.auth.auth_type = \"teacher\"||\n@request.auth.auth_type = \"student\" ",
    "updateRule": "@request.auth.auth_type = \"teacher\"||\n@request.auth.auth_type = \"student\" "
  }, collection)

  return app.save(collection)
})
