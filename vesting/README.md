# Vesting wallet smart-contract

Based on standard v3R2 wallet smart contract:

- https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc.

- https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet-v3.fif

- https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/new-wallet-v3.fif

## Create wallet

Install Fift Script interpretator - https://ton.org/docs/#/compile?id=fift.

Go to `lockup-wallet-contract/vesting` folder and run:

`fift -s new-wallet.fif <workchain-id> <wallet-id> <start_time> <total_duration> <unlock_period> <cliff_duration> <total_amount> <allow_elector> [<filename-base>]`

`workchain-id` - `0` for basechain, `-1` for masterchain. If you want to participate in validation (`allow_elector = -1`) you must create wallet in masterchain, otherwise, you usually need to choose a basechain. 

`wallet-id` -  use `698983191` for basechain, `698983190` for masterchain; These are common wallets ids, although you can use others.

`start_time` - unixtime from which all periods (vesting and cliff) are counted;

`total_duration` - total duration of vesting in seconds;

`unlock_period` - duration of timestep of vesting unlock in seconds. Unlocking will take place in equal shares of `total_amount` every `unlock_period` (except for the initiall cliff period, see below).

`cliff_duration` - duration of initial period when the entire amount is locked in seconds;

`total_amount` - total amount of vesting coins in Toncoins;

`allow_elector` - `-1` if locked funds can be sent to the elector'  and config' contracts (in other words wallet may participate in validation), `0` if not.

`filename-base` - the generated private key, address and message for deploying the wallet will be saved with this name.

The script does not require an internet connection and can be used on a separate machine with private keys.

As a result the script will do the following:

1) If private key file `<filename-base>.pk` is located in the script folder - he will use it. Otherwise, the script will generate a new private key and save it in a folder in the file named `<filename-base>.pk`

2) The script will print the wallet address to the console, and also save it to the file `<filname-base>.addr`.

3) The script will create wallet deployment message and save it to the file `<filename-base>-query.boc`. You can send this file to network via lite-client `sendfile` command - this will deploy your wallet to the network. This message has no timeout.

Example: 

You want to create vesting wallet at 1 August 2022 00:00:00 GMT with total vesting amount of million Toncoins for 10 years, the amount will unlock in equal parts every month (1'000'000 TON / 120 month = ~ 8333 TON will unlock every month), first year everything is blocked.
This means that in the first year no transfers can be made, and in the 13th month it will be possible to withdraw (1'000'000 * 13 / 120 = ~ 108 333 TON), in 14th month - 116666 and so on. 
You also want to be able to validate with locked coins.

`workchain-id = -1` and `allow_elector = -1` because you want to validate.

`wallet-id = 698983190` - common wallet id for masterchain.

`start_time = 1659312000` - unixtime of 1 August 2022 00:00:00 GMT.

`total_duration = 311040000` - ~10 year in seconds. 60 * 60 * 24 * 30 * 12 * 10.

`unlock_period = 2592000` - ~1 month in seconds. 60 * 60 * 24 * 30.

`cliff_duration = 31104000` - ~1 year in seconds 60 * 60 * 24 * 30 * 12.

`total_amount = 1000000` - 1 million Toncoins.

`fift -s new-wallet.fif -1 698983190 1659312000 311040000 2592000 31104000 1000000 1 my_wallet`

Next you transfer `my_wallet-query.boc` to machine with Internet connection, send 1 ton to the wallet address (for gas) and send query via [lite-client](https://ton.org/docs/#/compile?id=lite-client).

`> sendfile /path/to/file/my_wallet-query.boc`

After that, make sure that the wallet was created on the network and send vesting coins to it. Coins can be sent from any wallets, all at once or in multiple transfers.

The actual number of coins may be less than or greater than the `total_amount`. In this case, the unlock speed will still correspond to the original wallet parameters.

After the `total_duration`, all funds will become available.

## Create transfer message

Go to `lockup-wallet-contract/vesting` folder and run:

`fift -s wallet.fif <filename-base> <dest-addr> <subwallet-id> <seqno> <amount> [-n|-b] [-t<timeout>] [-B <body-boc>] [-C <comment>] [<savefile>]`

The script does not require an internet connection and can be used on a separate machine with private keys.

By default, the lifetime of transfer message is 60 seconds. You can increase it with a flag `-t`.

You need to pass actual wallet's `seqno` parameter (count of processed messages by wallet, sequential number), which can be obtained through the lite-client:

`runmethod <wallet-address> seqno`

Private key file `<filename-base>.pk` must be located in the script folder.

Example: sending 0.1 TON to CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG (wallet has seqno `1` and wallet-id `698983190`). 

`fift -s wallet.fif my_wallet EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG 698983190 1 0.1`

It will produce transfer message `wallet-query.boc`. 

Next you transfer file `wallet-query.boc` to machine with Internet connection and send it via [lite-client](https://ton.org/docs/#/compile?id=lite-client).

`> sendfile /path/to/file/wallet-query.boc`

## Inspecting wallet

First of all, you need to verify the smart contract code:

`B5EE9C7241020E01000198000114FF00F4A413F4BCF2C80B010201200203020148040501CCF28308D71820D31FD31FD31F02F823BBF264ED44D0D31FD31FD3FFD33FD31FD31FD31FFA00D300D15198BAF2A151A6BAF2A20AF9015410B4F910F2A326D74A20C000943036F800E30E03A4C8CB1F12CB1FCBFFCB3F12CB1F14CB1F12CB1F01FA02CB00C9ED540C0004D030020120060702012008090201200A0B0017BB39CED44D0D33F31D70BFF80011B8C97ED44D0D70B1F80037BA329ED44D0D31F31D31F31D3FF31D33FD31FD31FD31FFA00D300308007BB9846ED44D0D31F31D31F31D3FF31D33FD31FD31FD31FFA00305242A05250B991318E115343A122A9045210A85233A90412A904A1E259A012BC923070DE802CAC001F2A506D30721C003F2A6D43020D0D30331FA4031FA4030F800F823534BA05210B9912A8E125304A12DA90452B0A853ADA904A90452B0A1E2535AA012BC923070DE20C20029B02270DB3C0371DB3C13B112B0923070DE20C2009372FB029130E201FB000D0D0046F833206E925B70E0D020D7498307B9925B70E0D70BFF7F74C8CB02CA07CBFFC9D0C705F563C8AE`

By calling the get-methods of the deployed wallet smart contract, you can check its parameters:

Install lite-client `https://ton.org/docs/#/compile?id=lite-client`

Run in lite-client:

`runmethod <wallet-address> seqno` - obtain current `seqno` of wallet.

`runmethod <wallet-address> get_public_key` - obtain wallet public key.

`runmethod <wallet-address> get_locked_amount <unixtime>` - the amount of locked coins at a given moment.

`runmethod <wallet-address> get_lockup_data` returns `start_time, total_duration, unlock_period, cliff_duration, total_amount, allow_elector` - the description of these parameters was made above.

## Import wallet to [mytonctrl](https://github.com/ton-blockchain/mytonctrl)

1. [Create and deploy](https://github.com/ton-blockchain/lockup-wallet-contract/tree/main/vesting#create-wallet) wallet via script. 

    Note, to be able to validate you need create wallet in `workchain-id = -1` with `wallet-id = 698983190`.

2. Copy wallet' `.addr` and `.pk` files to `~/.local/share/mytoncore/wallets/` note that files should have the same name, for instance `1.pk` and `1.addr`.

3. Open mytonctrl console, check that `wl` command shows your new wallet in the list.

4. Execute command `swv <wallet-addr> v3`.

5. Set wallet as validator `set validatorWalletName <wallet-name>`.
