import React from 'react'
import AuctionToken from './AuctionToken'
import {List} from 'semantic-ui-react'

const AllAuctionTokens = ({auctionTokens, bidOnAuction}) => {
  return (
    <List divided relaxed className='auction-list'>
      {auctionTokens.map(token => (
        <AuctionToken
          key={Number(token.tokenId)}
          token={token}
          bidOnAuction={bidOnAuction}
        />

      ))}
    </List>
  )
}

export default AllAuctionTokens;
