import React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { Modal } from 'rendition'

const FeatureTextPanel = styled.div`
margin-top: auto;
margin-bottom: 16px;
color: white;
`

const FeatureScreenshotPanel = styled.div`
  margin-left: 0px;
  margin-right: auto;
  width: 100%;

  img {
    max-width: 100%;
    max-height: 200px;
    display: flex;
    margin-top: 0px;
    margin-bottom: 0px;
    border-radius: 4px;
    border: 1px solid ${({theme}) => theme.colors.primary.main};
  }
`

const FeatureCardInnerColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const CustomModal = styled(Modal)`
  > div {
    padding: 0px;
    margin: 0px;
    display: contents;

    > div {
      display: none;
    }
  }
  padding: 16px;
  width: unset;

  img {
    width: 100%;
  }
`

export const Feature = styled((
  {
    className, 
    body, 
    screenshotSrc,
    screenshotAlt
  }: { 
    className?: string, 
    body: React.ReactNode 
    screenshotSrc?: string,
    screenshotAlt?: string
  }) => {

  let [displayModal, setDisplayModal] = useState<boolean>(false)

  return ( 
    
    <div className={className}>
      <FeatureCardInnerColumn>
        <FeatureTextPanel>
          {body}
        </FeatureTextPanel>
        { screenshotSrc && screenshotAlt ? <>
          { displayModal && (
            <CustomModal onClick={() => setDisplayModal(false)} done={() => setDisplayModal(false)} primaryButtonProps={{style: {display: 'none'}}}>
              <img style={{cursor: 'zoom-out'}} onClick={() => setDisplayModal(false)} src={screenshotSrc} alt={screenshotAlt}/>
            </CustomModal>
          )}
          <FeatureScreenshotPanel onClick={() => setDisplayModal(true)}>
            <img style={{ cursor: 'zoom-in' }} src={screenshotSrc} alt={screenshotAlt}/>
          </FeatureScreenshotPanel>
        </> : (<></>)}
       </FeatureCardInnerColumn>

    </div>
  )

})`
  margin-top: 8px;
  margin-bottom: 16px;
  margin-left: 20px;
  margin-right: 20px;
  max-width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  border-radius: 4px;
  margin-bottom: 32px;
  box-sizing: border-box;
`


export default Feature