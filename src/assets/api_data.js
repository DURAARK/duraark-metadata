define({ "api": [
  {
    "type": "get",
    "url": "/file/:id",
    "title": "Request cached metadata",
    "version": "0.7.0",
    "name": "GetMetadata",
    "group": "Metadata",
    "permission": [
      {
        "name": "none"
      }
    ],
    "description": "<p>Requests cached metadata from the server.</p> ",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>File's unique ID.</p> "
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://data.duraark.eu/services/api/metadata/file/1",
        "type": "curl"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"path\": \"/duraark-storage/files/Nygade_Scan1001.e57\",\n   \"type\": \"e57\",\n   \"createdAt\": \"2015-08-05T15:20:24.963Z\",\n   \"updatedAt\": \"2015-08-05T15:20:25.005Z\",\n   \"id\": 1,\n   \"metadata\": {\n     \"physicalAsset\": { ... JSON-LD data ... },\n     \"digitalObject\": { ... JSON-LD data ... }\n }",
          "type": "json"
        }
      ],
      "fields": {
        "File": [
          {
            "group": "File",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>Location of the File.</p> "
          },
          {
            "group": "File",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the File ('e57' or 'ifc-spf').</p> "
          },
          {
            "group": "File",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation time of the database instance.</p> "
          },
          {
            "group": "File",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Last modification time of the database instance.</p> "
          },
          {
            "group": "File",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Database instance's unique ID.</p> "
          },
          {
            "group": "File",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "metadata",
            "description": "<p>The extracted metadata is returned as <a href=\"http://json-ld.org/\">JSON-LD</a>. The data is logically separated into a 'physicalAsset' and a 'digitalObject' section and follows the <a href=\"https://github.com/DURAARK/Schemas/blob/master/rdf/buildm%2Bv3.1.rdf\">buildM+</a> schema description.</p> "
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>The metadata information was not found.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\nNot Found",
          "type": "json"
        }
      ]
    },
    "filename": "api/controllers/MetadataController.js",
    "groupTitle": "Metadata",
    "sampleRequest": [
      {
        "url": "http://data.duraark.eu/services/api/metadata/file/:id"
      }
    ]
  },
  {
    "type": "post",
    "url": "/metadata",
    "title": "Extract metadata",
    "version": "0.7.0",
    "name": "PostMetadata",
    "group": "Metadata",
    "permission": [
      {
        "name": "none"
      }
    ],
    "description": "<p>Extracts metadata from the given File.</p> ",
    "parameter": {
      "fields": {
        "File": [
          {
            "group": "File",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>Location of the File as provided by the <a href=\"http://data.duraark.eu/services/api/sessions/\">DURAARK Sessions API</a>.</p> "
          },
          {
            "group": "File",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "type",
            "description": "<p>Type of the File ('e57' or 'ifc-spf').</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"path\": \"/duraark-storage/files/Nygade_Scan1001.e57\",\n   \"type\": \"e57\",\n   \"createdAt\": \"2015-08-05T15:20:24.963Z\",\n   \"updatedAt\": \"2015-08-05T15:20:25.005Z\",\n   \"id\": 1,\n   \"metadata\": {\n     \"physicalAsset\": { ... JSON-LD data ... },\n     \"digitalObject\": { ... JSON-LD data ... }\n }",
          "type": "json"
        }
      ]
    },
    "filename": "api/controllers/MetadataController.js",
    "groupTitle": "Metadata",
    "sampleRequest": [
      {
        "url": "http://data.duraark.eu/services/api/metadata/metadata"
      }
    ]
  }
] });