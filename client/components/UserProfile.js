import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';
import {Button, Input, Label} from 'semantic-ui-react';
import axios from 'axios';
import { eth, getInstance } from '../web3/provider';
import MyERC721 from "../web3/artifacts/MyERC721.json";
import TokenAuction from "../web3/artifacts/TokenAuction.json";
import AllAuctionTokens from './AllAuctionTokens';
import AllVenueTokens from './AllVenueTokens';

class UserProfile extends Component {

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
    this.bidOnAuction = this.bidOnAuction.bind(this);
  }

  async componentDidMount() {
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
    const { token, user: {publicAddress}, auctionContract } = this.state;
    const allTokensOfOwner = await token.tokensOfOwner(publicAddress);
    const allTokensOfAuction = await token.tokensOfOwner(auctionContract.address);

    const allOwnedTokens = await Promise.all(allTokensOfOwner.map(async raveToken => {
      const values = await token.getRave(raveToken);
      return {
        tokenId: raveToken,
        values,
      }
    }));

    const allAuctionedTokens = await Promise.all(allTokensOfAuction.map(async raveToken => {
      const values = await token.getRave(raveToken);
      const auction = await this.retrieveAuction(raveToken);
      return {
        tokenId: raveToken,
        values,
        auction,
      }
    }));

    const myTokens = allOwnedTokens.length || null;
    const auctionTokens = allAuctionedTokens.length || null;

    this.setState({
      myTokens: allOwnedTokens,
      auctionTokens: allAuctionedTokens,
    });

  }

  async retrieveAuction(token) {
    const { auctionContract } = this.state;
    const tokenAuction = await auctionContract.getAuction(token);
    return tokenAuction;
  }

  async bidOnAuction(tokenId) {
    const { auctionContract, user: {publicAddress} } = this.state;
    await auctionContract.bid(tokenId, {from: publicAddress, value: 10});
  }

  handleChange({ target: { value } }) {
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
    const { loading, user, username, auctionTokens, myTokens } = this.state;

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
        {auctionTokens ?
          <div>
            <h3>All tokens up for auction</h3>
            <AllAuctionTokens
              auctionTokens={auctionTokens}
              bidOnAuction={this.bidOnAuction}
            />
          </div>
          :
          <h3>No tokens up for auction!</h3>
        }

        {myTokens ?
          <div>
            <h3>All muhh tokens</h3>
            <AllVenueTokens
              tokens={myTokens}
            />
          </div>
          :
          <h3>I really wish I had some tokens...</h3>
        }

        <Button className='logout-button' color='red' onClick={onLoggedOut}>Don't u dare Logout</Button>
      </div>
    );
  }
}

export default UserProfile;
