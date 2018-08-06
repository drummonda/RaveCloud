import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';
import {Button, Input, Label} from 'semantic-ui-react';
import axios from 'axios';
import { eth, getInstance } from '../web3/provider';
import MintTokens from './MintTokens';
import AllVenueTokens from './AllVenueTokens';

import MyERC721 from "../web3/artifacts/MyERC721.json";
import TokenAuction from "../web3/artifacts/TokenAuction.json";

class VenueProfile extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      user: null,
      username: '',
      token: null,
      tokens: [],
      totalQuantity: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.mintTokens = this.mintTokens.bind(this);
    this.createAuction = this.createAuction.bind(this);
    this.cancelAuction = this.cancelAuction.bind(this);
  }

  async componentWillMount() {
    const { auth: { accessToken } } = this.props;
    const { payload: { id } } = await jwtDecode(accessToken);
    try {
      // set the headers for authorization
      const {data} = await axios.get(`/api/users/${id}`,{
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      this.setState({
        user: data,
        username: data.username,
      });
    } catch (err) {
      window.alert(err);
    }
    this.setupContract();
  }

  async setupContract() {
    try {
      const raveToken = await getInstance(MyERC721);
      const auctionContract = await getInstance(TokenAuction);
      this.setState({
        token: raveToken,
        auctionContract
      });
      this.retrieveTokens();
    } catch (err) {
      console.error(err);
    }
  }

  async retrieveTokens() {
    const { token, user: {publicAddress} } = this.state;
    const allTokensOfOwner = await token.tokensOfOwner(publicAddress);

    const allTokens = await Promise.all(allTokensOfOwner.map(async raveToken => {
      const values = await token.getRave(raveToken);
      return {
        tokenId: raveToken.toNumber(),
        values,
      }
    }));

    this.setState({
      tokens: allTokens,
    });

    console.log(this.state);
  }

  async retrieveAuction(token) {
    const { auctionContract } = this.state;
    const tokenAuction = await auctionContract.getAuction(token);
    return tokenAuction;
  }

  async mintTokens({venue, artist, date , quantity}) {
    const { token, user: {publicAddress} } = this.state;

    try {
      let tokens = [];
      for(let i = 0; i < quantity; i ++) {
        tokens.push(token.mint(venue, artist, date, {from:publicAddress}));
      };
      await Promise.all(tokens);

      this.retrieveTokens();

    } catch (err) {
      console.error(err);
    }
  }

  async createAuction(tokenId, itemPrice) {
    try {
      const { tokens, token, auctionContract, user: {publicAddress} } = this.state;

      const owner = await token.ownerOf(tokenId)

      await token.approve(auctionContract.address, tokenId, {from: owner});

      const auction = await auctionContract.createAuction(tokenId, Number(itemPrice), 100000, owner, {from: owner});

      const tokenToUpdate = tokens.find(token => token.id === tokenId);
      const updatedToken = Object.assign({}, tokenToUpdate, { auction });

      const updatedTokens = tokens.map(token => {
        if(token.id === tokenId) {
          return updatedToken;
        } else {
          return token;
        }
      })

      this.setState({
        tokens: updatedTokens
      })

      console.log(auction);
    } catch (err) {
      console.error(err);
    }
  }

  async cancelAuction(token) {
    const {auctionContract} = this.state;
    await auctionContract.cancelAuction(token);
    this.setState({
      activeAuction: false,
    })
  }

  handleChange({ target: { value } }) {
    console.log(value);
    this.setState({ username: value });
  };

  async handleSubmit({ target }) {
    const { auth: { accessToken } } = this.props;
    const { user, username } = this.state;
    this.setState({ loading: true });
    // Set the headers for authorization
    try {
      const {data} = await axios.patch(`/api/users/${user.id}`, {username}, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      this.setState({
        loading: false,
        user: data,
        username: '',
      });
    } catch (err) {
      console.error(err);
      window.alert(err);
      this.setState({ loading: false })
    }
  };

  render() {
    const { auth: { accessToken }, onLoggedOut } = this.props;
    const { payload: { publicAddress } } = jwtDecode(accessToken);
    const { loading, user, username, tokens} = this.state;

    const myUsername = user && user.username;

    return (
      <div className="Profile">
        <p className="blockies">
          Logged in as <Blockies seed={publicAddress} />
        </p>
        <div>
          My username is {myUsername ? <pre>{myUsername}</pre> : 'not set.'} My
          publicAddress is <pre>{publicAddress}</pre>
        </div>
        <div className="change-username">
          <Label htmlFor="username">Change username: </Label>
          <br/>
          <Input name="username" onChange={this.handleChange} value={username}/>
          <Button primary disabled={loading} onClick={this.handleSubmit}>
            Submit
          </Button>
        </div>

        {tokens.length ?
          <div className="all-tokens-container">
            <h3>All the tickets I'm selling</h3>
            <AllVenueTokens
              tokens={tokens}
              createAuction={this.createAuction}
              cancelAuction={this.cancelAuction}
            />

          </div>
          :
          <div>
            <h3>Sorry, you don't have any tickets for sale</h3>
            <h4>How about you get fucking started...</h4>
          </div>
        }

        <MintTokens mintTokens={this.mintTokens}/>
        <p>
          <Button className='logout-button' color='red' onClick={onLoggedOut}>Don't u fuckin' dare Logout</Button>
        </p>
      </div>
    );
  }
}

export default VenueProfile;
