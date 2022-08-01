# Vesting wallet smart-contract

Based on standard v3R2 wallet smart contract:

- https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc.

- https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3.fif

- https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v3.fif

## Create wallet

Install Fift Script interpretator - https://ton.org/docs/#/compile?id=fift.

`fift -s new-wallet.fif <workchain-id> <wallet-id> <create_at> <duration> <period> <cliff_duration> <total_amount> <allow_elector> [<filename-base>]`

`workchain-id` - `0` for basechain, `-1` for masterchain. If you want to participate in validation (`allow_elector = 1`) you must create wallet in masterchain, otherwise, you usually need to choose a basechain. 

`wallet-id` -  use `698983191` for basechain, `698983190` for masterchain; These are common ids, although you can use others.

`create_at` - unixtime of beginning of the vesting period;

`duration` - numbers of seconds, total duration of the vesting period;

`period` - numbers of seconds, frequency of unlock of vesting coins. Unlocking will take place in equal shares of `total_amount` every `period`.

`cliff_duration` - numbers of seconds, the time of the initial period when the entire amount is blocked;

`total_amount` - in Toncoins, total amount of vesting coins;

`allow_elector` - `1` if blocked funds can be sent to the elector's contract and config, `0` if not. (If you want to participate in validation).

`filename-base` - the generated private key, address and message for deploying the wallet will be saved with this name.

Example: 

You want to create vesting wallet at 1 August 2022 00:00:00 GMT with total vesting amount of million Toncoins for 10 years, the amount will unlock in equal parts every month, first year everything is blocked.
You also want to be able to validate with locked coins.

`workchain-id = -1` and `allow_elector = 1` because you want to validate.

`wallet-id = 698983190` - common wallet id for masterchain.

`create_at = 1659312000` - unixtime of 1 August 2022 00:00:00 GMT.

`duration = 315360000` - 10 year in seconds. 60 * 60 * 24 * 365 * 10.

`period = 2592000` - ~1 month in seconds. 60 * 60 * 24 * 30.

`cliff_duration = 31536000` - 1 year in seconds 60 * 60 * 24 * 365.

`total_amount = 1000000` - 1 million Toncons.

`fift -s new-wallet.fif -1 698983190 1659312000 315360000 2592000 31536000 1000000 1 my_wallet`

## Create transfer message

`fift -s wallet.fif <filename-base> <dest-addr> <subwallet-id> <seqno> <amount> [-n|-b] [-t<timeout>] [-B <body-boc>] [-C <comment>] [<savefile>]`

Example: sending 0.1 TON to CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG (wallet has seqno `1` and wallet-id `698983190`)

`fift -s wallet.fif my_wallet EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG 698983190 1 0.1`

Learn more: https://ton.org/docs/#/howto/step-by-step?id=_8-using-the-simple-wallet-smart-contract.

## Inspecting wallet

By calling the get-methods of the deployed wallet smart contract, you can check its parameters:

Install lite-client `https://ton.org/docs/#/compile?id=lite-client`

Run in lite-client:

`runmethod <wallet-address> seqno`

`runmethod <wallet-address> get_public_key`

`runmethod <wallet-address> get_locked_amount <unixtime>`

`runmethod <wallet-address> get_lockup_data` returns `create_at, duration, period, cliff_duration, total_amount, allow_elector`
