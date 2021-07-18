import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'rendition'

const ChannelTabTitleText = styled.h5`
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 4px;
  margin-right: 4px;
  font-size: 14px;
`

const ChannelTabBox = styled(Box)`

  padding: 4px;
  margin-left: 0px;
  margin-right: 2px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  > div {
    height: 26px;
  }

  border-top: 1px solid ${({theme}) => theme.colors.primary.light};
  border-left: 1px solid ${({theme}) => theme.colors.primary.light};
  border-right: 1px solid ${({theme}) => theme.colors.primary.light};
  border-bottom: 1px solid ${({theme}) => theme.colors.primary.semilight};
  background-color: ${({theme}) => theme.colors.primary.semilight};
  h5 {
    color: black;
  }

`

const ChannelTitleTab = ({channelName, children, className}: {channelName: string, children?: JSX.Element, className?: string}) => {

  return (
    <ChannelTabBox className={className}>
      <Flex flexDirection={"row"}>
        <ChannelTabTitleText>{channelName}</ChannelTabTitleText>
        {children}
      </Flex>
    </ChannelTabBox>
  )
}

export default styled(ChannelTitleTab)`
  width: fit-content;
  margin-right: 0px;
  z-index: 1;
`