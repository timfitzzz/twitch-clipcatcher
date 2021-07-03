/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import styled from 'styled-components'
import { Flex, Card, Heading, Alert, List, Txt } from 'rendition'
import { useContextSelector } from 'use-context-selector'
import { AuthContext } from '../contexts/AuthContext'

const IntroPanelContainer = styled(Flex).attrs(p => ({
  flexDirection: 'column'
}))`
  margin: 8px;
`

const LinkySpan = styled.a`

`

const IntroCard = styled(Card)`
  margin-top: 8px;
`

export const IntroPanel = () => {

  const signinRedirect = useContextSelector(AuthContext, (c) => c.signinRedirect)

  return (
    <IntroPanelContainer flexDirection={'column'}>
      <Alert emphasized><LinkySpan href="#" role="button" onClick={signinRedirect}>Log in with Twitch</LinkySpan> to begin.</Alert>
      <IntroCard>
        <Heading.h2>ClipsTime!</Heading.h2>
        <Heading.h4>Watch clips with your chat -- but only the good ones.</Heading.h4>
        <Txt.p>
          <List>
            <Txt>
              <Txt.span bold={true}>Browse, sort, and play Twitch clips</Txt.span> linked in Twitch chat
            </Txt>
            <Txt>
              <Txt.span bold={true}>Avoid exposure to unwanted content</Txt.span> (DMCA, drama, meta) with the help of chat moderators and users
            </Txt>
            <Txt>
              <Txt.span bold={true}>Know which clips are from the same moments</Txt.span> in real time
            </Txt>
            <Txt>
              <Txt.span bold={true}>Runs in your browser using your Twitch account</Txt.span> -- no third-party server or data collection
            </Txt>
            <Txt>
              <Txt.span bold={true}>No Ads for streamers or chat moderators</Txt.span> -- ever
            </Txt>
          </List>
        </Txt.p>
        <Heading.h5>Who made this?</Heading.h5>
        <Txt.p>
          Manapool Engineering a.k.a. Tim Fitzgerald, a GTARP viewer and engineer who noticed streamers and their chats frequently running into issues sharing and watching clips together. He's currently looking for full-time employment, and you can hire him!
        </Txt.p>
      </IntroCard>
    </IntroPanelContainer>
  )


}

export default IntroPanel
