import { Contract } from '../src/index'

const scdl = {
	"scdl_version" : "1.0",
	"name" : "Token",
	"version" : "^0.4.18",
	"latest_url" : "",
	"author" : "0xBfE4aA5c37D223EEBe0A1F7111556Ae49bE0dcD2",
	"description" : "Contract token implementation following the ERC20 standars, the new created token is called ZIL",
	"created_on" : "Jan-12-2018 09:44:42 AM +UTC",
	"updated_on" : "Jan-12-2018 09:44:42 AM +UTC",
	"scl" : "https://localhost:3000?blockchain=ethereum&blockchain-id=eth-mainnet&address=0x05f4a42e251f2d52b8ed15E9FEdAacFcEF1FAD27",
	"internal_address" : "0x05f4a42e251f2d52b8ed15E9FEdAacFcEF1FAD27",
	"blockchain_type" : "ethereum",
	"blockchain_version" : "v0.4.18+commit.9cf6e910",
	"metadata" : "https://etherscan.io/address/0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27#code",
	"hash" : "b311edaec5a164050cede3219bf28cc6ce4c0ca43b8bf34d6fd309fb60c4d1d8  -",
	"is_stateful" : true,
	"lifecycle" : "ready",
	"functions" : [
		{
			"name" : "balanceOf",
			"description" : "* @dev Gets the balance of the specified address. @param _owner The address to query the the balance of. @return An uint256 representing the amount owned by the passed address.",
			"scope" : "public",
			"has_side_effects" : false,
			"inputs" : [
				{
					"name": "_owner",
					"type" : {
						"type": "string",
						"pattern": "^0x[a-fA-F0-9]{40}$"
					}
				}
			],
			"outputs" : [
				{
					"name": "",
					"type": {
						"type": "integer",
					 	"minimum": 0,
					 	"maximum": "2^256 - 1"
					}
				}
			],
			"events" : [],
			"dispatcher" : ""
		}
	],
	"events" : [
		{
			"name" : "Transfer",
			"description" : "Triggered when tokens are transferred",
			"outputs" : [
				{
					"name" : "from",
					"type" : {
						"type": "string",
						"pattern": "^0x[a-fA-F0-9]{40}$"
					},
					"is_indexed" : true
				},
				{
					"name" : "to",
					"type" : {
						"type": "string",
						"pattern": "^0x[a-fA-F0-9]{40}$"
					},
					"is_indexed" : true
				},
				{
					"name" : "value",
					"type": {
						"type": "integer",
					 	"minimum": 0,
					 	"maximum": "2^256 - 1"
					},
					"is_indexed" : false
				}
			]
		}
	]
}
