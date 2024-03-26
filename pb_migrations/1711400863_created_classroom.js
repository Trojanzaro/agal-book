/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "6wcr28hpjeh8vn6",
    "created": "2024-03-25 21:07:43.784Z",
    "updated": "2024-03-25 21:07:43.784Z",
    "name": "classroom",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "onwkavr7",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "y1bdxv4p",
        "name": "teacher",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "iqelhqccspwy404",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("6wcr28hpjeh8vn6");

  return dao.deleteCollection(collection);
})
