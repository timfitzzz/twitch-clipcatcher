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
      <Txt.span bold={true}>Brought to you by Manapool Engineering's</Txt.span> <a href={"https://timfitz.dev"}>Tim Fitzgerald</a>, who noticed his favorite streamers and their chats running into issues sharing and watching clips together. <a rel="noreferrer" href="https://discordapp.com/users/477997376079134730" target="_blank">Message him on Discord</a> or <a target="_blank" rel="noreferrer" href="mailto:timothyliamfitzgerald@gmail.com">send him an email!</a>
    </Txt.span>
  </div>
))`

background-color: ${({theme}) => theme.colors.primary.semilight};
  padding: 8px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: 4px;
  max-width: 500px;
  display: flex;

  .imagecontainer {
    float: right;
    display: inline-block;
    margin-top: auto;
    margin-bottom: auto;
    img {
      height: 100px;
      width: 140px;
      object-fit: cover;
      object-position: 0 0;
      float: right:
      display: inline-block;
    }
  }

  >span {
    margin-top: auto;
    margin-bottom: auto;
  }
  
`

export default WhoDidThis