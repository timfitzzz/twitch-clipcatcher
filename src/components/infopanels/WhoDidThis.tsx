/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import { Txt } from 'rendition'
import styled from 'styled-components'
import IntroCard from './IntroCard'

export const WhoDidThis = ({className}: { className?: string}) => (
  <IntroCard>
    <Txt.span>
      <Txt.span bold={true}>Brought to you by Manapool Engineering,</Txt.span> a.k.a. Tim Fitzgerald, who noticed streamers and their chats frequently running into issues sharing and watching clips together. He's currently looking for full-time employment, and you can hire him!
    </Txt.span>
  </IntroCard>
)

export default styled(WhoDidThis)`

`