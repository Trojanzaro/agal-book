/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("iqelhqccspwy404")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.auth_type = \"teacher\" || \n@request.auth.auth_type = \"student\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("iqelhqccspwy404")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.auth_type = \"teacher\"|| \n@request.auth.auth_type = \"student\""
  }, collection)

  return app.save(collection)
})
