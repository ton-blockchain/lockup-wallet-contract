# Vesting wallet smart-contract

Based on standard v3R2 wallet smart contract - https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/wallet3-code.fc.

## Create wallet

`fift -s new-wallet.fif 0 698983191 1659364490 3600 60 120 10 1 my_wallet`

## Create transfer message

`fift -s wallet.fif my_wallet EQA0i8-CdGnF_DhUHHf92R1ONH6sIA9vLZ_WLcCIhfBBXwtG 698983191 1 0.1`