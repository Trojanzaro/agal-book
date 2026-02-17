/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1953219108")

  // update collection data
  unmarshal({
    "name": "textbook"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1953219108")

  // update collection data
  unmarshal({
    "name": "textbooks"
  }, collection)

  return app.save(collection)
})
