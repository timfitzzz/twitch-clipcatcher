/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import { Txt } from 'rendition'
import styled from 'styled-components'

export const WhoDidThis = styled(({className}: { className?: string}) => (
  <div className={className}>
      <div className={'imagecontainer'}>
        <img alt={'grossly self-promotional shot of unemployed clipstime creator tim fitzgerald'} src={"/tim-photo-cutout-bw.png"}/>
      </div>
    <Txt.span>

      <Txt.span bold={true}>Brought to you by Manapool Engineering,</Txt.span> a.k.a. <a href={"https://timfitz.dev"}>Tim Fitzgerald</a>, who noticed streamers and their chats frequently running into issues sharing and watching clips together. <a href="mailto:timothyliamfitzgerald@gmail.com">Email him!</a>

    </Txt.span>
  </div>
))`

background-color: ${({theme}) => theme.colors.primary.semilight};
  padding: 8px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;

  .imagecontainer {
    float: right;
    display: inline-block;
    img {
      height: 100px;
      width: 140px;
      object-fit: cover;
      object-position: 0 0;
      float: right:
      display: inline-block;
    }
  }
  
`

export default WhoDidThis