import { Popover } from 'rendition'
import styled from 'styled-components'

export const Tooltip = styled(Popover)`
  span {
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    padding: 4px;
    margin: auto;
  }
  div {
    display: flex;
    overflow: hidden;
    border-radius: 4px;
  }
`

export default Tooltip