import React from 'react'
import styled from 'styled-components'

const FeatureTextPanel = styled.div`
margin-top: auto;
margin-bottom: 16px;
color: white;

  // background-color: ${({theme}) => theme.colors.primary.semilight};
  // border-right: 5px solid ${({theme}) => theme.colors.primary.light};
  // border-left: 3px solid ${({theme}) => theme.colors.primary.light};
  // border-bottom: 3px solid ${({theme}) => theme.colors.primary.light};
  // border-top: 5px solid ${({theme}) => theme.colors.primary.light};
  // border-radius: 8px;
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

// const FeatureCardColumn = styled.div<{edge: string}>`
//  display: flex;
//  height: 100%;
//  flex-direction: column;
//  ${({edge}) => edge === 'left' ? `
//   margin-left: 0px;
//   margin-right: auto;
//  ` : `
//   margin-left: auto;
//   margin-right: 0px;
//  `}
//  padding: 8px;
//  max-width: 45%;
// `

export const Feature = styled((
  {
    className, 
    body, 
    screenshot
  }: { 
    className?: string, 
    body: React.ReactNode 
    screenshot?: React.ReactNode
  }) => {

  return ( 
    
    <div className={className}>
      <FeatureCardInnerColumn>
        <FeatureTextPanel>
          {body}
        </FeatureTextPanel>
        { screenshot ? (
          <FeatureScreenshotPanel>
            {screenshot}
          </FeatureScreenshotPanel>
        ) : (<></>)}
       </FeatureCardInnerColumn>

    </div>
  )

})`
  margin: 2%;
  max-width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  border-radius: 4px;
  margin-bottom: 32px;
  box-sizing: border-box;
`


export default Feature