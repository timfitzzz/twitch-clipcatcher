import { Flex } from 'rendition'
import styled from 'styled-components'
import CatcherBadge from '../../badges/CatcherBadge'
import ScannerWithCount from '../../badges/ScannerWithCount'

const TabTitleText = styled.h5`
  margin-right: 8px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: auto;
  margin-bottom: auto;
`


const TabTitle = ({channelName, scanning, clipsCount}: { channelName: string, scanning: boolean, clipsCount: number}) => {

  // console.log('rendering tabtitle')

  return (
    <Flex flexDirection={"row"}>
      <TabTitleText>{channelName}</TabTitleText>
      <CatcherBadge type={'clips'} value={clipsCount || 0}/>
      <ScannerWithCount channelName={channelName} spin={scanning} />
    </Flex>
  )

}

export default TabTitle