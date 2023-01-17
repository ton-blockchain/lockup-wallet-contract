# Lockup wallet
Lockup wallet is contract that can store *locked* and *restricted* coins.

This contract has unchangable whitelist which is set on deploy (and uniquely determines address). Also this contract stores pubkey of *lockup-sender*.

*Lockup-sender* can send TONs to Lockup wallet with additional rules:
- *locked* coins can not be sent before fixed time
- *restricted* coins can not be sent anywhere besides whitelist before fixed time

One lockup wallet may have arbitrary amount of locked and restricted batches each with it's own timelimit. For instance it is possible that there will be 1 TON locked up for 1 year, 2 TONs locked up for 10 years, and 3 TONs restricted for 20 years. Besides, all TONs on wallet above restricted and locked amount can be sent without limitations. For instance in example above, if wallet balance is 10 TONs, 4 of them can be sent anywhere anytime.

Usually whitelist is used to include *Elector* and *Config* SmartContracts, thus restricted TONs can participate in validation and network votings.

**Note, that wallet doesn't limit message mode. It means that if all TONs on wallet are restricted or not restricted, wallet can be destroyed by sending message to whitelisted address with mode 128+32, and thus restriction rules can be dropped. To prevent this, it is strictly required to have at least 1 TON locked as long as there are restricted coins.**

There is [dapp](https://toncenter.github.io/lockup-sender/) for sending locked or restricted TONs.
