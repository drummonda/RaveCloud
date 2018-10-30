import React, {Component} from 'react'
import {List, Button, Input} from 'semantic-ui-react'

export default class AuctionToken extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    const {token, bidOnAuction } = this.props;

    return (
      <List.Item className="auction-token">
          <List.Header as='a'>Artist: {token.values[1]}</List.Header>
          Venue: {token.values[0]}
            <div className="user-logout">
              <Button
                primary
                onClick={() => bidOnAuction(token.tokenId)}>
                  Bid on Auction
              </Button>
            </div>
      </List.Item>
    )
  }
}

