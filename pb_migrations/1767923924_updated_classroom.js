/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("6wcr28hpjeh8vn6")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.auth_type = \"teacher\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("6wcr28hpjeh8vn6")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.auth_type = \"teacher\" || id != \"\""
  }, collection)

  return app.save(collection)
})
