/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4049683563")

  // update collection data
  unmarshal({
    "name": "assignment_submit"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4049683563")

  // update collection data
  unmarshal({
    "name": "assignment_responses"
  }, collection)

  return app.save(collection)
})
