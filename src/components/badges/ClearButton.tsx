import { DeleteForever } from '@styled-icons/material/DeleteForever'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import Tooltip from '../popovers/Tooltip'

const ClearIcon = styled(DeleteForever).attrs((p) => ({
  ...p,
  viewBox: '0 0 20 21'
}))`
  height: 21px;
  margin-top: -5.5px;
  margin-bottom: auto;
  margin-right: 0px;
  fill: ${p => p.theme.colors.warning.light};
  width: 21px;
  cursor: pointer;

  &:hover {
    fill: red;
  }
`

const ClearPopoverText = styled.span`
  color: ${p => p.theme.colors.danger.main};
`

const ClearButton = styled(({resetChannel, className}: { resetChannel: () => void, className?: string }) => {
  let popoverTarget = useRef<HTMLDivElement>(null)
  let [showPopover, setShowPopover] = useState<any>(false)

  const handlePopover = debounce(() => setShowPopover(true), 100)

  const handleMouseExit = () => {
    handlePopover.cancel()
    setShowPopover(false)
  }
return (
  <div className={className} ref={popoverTarget} onMouseEnter={handlePopover} onMouseLeave={handleMouseExit}>
    {showPopover && !!(popoverTarget.current) && (
      <Tooltip target={popoverTarget.current} placement={'top'} onDismiss={() => {}}>
        <ClearPopoverText>Clear Clips (Irreversible!)</ClearPopoverText>
      </Tooltip>
    )}
    <ClearIcon onClick={() => resetChannel()}/>
  </div>
)

  
})`
`

export default ClearButton