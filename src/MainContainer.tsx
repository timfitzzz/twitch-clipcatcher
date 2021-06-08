import React, { ReactChild, ReactChildren } from 'react'
import { Box, Flex } from 'rendition'
import styled from 'styled-components'


const MainBodyBox = styled(Box)`
`

const MainContainer = ({children}: { children?: ReactChildren | ReactChild}) => {

  return (
    <Box>
      <Flex flexDirection={'row'}>
        {children}
      </Flex>
    </Box>
  )

}
