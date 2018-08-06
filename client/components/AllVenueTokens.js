import React from 'react'
import SingleToken from './SingleToken'
import {List} from 'semantic-ui-react'

const AllVenueTokens = ({tokens, createAuction, cancelAuction}) => {
  return (
    <List divided relaxed className='token-list'>
      {tokens.map(token => (
        <SingleToken
          key={token.tokenId}
          token={token}
          createAuction={createAuction}
          cancelAuction={cancelAuction}
        />

      ))}
    </List>
  )
}

export default AllVenueTokens;
