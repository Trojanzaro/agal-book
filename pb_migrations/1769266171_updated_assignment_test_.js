/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3979697666")

  // update collection data
  unmarshal({
    "name": "assignment"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3979697666")

  // update collection data
  unmarshal({
    "name": "assignment_test"
  }, collection)

  return app.save(collection)
})
