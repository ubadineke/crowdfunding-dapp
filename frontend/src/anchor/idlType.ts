/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/anchor_project.json`.
 */
export type AnchorProject = {
  "address": "57dPyNf83ezm5EZD6N36xZVpPTkDGJWgy5d8rGVp4qYW",
  "metadata": {
    "name": "anchorProject",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "donateToCampaign",
      "discriminator": [
        11,
        213,
        34,
        2,
        196,
        121,
        15,
        216
      ],
      "accounts": [
        {
          "name": "donor",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "campaign.title",
                "account": "campaign"
              },
              {
                "kind": "const",
                "value": [
                  67,
                  65,
                  77,
                  80,
                  65,
                  73,
                  71,
                  78,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeCampaign",
      "discriminator": [
        169,
        88,
        7,
        6,
        9,
        165,
        65,
        132
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "title"
              },
              {
                "kind": "const",
                "value": [
                  67,
                  65,
                  77,
                  80,
                  65,
                  73,
                  71,
                  78,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "goal",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawFunds",
      "discriminator": [
        241,
        36,
        29,
        111,
        208,
        31,
        104,
        217
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "campaign.title",
                "account": "campaign"
              },
              {
                "kind": "const",
                "value": [
                  67,
                  65,
                  77,
                  80,
                  65,
                  73,
                  71,
                  78,
                  95,
                  83,
                  69,
                  69,
                  68
                ]
              },
              {
                "kind": "account",
                "path": "campaign.creator",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "titleTooLong",
      "msg": "Cannot initialize, title too long"
    },
    {
      "code": 6001,
      "name": "descriptionTooLong",
      "msg": "Cannot initialize, description too long"
    },
    {
      "code": 6002,
      "name": "insufficientFunds",
      "msg": "Insufficient funds in donor account"
    },
    {
      "code": 6003,
      "name": "overflow",
      "msg": "Overflow occurred while adding to the campaign amount."
    },
    {
      "code": 6004,
      "name": "invalidNonce",
      "msg": "Nonce provided doesn't match current state."
    },
    {
      "code": 6005,
      "name": "amountRaisedNotEnough",
      "msg": "Amount raised not up to requested."
    },
    {
      "code": 6006,
      "name": "noFundsRaisedYet",
      "msg": "Amount raised currently is 0"
    },
    {
      "code": 6007,
      "name": "unauthorizedWithdrawal",
      "msg": "Withdrawal not allowed! You don't own this campaign"
    },
    {
      "code": 6008,
      "name": "missingBump",
      "msg": "Bump value is missing."
    }
  ],
  "types": [
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "goal",
            "type": "u64"
          },
          {
            "name": "raised",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
