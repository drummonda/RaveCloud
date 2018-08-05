import React from 'react'
import {List} from 'semantic-ui-react'
import Login from './Login'

const LoginWrapper = ({token}) => {
  return (
    <List.Item>
        <List.Header as='a'>Artist: {token.values[1]}</List.Header>
        Venue: {token.values[0]}
    </List.Item>
  )
}

export default LoginWrapper;
