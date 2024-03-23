/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cyzs53es89jkjs5")

  collection.name = "student"
  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_aO5KJsl` ON `student` (\n  `first_name`,\n  `last_name`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cyzs53es89jkjs5")

  collection.name = "students"
  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_aO5KJsl` ON `students` (\n  `first_name`,\n  `last_name`\n)"
  ]

  return dao.saveCollection(collection)
})
