define({ "api": [
  {
    "type": "get",
    "url": "/buildm/:id",
    "title": "Request cached buildM metadata",
    "version": "0.8.0",
    "name": "GetBuildm",
    "group": "BuildM",
    "permission": [
      {
        "name": "none"
      }
    ],
    "description": "<p>Requests cached descriptive metadata as buildM/JSON-LD serialization.</p> ",
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
        "content": "curl -i http://data.duraark.eu/services/api/metadata/buildm/1",
        "type": "curl"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"path\": \"/duraark-storage/files/Plan3D_Haus30_PREVIEW.ifc\",\n   \"createdAt\": \"2015-08-05T15:20:24.963Z\",\n   \"updatedAt\": \"2015-08-05T15:20:25.005Z\",\n   \"id\": 1,\n   \"metadata\": {\n     \"physicalAsset\": { ... JSON-LD data ... },\n     \"digitalObject\": { ... JSON-LD data ... }\n   },\n   \"format\": \"application/ld+json\",\n   \"schemaName\": \"buildm\",\n   \"schemaVersion\": \"2.2\"\n }",
          "type": "json"
        }
      ],
      "fields": {
        "Ifcm": [
          {
            "group": "Ifcm",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>Location of the file.</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation time of the database instance.</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Last modification time of the database instance.</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Database instance's unique ID.</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "format",
            "description": "<p>Format of the metadata serialization (i.e. &quot;application/ld+json&quot;)</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "schemaName",
            "description": "<p>Schema name (i.e. &quot;buildm&quot;)</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "schemaVersion",
            "description": "<p>Schema version (e.g. &quot;2.2&quot;)</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "metadata",
            "description": "<p>The extracted metadata is returned in the serialization format above</p> "
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
    "filename": "api/controllers/BuildmController.js",
    "groupTitle": "BuildM",
    "sampleRequest": [
      {
        "url": "http://data.duraark.eu/services/api/metadata/buildm/:id"
      }
    ]
  },
  {
    "type": "post",
    "url": "/buildm",
    "title": "Extract descriptive metadata as buildM/JSON-LD serialization from an IFC-SPF file.",
    "version": "0.8.0",
    "name": "PostBuildm",
    "group": "BuildM",
    "permission": [
      {
        "name": "none"
      }
    ],
    "description": "<p>Extracts descriptive metadata from the given IFC-SPF file.</p> ",
    "parameter": {
      "fields": {
        "File": [
          {
            "group": "File",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>Location of the file as provided by the <a href=\"http://data.duraark.eu/services/api/sessions/\">DURAARK Sessions API</a>.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"path\": \"/duraark-storage/files/Plan3D_Haus30_PREVIEW.ifc\",\n   \"createdAt\": \"2015-08-05T15:20:24.963Z\",\n   \"updatedAt\": \"2015-08-05T15:20:25.005Z\",\n   \"id\": 1,\n   \"metadata\": {\n     \"physicalAsset\": { ... JSON-LD data ... },\n     \"digitalObject\": { ... JSON-LD data ... }\n   },\n   \"format\": \"application/ld+json\",\n   \"schemaName\": \"buildm\",\n   \"schemaVersion\": \"2.2\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "api/controllers/BuildmController.js",
    "groupTitle": "BuildM",
    "sampleRequest": [
      {
        "url": "http://data.duraark.eu/services/api/metadata/buildm"
      }
    ]
  },
  {
    "type": "get",
    "url": "/e57m/:id",
    "title": "Request cached e57M metadata",
    "version": "0.8.0",
    "name": "GetE57m",
    "group": "E57M",
    "permission": [
      {
        "name": "none"
      }
    ],
    "description": "<p>Requests cached technical metadata as e57M/XML serialization.</p> ",
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
        "content": "curl -i http://data.duraark.eu/services/api/metadata/e57m/1",
        "type": "curl"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"path\": \"/duraark-storage/files/Plan3D_Haus30_PREVIEW.ifc\",\n   \"createdAt\": \"2015-08-05T15:20:24.963Z\",\n   \"updatedAt\": \"2015-08-05T15:20:25.005Z\",\n   \"id\": 1,\n   \"metadata\": \" ... XML schema instance ...\",\n   \"format\": \"application/ld+json\",\n   \"schemaName\": \"e57m\",\n   \"schemaVersion\": \"1.1\"\n }",
          "type": "json"
        }
      ],
      "fields": {
        "E57m": [
          {
            "group": "E57m",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>Location of the file.</p> "
          },
          {
            "group": "E57m",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation time of the database instance.</p> "
          },
          {
            "group": "E57m",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Last modification time of the database instance.</p> "
          },
          {
            "group": "E57m",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Database instance's unique ID.</p> "
          },
          {
            "group": "E57m",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "format",
            "description": "<p>Format of the metadata serialization (i.e. &quot;application/xml&quot;)</p> "
          },
          {
            "group": "E57m",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "schemaName",
            "description": "<p>Schema name (i.e. &quot;e57m&quot;)</p> "
          },
          {
            "group": "E57m",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "schemaVersion",
            "description": "<p>Schema version (e.g. &quot;1.1&quot;)</p> "
          },
          {
            "group": "E57m",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "metadata",
            "description": "<p>The extracted metadata is returned in the serialization format above</p> "
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
    "filename": "api/controllers/E57mController.js",
    "groupTitle": "E57M",
    "sampleRequest": [
      {
        "url": "http://data.duraark.eu/services/api/metadata/e57m/:id"
      }
    ]
  },
  {
    "type": "post",
    "url": "/e57m",
    "title": "Extract technical metadata as e57M/XML serialization from an E57 file.",
    "version": "0.8.0",
    "name": "PostE57m",
    "group": "E57M",
    "permission": [
      {
        "name": "none"
      }
    ],
    "description": "<p>Extracts technical metadata from the given E57 file.</p> ",
    "parameter": {
      "fields": {
        "File": [
          {
            "group": "File",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>Location of the file as provided by the <a href=\"http://data.duraark.eu/services/api/sessions/\">DURAARK Sessions API</a>.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"path\": \"/duraark-storage/files/Plan3D_Haus30_PREVIEW.ifc\",\n   \"createdAt\": \"2015-08-05T15:20:24.963Z\",\n   \"updatedAt\": \"2015-08-05T15:20:25.005Z\",\n   \"id\": 1,\n   \"metadata\": \" ... XML schema instance ...\",\n   \"format\": \"application/ld+json\",\n   \"schemaName\": \"e57m\",\n   \"schemaVersion\": \"1.1\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "api/controllers/E57mController.js",
    "groupTitle": "E57M",
    "sampleRequest": [
      {
        "url": "http://data.duraark.eu/services/api/metadata/e57m"
      }
    ]
  },
  {
    "type": "get",
    "url": "/ifcm/:id",
    "title": "Request cached ifcM metadata",
    "version": "0.8.0",
    "name": "GetIfcm",
    "group": "IfcM",
    "permission": [
      {
        "name": "none"
      }
    ],
    "description": "<p>Requests cached technical metadata as ifcM/XML serialization from an IFC-SPF file.</p> ",
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
        "content": "curl -i http://data.duraark.eu/services/api/metadata/ifcm/1",
        "type": "curl"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"path\": \"/duraark-storage/files/Plan3D_Haus30_PREVIEW.ifc\",\n   \"createdAt\": \"2015-08-05T15:20:24.963Z\",\n   \"updatedAt\": \"2015-08-05T15:20:25.005Z\",\n   \"id\": 1,\n   \"metadata\": \" ... XML schema instance ...\",\n   \"format\": \"application/ld+json\",\n   \"schemaName\": \"ifcm\",\n   \"schemaVersion\": \"1.0\"\n }",
          "type": "json"
        }
      ],
      "fields": {
        "Ifcm": [
          {
            "group": "Ifcm",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>Location of the file.</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Creation time of the database instance.</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>Date</p> ",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Last modification time of the database instance.</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Database instance's unique ID.</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "format",
            "description": "<p>Format of the metadata serialization (i.e. &quot;application/xml&quot;)</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>string</p> ",
            "optional": false,
            "field": "schemaName",
            "description": "<p>Schema name (i.e. &quot;ifcm&quot;)</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "schemaVersion",
            "description": "<p>Schema version (e.g. &quot;1.0&quot;)</p> "
          },
          {
            "group": "Ifcm",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "metadata",
            "description": "<p>The extracted metadata is returned in the serialization format above</p> "
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
    "filename": "api/controllers/IfcmController.js",
    "groupTitle": "IfcM",
    "sampleRequest": [
      {
        "url": "http://data.duraark.eu/services/api/metadata/ifcm/:id"
      }
    ]
  },
  {
    "type": "post",
    "url": "/ifcm",
    "title": "Extract technical metadata as ifcM/XML serialization",
    "version": "0.8.0",
    "name": "PostIfcm",
    "group": "IfcM",
    "permission": [
      {
        "name": "none"
      }
    ],
    "description": "<p>Extracts technical metadata from the given IFC-SPF file.</p> ",
    "parameter": {
      "fields": {
        "File": [
          {
            "group": "File",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "path",
            "description": "<p>Location of the file as provided by the <a href=\"http://data.duraark.eu/services/api/sessions/\">DURAARK Sessions API</a>.</p> "
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"path\": \"/duraark-storage/files/Plan3D_Haus30_PREVIEW.ifc\",\n   \"createdAt\": \"2015-08-05T15:20:24.963Z\",\n   \"updatedAt\": \"2015-08-05T15:20:25.005Z\",\n   \"id\": 1,\n   \"metadata\": \" ... XML schema instance ...\",\n   \"format\": \"application/ld+json\",\n   \"schemaName\": \"ifcm\",\n   \"schemaVersion\": \"1.0\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "api/controllers/IfcmController.js",
    "groupTitle": "IfcM",
    "sampleRequest": [
      {
        "url": "http://data.duraark.eu/services/api/metadata/ifcm"
      }
    ]
  }
] });