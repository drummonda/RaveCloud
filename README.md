# RaveCloud
By: Andrew Drummond
=======
# Overview

RaveCloud is a platform that provides a venue to consumer and consumer to consumer marketplace for tokenized concert tickets, using Ethereum. Venues can log on using MetaMask, mint concert tokens and put them up for auction for users. Users can log on using MetaMask, see all concert tokens up for auction (from venues or other users) and either purchase a concert token or put one up for auction.


### Technical Details
The core boilerplate of this app was made using [Boilermaker](https://github.com/FullstackAcademy/boilermaker) Using React and Redux, the frontend of the site maintains a store shared by all components.

The app integrates with an ethereum ganache-cli blockchain on the backend, and uses Solidity smart contracts, specifically an Ethereum ERC721 token standard for the concert token. The Truffle Development suite was used for contract compilation and deployment, and Web3 was used on the frontend to allow the user to interact with the smart contracts.


### Installation
Using npm:
```
npm i
ganache-cli
truffle compile
truffle migrate
npm run start-dev
```
