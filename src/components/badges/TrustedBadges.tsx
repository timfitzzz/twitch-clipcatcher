import { Visibility } from '@styled-icons/material/Visibility'
import React from 'react'
import { Flex } from 'rendition'
import styled from 'styled-components'

const TrustedBadges = styled(Flex)`
  padding-left: 4px;
  padding-right: 4px;
  margin-left: auto;
  margin-right: 4px;
  line-height: 14px;
  color: ${p => p.theme.colors.success.dark};
  border-radius: 4px;
  height: 18px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: auto;
  margin-bottom: auto;
  background-color: ${p => p.theme.colors.success.light};
  width: fit-content;

  span {
    margin-top: auto;
    margin-bottom: auto;

    svg {
      margin-top: auto;
      margin-bottom: 1px;
      margin-right: 4px;
      height: 14px;
      // fill: ${p => p.theme.colors.success.dark};
      // path {
      //   fill:${p => p.theme.colors.success.dark};
      // }
    }
  }
  

`

const Trusted = ({className, value}: {className?: string, value: string}) => {

  let [byMod, byVIP, byBroadcaster]: [byMod: boolean, byVIP: boolean, byBroadcaster: boolean] = value.split(" ").map(value => JSON.parse(value)) as [boolean, boolean, boolean]

  if (byMod || byVIP || byBroadcaster) {
    return (
      <TrustedBadges flexDirection={"row"} className={className}>
        { byMod ? (
          <span><Visibility/></span>
        ) : (<></>)}
        { byVIP ? (
          <span><Visibility/></span>
        ) : (<></>)}
        { byBroadcaster ? (
          <span><Visibility/></span>
        ) : (<></>)}
      </TrustedBadges>
    )
  } else {
    return <></>
  }
}

export default Trusted