import { StyledIcon } from '@styled-icons/styled-icon';
import { ReactElement } from 'react';
import styled, { StyledComponent } from 'styled-components';


// headerIcons have two states: default, and hover.
// if a Styled Icon is not provided for either one, nothing will be displayed for that state.
// also accepts click handler.

export const HeaderIcon: <T extends StyledComponent<any, any> | undefined = undefined, K extends StyledIcon | undefined = undefined>(
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
    onClick: () => void
  }) => ReactElement = styled(({ DefaultIcon, HoverIcon, className, onClick, toggledOn}) => {

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
    margin: auto;
  }

  .imageIcon {
    height: 35px;
    width: 35px;
    padding: 0px;
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

  transition: opacity 0.1s;
`

function isImage(icon: StyledComponent<"svg", any> | StyledComponent<"image", any>): icon is StyledComponent<"image", any> {
  // eslint-disable-next-line
  return (icon as StyledComponent<"image", any>).propTypes && (icon as StyledComponent<"image", any>).propTypes?.y ? false : true
}

export default HeaderIcon