import React, { useRef } from 'react'
import styled from 'styled-components'
import { Flex } from 'rendition'
import { SortTypes } from '../../../types'
import { OptionsPanelSectionTitle } from '.'
import { Visibility } from '@styled-icons/material/Visibility'
import { AccessTimeFilled } from '@styled-icons/material/AccessTimeFilled'
import { useDrop, XYCoord, DropTargetMonitor, useDrag } from 'react-dnd'
import { Twitch } from '@styled-icons/feather/Twitch'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { useMemo } from 'react'
import { sortMoved, sortToggled } from '../../../redux/channels'
import PlusOrMinusIcon from '../../badges/PlusOrMinusIcon'
import { Stopwatch } from '@styled-icons/fa-solid/Stopwatch'



const SortByAlpha = styled(Twitch)`
  stroke-width: 2px;
  padding-top: 1px;
`

const SortSetterOuterContainer = styled.div`
display: flex;
flex-direction: row;
height: 30px;
`

const SortSetterContainer = styled.div`
  height: 30px;
`

const NodeStemContainer = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'row'
}))`
  height: 30px;
  position: absolute;
  margin-left: 2px;
`


const NodeAndMaybeStem = styled(({ className, index }: { index: number, className?: string}) => (
  <div className={className} draggable={false}><div className={'index'}>{index}</div><div className={'arrow'}></div></div>
))`
  height: 30px;
  overflow: show;
  border: 2px solid ${p => p.theme.colors.quartenary.dark};
  background-color: ${p => p.theme.colors.quartenary.dark};
  box-sizing: border-box;
  width: 30px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 18px;
  margin-right: auto;
  position: relative;
  border-radius: 4px;

  .arrow {
    width: 0;
    height: 0;
    top: 0;
    margin: auto;
    bottom: 0;
    border-top: 14px solid transparent;
    border-bottom: 14px solid transparent;
    border-top-left-radius: -20px;
    border-bottom-left-radius: -20px;
    border-left: 13px solid ${p => p.theme.colors.quartenary.dark};
    position: absolute;
    right: -14px;
  }

  .index {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    text-align: center;
    font-size: 36px;
    line-height: 24px;
    font-weight: bold;
    color: ${p => p.theme.colors.gray.main};
  }

  &:first-of-type {
    padding-left: 0;
    margin-left: 8px;
    width: 30px;
  }

  &:last-of-type {
    margin-right: 0px;
    padding-right: 0px;
    // width: 17px;

    .arrow {
      display: none;
    }

  } 

  svg {
    fill: ${p => p.theme.colors.gray.light};
    margin-top: auto;
    margin-bottom: auto;
    height: 40px;
    width: 16px;
    position: relative;
    display: flex-item;
    opacity: 0;
  }

`

const DraggableIconsContainer = styled(Flex).attrs(p => ({
  ...p,
  flexDirection: 'row'
}))`
  height: 30px;
  margin-left: 8px;
`

const DraggableIcon = styled(({ onClick, id, index, moveIcon, className, channelName, children }: { onClick?: (e: React.MouseEvent) => void, children?: JSX.Element, channelName: string, id: SortTypes, index: number, moveIcon: (dragIndex: number, hoverIndex: number, channelName: string) => void, className?: string}) => {

    const ref = useRef<HTMLDivElement>(null)

    const [{ handlerId }, drop] = useDrop({
      accept: 'sortIcon',
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId()
        }
      },
      hover(item: { type: string, index: number, id: SortTypes }, monitor: DropTargetMonitor) {
          if (!ref.current) {
            return
          }
          const dragIndex = item.index
          const hoverIndex = index
  
          if (dragIndex === hoverIndex) {
            return
          }
  
          const hoverBoundingRect = ref.current?.getBoundingClientRect()
  
          const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
  
          const clientOffset = monitor.getClientOffset()
  
          const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left
  
          if (dragIndex < hoverIndex && hoverClientX < (hoverMiddleX)) {
            return
          }

          if (dragIndex > hoverIndex && hoverClientX > (hoverMiddleX)) {
            return
          }

          moveIcon(dragIndex, hoverIndex, channelName)
          item.index = hoverIndex
        

      }
    })

    const [{ isDragging }, drag, preview] = useDrag({
      type: 'sortIcon',
      item: () => {
        return { id, index }
      },
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging()
      })
    })

    const Icon = SortIcons[id]

    const opacity = isDragging ? 0 : 1
    // const previewDisplay = isDragging ? 'inherit' : 'none'
    drag(drop(ref))
    return (
        <div onClick={onClick} ref={ref} className={className} style={{ opacity }} data-handler-id={handlerId}>
            <Icon ref={preview}/>
        </div>
    )

})
// const DraggableIcon = styled.div
<
  {
    disabled?: boolean
  }
>
`
    height: 30px;
    width: 32px;
    display: flex;
    margin-left: 16px;
  
    &:first-of-type {
      margin-left: 1px;
    }

    &:last-of-type {
      width: 32px;
    }

    svg {
      z-index: 100;
      display: block;
      margin-top: auto;
      margin-bottom: auto;
      margin-left: auto;
      margin-right: auto;
      height: 24px;
      width: 24px;
      color: ${p => p.theme.colors.secondary.dark};

      ${p => {
        return p.disabled && `
          opacity: 0.6;
        `}
      }
    }

    cursor: move;
`

