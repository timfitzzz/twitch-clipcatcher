/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import styled from 'styled-components'
import IntroCard from './IntroCard'
import { Heading, Txt } from 'rendition'
import { TitleLogo } from '../AuthPanel/AuthCard'
import Feature from './Feature'

const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
`

const TitleAndFeaturesContainer = styled.div`
  display: column;
`

const BigTitleLogo = styled(TitleLogo)`
  height: 100px;
  margin-left: 0px;
  padding-left: 0px;
  padding-bottom: 8px;
  path {
    stroke: ${p => p.theme.colors.primary.light};
    stroke-width: 10px;
  }
`

const BigTitleLogoContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  padding: 16px;
  // background-color: ${p => p.theme.colors.primary.dark};
  border-radius: 4px;
  margin-right: 32px;

`

const FeaturesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

`

export const TitleAndFeatures = ({className}: { className?: string }) => (
  <TitleAndFeaturesContainer className={className}>
    <TopContainer>
      <BigTitleLogoContainer>
        <BigTitleLogo/>
          {/* <Heading.h2>ClipsTime!</Heading.h2> */}
          
      </BigTitleLogoContainer>
      <IntroCard>
        <Heading.h3>Watch clips with your chat -- but only the good ones.</Heading.h3>
        <Txt.p>Many streamers and their communities exchange Twitch clips every day, but quality control and safety issues often arise. ClipsTime! is here to help solve them.</Txt.p>
      </IntroCard>
    </TopContainer>
      <FeaturesContainer>
        <Feature
          body={
            <>
              <Heading.h4>Collect and play Twitch clips linked by Twitch chatters</Heading.h4>
            </>
          }
          screenshotSrc={'/screenshots/fullsize-screenshot-buddha-2k.png'}
          screenshotAlt={'full-size view of clipstime panel'}
        />
        <Feature
          body={
            <>
              <Heading.h4>Sort in up to five ways, by your preference:</Heading.h4>
              <span>when • how long • who • viewcount • votes from your chat</span>
            </>
          }
          screenshotAlt={'zoomed-in view of clipstime options panel'} 
          screenshotSrc={"/screenshots/options-panel.PNG"}
        />
        <Feature
          body={
            <>
              <Heading.h4>Browse overlapping clips</Heading.h4>
              <span>Find the best version of a great moment</span>
            </>
          }
          screenshotAlt={'zoomed-in view of multiple-clip expander'} 
          screenshotSrc={"/screenshots/multipleclipselector-retry3.png"}
        />
        <Feature
          body={
            <>
              <Heading.h4>Avoid unwanted meta or drama</Heading.h4>
            </>
          }
          screenshotAlt={'zoomed in view of a clip that has been tagged as meta'} 
          screenshotSrc={"/screenshots/meta-vote-count-alt.png"}
        />
        <Feature
          body={
            <>
              <Heading.h4>Let mods screen for DMCA and TOS risks</Heading.h4>
            </>
          }
          screenshotAlt={'view of a clip that has been vetoed due to DMCA violation'}
          screenshotSrc={"/screenshots/vetoed-clip.png"}
        />
        <Feature
          body={
            <>
            <Heading.h3>And more!</Heading.h3>
            <ul>
              <li>Pop-out player</li>
              <li>Runs in your browser (no download)</li>
              <li>No invasive data collection</li>
              <li>No ads for streamers or chat mods, ever</li>
              <li>Created by and for the Twitch and GTARP communities</li>
              <li>Open-source development: <a href="https://github.com/timfitzzz/twitch-clipcatcher">scrutinize the code</a> -- or get involved!</li>
            </ul>
            </>
          }/>
    </FeaturesContainer>
  </TitleAndFeaturesContainer>
)

export default styled(TitleAndFeatures)`
  display: flex;
  flex-direction: column;
  p {
    font-size: 16px;
  }

  li {
    font-size: 15px; 
  }

  a {
    color: ${({theme}) => theme.colors.primary.light};
    &:visited {
      color: ${({theme}) => theme.colors.primary.dark};
    }
  }


`