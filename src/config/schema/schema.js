module.exports = {
  "type": "object",
  "properties": {
    "RequestMessage": {
      "type": "object",
      "properties": {
        "RequestHeader": {
          "type": "object",
          "properties": {
            "Channel": {
              "type": "string"
            },
            "RequestDate": {
              "type": "string"
            },
            "MessageID": {
              "type": "string"
            },
            "ClientID": {
              "type": "string"
            },
            "Destination": {
              "type": "object",
              "properties": {
                "ServiceName": {
                  "type": "string"
                },
                "ServiceOperation": {
                  "type": "string"
                },
                "ServiceRegion": {
                  "type": "string"
                },
                "ServiceVersion": {
                  "type": "string"
                }
              },
              "required": [
                "ServiceName",
                "ServiceOperation",
                "ServiceRegion",
                "ServiceVersion"
              ]
            }
          },
          "required": [
            "Channel",
            "RequestDate",
            "MessageID",
            "ClientID",
            "Destination"
          ]
        },
        "RequestBody": {
          "type": "object",
          "properties": {
            "any": {
              "type": "object",
              "properties": {
                "parametersRQ": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "string",
                      "minLength": 1
                    },
                    "region": {
                      "type": "string",
                      "minLength": 1
                    }
                  },
                  "required": [
                    "key",
                    "region"
                  ]
                }
              },
              "required": [
                "parametersRQ"
              ]
            }
          },
          "required": [
            "any"
          ]
        }
      },
      "required": [
        "RequestHeader",
        "RequestBody"
      ]
    }
  },
  "required": [
    "RequestMessage"
  ]
}