const SorterPlusOrMinus = styled(PlusOrMinusIcon)`
  background-color: ${({theme}) => theme.colors.success.semilight};
  padding: 2px;
  border-radius: 4px;
  box-sizing: border-box;
  fill: #23445e;
  height: 24px;
`

const SorterAccessTimeFilled = styled(AccessTimeFilled)`
  background-color: ${({theme}) => theme.colors.secondary.dark};
  fill: white;
  border-radius: 4px;
`

const SorterTimer = styled(Stopwatch)`
  background-color: ${({theme}) => theme.colors.primary.light};
  border-radius: 4px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-right: 1px;
  box-sizing: border-box;
  path {
    fill: white;
  }
`

const SorterSortByName = styled(SortByAlpha)`
  background-color: rgb(100,65,164);
  border-radius: 4px;
  padding: 2px;
  stroke: white;
  box-sizing: border-box;
`

const SorterViews = styled(Visibility)`
  background-color: ${({theme}) => theme.colors.success.dark};
  border-radius: 4px;
  padding: 2px;
  fill: ${({theme}) => theme.colors.success.light};
  box-sizing: border-box;
`

const SortIcons = {
  [SortTypes.frogscount]: SorterPlusOrMinus,
  [SortTypes.date]: SorterAccessTimeFilled,
  [SortTypes.length]: SorterTimer,
  [SortTypes.streamername]: SorterSortByName,
  [SortTypes.views]: SorterViews
}

const AscendingContainer = styled.div`
  padding-top: 6px;
  height: 10px;
  position: absolute;
  display: flex;
  flex-direction: row;
  
`

const AscendingArrow = styled.div<{brighten: boolean}>`
  height: 0;
  width: 0;
  position: relative;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 28px;
  margin-right: 0px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 6px solid ${p => p.brighten ? p.theme.colors.secondary.dark : 'transparent'};
  top: -15px;
  z-index: 2;

  &:first-of-type {
    margin-right: 0px;
    margin-left: 15px;
  }

  &:last-of-type {
    // margin-right: 8px;
    padding-right: 0px;
    // width: 17px;

    .arrow {
      display: none;
    }

  } 

`


const renderAscendingRow = (brighten: boolean[]) => brighten.map((brighten, i) => {
  return (

      <AscendingArrow key={'ascendingarrow'+i} brighten={brighten}/>
  )
})

const DescendingContainer = styled.div`
  padding-top: 20px;
  height: 10px;
  position: absolute;
  display: flex;
  flex-direction: row;
  
`

const DescendingArrow = styled.div<{brighten: boolean}>`
  height: 0;
  width: 0;
  position: relative;
  margin-top: auto;
  margin-bottom: -1px;
  margin-left: 28px;
  margin-right: auto;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 6px solid ${p => p.brighten ? p.theme.colors.secondary.dark : 'transparent'};
  bottom: -6px;
 
  &:first-of-type {
    margin-left: 15px;
    margin-right: 0px;
  }

  &:last-of-type {
    padding-right: 0px;
    // width: 17px;

    .arrow {
      display: none;
    }

  } 

`


const renderDescendingRow = (brighten: boolean[]) => brighten.map((brighten, i) => {
  return (
      <DescendingArrow key={'descendingarrow'+i} brighten={brighten}/>
  )
})


export const SortSetter = ({channelName, className}: {
  channelName: string
  className?: string
}) => {
  // const [displaySortOrder, setDisplaySortOrder] = useState<SortList>(currentSort)
  const currentSort = useAppSelector(state => state.channels[channelName].sort)
  const dispatch = useAppDispatch()

  const moveSort = useMemo(() => (dragIndex: number, hoverIndex: number, channelName: string) => {
    dispatch(sortMoved({
      dragIndex,
      hoverIndex,
      channelName
    }))}, [dispatch])
  
  const toggleSort = useMemo(() => (toggleIndex: number, channelName: string) => {
    dispatch(sortToggled({
      toggleIndex,
      channelName
    }))
  }, [dispatch])


  return (
    <SortSetterOuterContainer className={className}>
      <OptionsPanelSectionTitle isActive={currentSort.reduce((sortIs, sort) => sortIs ? true : sort.active, false as boolean)}>sort</OptionsPanelSectionTitle>
      <SortSetterContainer>
        <AscendingContainer>
          { renderAscendingRow(currentSort.map(sort => sort.direction === 'asc' && sort.active)) }
        </AscendingContainer>
        <NodeStemContainer>
          { currentSort.map((sort, index)=> (
            <NodeAndMaybeStem key={'node'+index+1} index={index+1}/>
          ))}
        </NodeStemContainer>
        <DescendingContainer>
            { renderDescendingRow(currentSort.map(sort => sort.direction === 'desc' && sort.active))}
        </DescendingContainer>
        <DraggableIconsContainer>
          {currentSort.map((sort, i) => {
            let Icon = SortIcons[sort.type]
            return <DraggableIcon disabled={!sort.active} onClick={(e) => toggleSort(i, channelName)} id={sort.type} key={sort.type+'icon'+channelName} index={i} moveIcon={moveSort} channelName={channelName}><Icon  /></DraggableIcon>
          })}
        </DraggableIconsContainer>
      </SortSetterContainer>
    </SortSetterOuterContainer>
  )


}

export default styled(SortSetter)`
  margin-left: 4px;
  margin-top: auto;
  margin-bottom: auto;
`