import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { selectHelpViewActive } from '../redux/selectors'
import { helpViewDeactivated } from '../redux/settings'

const HelpPopovers: { [targetName: string]: { h: string, b: string, arrowSide: string, arrowPosition: string } } = {
  AuthButton: {
    h: "Log in with Twitch",
    b: "Log in with Twitch to begin using ClipsTime!",
    arrowSide: 'left',
    arrowPosition: 'top'
  },
  AddButton: {
    h: "Add channel",
    b: "Add a new channel to start collecting clips and annotations.",
    arrowSide: 'left',
    arrowPosition: 'center'
  },
  ChannelControlBar: {
    h: "Channel Controls",
    b: "Pause / resume recording, lock the display, or clear clips.",
    arrowSide: 'bottom',
    arrowPosition: 'center'
  },
  SortControls: {
    h: "Sort",
    b: "Set your sort preferences: drag icons to change order, click icons to toggle between off, ascending, and descending.",
    arrowSide: 'left',
    arrowPosition: 'top'
  },
  ChannelCloseButton: {
    h: "Close channel",
    b: "Close and remove channel.",
    arrowSide: 'left',
    arrowPosition: 'center'
  },
  VerticalVoteCountBadge: {
    h: "Vote Count",
    b: "See how many people have upvoted a clip (or a stack of clips). Badges show which user types have liked this clip/clipstack, if any have marked it as meta or drama, and if mods have vetoed one or more clips in this stack.",
    arrowSide: 'top',
    arrowPosition: 'left'
  },
  StackedBadges: {
    h: "Badges",
    b: "These badges indicate the clock time, duration range, total views or total upvotes for the clip(s) in this stack. Their vertical order depends on your sort preferences.",
    arrowSide: 'left',
    arrowPosition: 'center'
  },
  OtherBadges: {
    h: "Tags and Expand Clips",
    b: "Hover to view tags; click below to browse any overlapping clips.",
    arrowSide: 'left',
    arrowPosition: 'top'
  },
  ClipUpperRightOverlay: {
    h: "Clip-specific stats",
    b: "When a stack is expanded, view per-clip stats in the upper right, color-coded to match the stack badges and the sort-setting toolbar above.",
    arrowSide: 'top',
    arrowPosition: 'left'
  },
  OpenInNew: {
    h: "Pop Out Player",
    b: "Pop out the clips player so that you can customize its size or position -- or move it to another display. You can full-screen the popped-out player by pressing F11.",
    arrowSide: 'right',
    arrowPosition: 'top'
  }
}


