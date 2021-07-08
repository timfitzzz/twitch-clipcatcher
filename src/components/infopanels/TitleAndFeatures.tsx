/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import styled from 'styled-components'
import IntroCard from './IntroCard'
import { Heading, Txt, List } from 'rendition'
import { TitleLogo } from '../AuthPanel/AuthCard'

const BigTitleLogo = styled(TitleLogo)`
  height: 50px;
  margin-left: 0px;
  padding-left: 0px;
  padding-bottom: 8px;
  path {
    stroke: ${p => p.theme.colors.secondary.light};
    stroke-width: 10px;
  }
`

export const TitleAndFeatures = ({className}: { className?: string }) => (
  <IntroCard className={className}>
    <BigTitleLogo/>
    {/* <Heading.h2>ClipsTime!</Heading.h2> */}
    <Heading.h4>Watch clips with your chat -- but only the good ones.</Heading.h4>
    <Txt.p>Many streamers and their communities exchange Twitch clips every day, but quality control and safety issues often arise. ClipsTime! is here to help solve them.</Txt.p>
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
  </IntroCard>
)

export default styled(TitleAndFeatures)`
  p {
    font-size: 16px;
  }

  li {
    font-size: 15px; 
  }

`