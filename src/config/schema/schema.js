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
                      "type": "string"
                    },
                    "region": {
                      "type": "string"
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