const HelpPopover = styled(({targetName, className}: { targetName: string, className?: string, right: number, top: number, left: number, bottom: number }) => {
  return (
    <div className={className}>
      <div className={'arrow'}>•</div>
      <h5>{HelpPopovers[targetName].h}</h5>
      {HelpPopovers[targetName].b}
    </div>
  )
})`
max-width: 300px;
  position: absolute;
  border-radius: 4px;
  ${p => {

    let result = ``
    
    switch (HelpPopovers[p.targetName].arrowSide) {
      case 'top': {
        result = result.concat(`
          max-width: 250px;
          top: ${p.bottom + 10}px;
          .arrow {
            height: 20px;
            width: 10px;
            top: -20px;
            text-align: center;
            border-top-right-radius: 4px;
            border-top-left-radius: 4px;
            box-shadow: 1px 0px 1px darkgray;
          }
        `)
        break;
      }
      case 'left': {
        result = result.concat(`
          left: ${p.left + 10}px;
          .arrow {
            height: 10px;
            width: 20px;
            left: -20px;
            text-align: left;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            box-shadow: -1px 1px 1px darkgray;
          }
        `)
        break;
      }
      case 'right': {
        result = result.concat(`
          right: calc(100vw - ${p.right - 10}px);
          .arrow {
            height: 10px;
            width: 20px;
            right: -20px;
            text-align: right;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            box-shadow: 0px 1px 1px darkgray;
          }
        `)
        break;
      }
      case 'bottom': {
        result = result.concat(`
          bottom: calc(100vh - ${p.top - 10}px);
          .arrow {
            height: 20px;
            width: 10px;
            bottom: -20px;
            text-align: center;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
            box-shadow: 0px 1px 1px darkgray;
          }
        `)
        break;
      }
      default: 
        break;
    }
    switch (HelpPopovers[p.targetName].arrowPosition) {
      case 'left': {
        result = result.concat(`left: ${p.right}px;`)
        break;
      }
      case 'right': {
        result = result.concat(`right: calc(100vw - ${p.right - 10}px);`)
        break;
      }
      case 'top': {
        result = result.concat(`top: ${p.top}px;`)
        break;
      }
      case 'bottom': {
        result = result.concat(`
          bottom: calc(100vh - ${p.bottom - 10}px);
          .arrow {
            bottom: 4px;
          }
        `)
        break;
      }
      case 'center': {

        if (["left", "right"].indexOf(HelpPopovers[p.targetName].arrowSide) > -1) {
          let componentHeight = p.bottom - p.top
          result = result.concat(`
            top: ${p.bottom - (componentHeight)}px;
            .arrow {
              top: ${componentHeight/2}px;
            }
            
          `)
        } else {
          let componentWidth = p.left - p.right
          result = result.concat(`
            left: ${Math.min(Math.abs(componentWidth), 0)}px;
            .arrow {
              right: ${p.right + (componentWidth)}px;
            }
          `)
        }
        break;
      }
      default: {
        break;
      }
    }
    return result
  }}


  background-color: white;
  padding: 8px;
  font-size: 12px;
  box-shadow: -1px 1px 1px darkgray;
  .arrow {
    position: absolute;
    border: 2px;
    background-color: white;
    padding-bottom: 2.5px;
    line-height: 5px;
    font-size: 25px;
    box-sizing: border-box;

  }
  h5 {
    font-size: 13px;
    margin-top: 0px;
    margin-bottom: 4px;
  }

`

const HelpOverlayContainer = styled(({className, forwardRef, deactivatePopover, children}: { children?: React.ReactNode[], className?: string, deactivatePopover: () => void, forwardRef?: React.RefObject<HTMLDivElement>}) => {

  return (
    <div className={className} onClick={deactivatePopover} ref={forwardRef}>{children}</div>
  )
})`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0,0,0,0.5);
  z-index: 899;
`

const renderPopovers = (document: Document) => {
  return Object.getOwnPropertyNames(HelpPopovers).map(popover => {
    let target = document.getElementsByClassName(popover)[0]
    if (target) {
      let { top, left, bottom, right } = target.getBoundingClientRect()
      console.log('target: ', top, left, bottom, right)
      return <HelpPopover targetName={popover} top={top} left={right} right={left} bottom={bottom}/>
    } else {
      return (<></>)
    }
  })
}

const HelpOverlay = () => {
  
  const helpActive = useAppSelector(state => selectHelpViewActive(state.settings))
  const dispatch = useAppDispatch()
  const helpOverlayContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (helpActive) {
      let helpOverlayDiv = document.createElement('div')
      helpOverlayDiv.classList.add('helpoverlay')
      document.body.appendChild(helpOverlayDiv)
      ReactDOM.render(<HelpOverlayContainer deactivatePopover={() => dispatch(helpViewDeactivated())} forwardRef={helpOverlayContainer}>
        {renderPopovers(document)}
      </HelpOverlayContainer>, helpOverlayDiv)
    } else {
      let helpoverlay = document.body.getElementsByClassName('helpoverlay')[0]
      helpoverlay && document.body.removeChild(helpoverlay)
    }

    return (() => {
      let helpoverlay = document.body.getElementsByClassName('helpoverlay')[0]
      helpoverlay && document.body.removeChild(helpoverlay)
    })
  }, [helpActive, dispatch])

  return (<></>)
}

export default HelpOverlay