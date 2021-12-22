import { StyledIcon } from '@styled-icons/styled-icon'
import React, { ReactElement } from 'react'
import styled, { StyledComponent } from 'styled-components'


// TopBar icons have two states: default, and hover.
// if a Styled Icon is not provided for either one, nothing will be displayed for that state.
// also accepts click handler.

export const TopBarIcon: <T extends StyledComponent<any, any> | undefined = undefined, K extends StyledIcon | undefined = undefined>(
  { 
    DefaultIcon, 
    HoverIcon, 
    className,
    toggledOn,
    onClick
  }: { 
    DefaultIcon?: T
    HoverIcon?: K
    className?: string
    toggledOn?: boolean
    onClick: (e: React.MouseEvent) => void
  }) => ReactElement = styled(({ DefaultIcon, HoverIcon, className, onClick, toggledOn}) => {

    console.log(DefaultIcon)

    return (
      <div className={className} onClick={onClick}>
        { typeof DefaultIcon != 'undefined' && (
          <DefaultIcon className={`headerIcon defaultIcon ${ DefaultIcon && isImage(DefaultIcon) ? 'imageIcon' : 'svgIcon' }`} />
        )}
        { typeof DefaultIcon != 'undefined' && (
          <HoverIcon className={`headerIcon hoverIcon svgIcon ${ DefaultIcon && toggledOn ? " toggledOn" : ""}`}/>
        )}
      </div>
    )
})`

  min-height: 41px;
  min-width: 41px;

  background-color: ${p => p.theme.colors.quartenary.semilight};
  border-color: ${p => p.theme.colors.secondary.semilight};
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;

  box-sizing: border-box;
  display: flex;
  position: relative;
  margin: auto 4px auto 4px;

  .headerIcon {
    position: absolute;
  }

  .svgIcon {
    padding: 4px;
  }

  .imageIcon {
    height: 33px;
    width: 33px;
    border-radius: 50%;
    margin: auto;
    top: -50%;
    bottom: -50%;
    left: -50%;
    right: -50%;
  }

  .defaultIcon {
    opacity: 1
  }

  .hoverIcon {
    opacity: ${({toggledOn}) => toggledOn ? 1 : 0};
  }

  &:hover {
    cursor: pointer;
    border-color: ${p => p.theme.colors.quartenary.dark};
    
    .hoverIcon {
      opacity: 1
    }

    .defaultIcon {
      opacity: 0
    }

  }


  .toggledOn {
    cursor: pointer;
    .hoverIcon {
      opacity: 1;
    }
    .defaultIcon {
      opacity: 0
    }

  }

  transition: opacity 0.1s;

`

function isImage(icon: StyledComponent<"svg", any> | StyledComponent<"image", any>): icon is StyledComponent<"image", any> {
  console.log(icon)
  return (icon as StyledComponent<"image", any>).target && (icon as StyledComponent<"image", any>).target === "img" ? true : false
}

export default TopBarIcon