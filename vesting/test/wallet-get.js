const {funcer} = require("./funcer");

const USER_ADDRESS = '348bcf827469c5fc38541c77fdd91d4e347eac200f6f2d9fd62dc08885f0415f';
const CONFIG_ADDRESS = '448bcf827469c5fc38541c77fdd91d4e347eac200f6f2d9fd62dc08885f0415f';
const ELECTOR_ADDRESS = '548bcf827469c5fc38541c77fdd91d4e347eac200f6f2d9fd62dc08885f0415f';

const MONTH = 2592000;

const TON = 1e9;

const FC_WALLET = [
    '../stdlib.fc',
    'vesting-lockup-wallet.fc',
];

const CONFIG_PARAMS = {
    0: [
        'cell', [
            "address", '-1:' + CONFIG_ADDRESS
        ]
    ],
    1: [
        'cell', [
            "address", '-1:' + ELECTOR_ADDRESS
        ]
    ]
}

const START_TIME = 1659312000;

const storage = ({}) => {
    return [
        "uint32", 66, // seqno
        "uint32", 698983190, // subwallet_id
        "uint256", 777, // public_key
        "uint64", 1659312000, // start_time
        "uint32", 311040000, // total_duration
        "uint32", 2592000, // unlock_period
        "uint32", 31104000, // cliff_duration
        "coins", 1000000 * TON, // total_amount
        "uint1", 1 // allow_elector
    ];
}

funcer({'logVmOps': false, 'logFiftCode': false}, {
    'path': './',
    'fc': FC_WALLET,
    "configParams": CONFIG_PARAMS,
    'data': storage({}),
    'in_msgs': [
        {
            "sender": '0:' + USER_ADDRESS,
            "amount": 10 * TON,
            "body": [],
            "new_data": storage({}),
        },
    ],
    "get_methods": [
        {
            "name": "seqno",
            "args": [],
            "output": [
                ["int", 66],
            ]
        },
        {
            "name": "get_public_key",
            "args": [],
            "output": [
                ["int", 777],
            ]
        },
        {
            "name": "get_lockup_data",
            "args": [],
            "output": [
                ["int", 1659312000],
                ["int", 311040000],
                ["int", 2592000],
                ["int", 31104000],
                ["int", 1000000 * TON],
                ["int", 1],
            ]
        },
        {
            "name": "get_locked_amount",
            "args": [
                ["int", START_TIME],
            ],
            "output": [
                ["int", 1000000 * TON],
            ]
        },
        {
            "name": "get_locked_amount",
            "args": [
                ["int", START_TIME + 121 * MONTH],
            ],
            "output": [
                ["int", 0 * TON],
            ]
        },
        {
            "name": "get_locked_amount",
            "args": [
                ["int", START_TIME + MONTH],
            ],
            "output": [
                ["int", 1000000 * TON],
            ]
        },
        {
            "name": "get_locked_amount",
            "args": [
                ["int", START_TIME + 8 * MONTH],
            ],
            "output": [
                ["int", 1000000 * TON],
            ]
        },
        {
            "name": "get_locked_amount",
            "args": [
                ["int", START_TIME + 12 * MONTH],
            ],
            "output": [
                ["int", (1000000 * (120 - 12) / 120) * TON],
            ]
        },
        {
            "name": "get_locked_amount",
            "args": [
                ["int", START_TIME + 13 * MONTH],
            ],
            "output": [
                ["int", Math.ceil(1000000 * TON - 1000000 * TON * 13 / 120) ],
            ]
        },
        {
            "name": "get_locked_amount",
            "args": [
                ["int", START_TIME + 60 * MONTH],
            ],
            "output": [
                ["int", Math.ceil(1000000 * TON - 1000000 * TON * 60 / 120) ],
            ]
        },
    ],
});