import React from 'react'
import styled from 'styled-components'
import { Heading } from 'rendition'
import TitleImage from '../components/AuthPanel/TitleImage'

const AgainCommaPleaseAcceptOurSincerestRegrets = styled.div`
  padding: 16px;
  background-color: ${({theme}) => theme.colors.warning.light};
  margin: 16px;

  div {
    padding: 4px 8px;
    background-color: ${({theme}) => theme.colors.warning.main};
    border: 1px solid ${({theme}) => theme.colors.danger.main};
    width: fit-content;
    border-radius: 8px;
    cursor: pointer;
    &:hover {
      background-color: ${({theme}) => theme.colors.danger.main};
    }
  }
`

const WeAreJustSoSoSorry = styled(({className}: { className?: string }) => {

  return (
    <div className={className}>
      <TitleImage />
      <AgainCommaPleaseAcceptOurSincerestRegrets>
        { /* eslint-disable-next-line react/jsx-pascal-case */ }
        <Heading.h4>ClipsTime! currently does not support use on mobile devices. </Heading.h4>
        At some future point, we do hope to support mobile devices as read/write interfaces via chat, so we can help our favorite streamers exchange free content from the comfort of our thrones. In the meantime, please accept a small token of our appreciation for your visit, and go check us out on your desktop or laptop computing device.
      </AgainCommaPleaseAcceptOurSincerestRegrets>
    </div>
  )

})`

  display: flex;
  flex-direction: column;
  height: calc(100vh);
  width: calc(100vw);
  svg {
    padding: 16px;
  }

`

export default WeAreJustSoSoSorry