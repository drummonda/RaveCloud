import React, {Component} from 'react'
import {Button, Input, Label} from 'semantic-ui-react'

export default class MintTokens extends Component {

  constructor() {
    super();
    this.state = {
      venue: '',
      artist: '',
      date: '',
      quantity: 0,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange({target: {value, name}}) {
    this.setState({
      [name] : value,
    })
  }

  handleClick(evt) {
    evt.preventDefault();
    this.props.mintTokens(this.state);
    this.setState({
      venue: '',
      artist: '',
      date: '',
      quantity: 0,
    })
  }

  render() {
    const {venue, artist, date, quantity} = this.state;

    return (
      <div className="mint-tokens">
        <Label>Venue</Label>
        <Input
          name="venue"
          value={venue}
          onChange={this.handleChange}
        />
        <Label>Artist</Label>
        <Input
          name="artist"
          value={artist}
          onChange={this.handleChange}
        />
        <Label>Date</Label>
        <Input
          name="date"
          value={date}
          onChange={this.handleChange}
        />
        <Label>Quantity</Label>
        <Input
          name="quantity"
          value={quantity}
          onChange={this.handleChange}
        />

        <Button primary onClick={this.handleClick}>
          Let's RAVE
        </Button>
      </div>
    )
  }
}
