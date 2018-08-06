import React, {Component} from 'react'
import {List, Button, Input} from 'semantic-ui-react'

export default class SingleToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: 0,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({target: {value}}) {
    this.setState({
      price: Number(value),
    })
  }

  render () {
    const {token, createAuction, cancelAuction} = this.props;
    const {price} = this.state;

    return (
      <List.Item>
          <List.Header as='a'>Artist: {token.values[1]}</List.Header>
          Venue: {token.values[0]}
          {token.auction ?
            <Button
              primary
              onClick={() => cancelAuction(token.tokenId)}
            >
              Cancel Auction
            </Button>
            :
            <div>
              <Input
                type="text"
                name="price"
                value={price}
                placeholder="Set ticket price"
                onChange={this.handleChange}
              />

              <Button
                primary
                onClick={() => createAuction(token.tokenId, price)}
              >
                Create Auction
              </Button>
            </div>}
      </List.Item>
    )
  }
}

