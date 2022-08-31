import React from 'react'
import styled, { StyledComponent } from 'styled-components'
import HeaderIcon from './HeaderIcon'
import { LogOut } from '@styled-icons/feather/LogOut'
import { Twitch } from '@styled-icons/feather'
import { HelpCircle } from '@styled-icons/feather/HelpCircle'

const IfYouAreLoggedInYouCanLogOut = styled(HeaderIcon).attrs<{ UserIcon: StyledComponent<"image", any> }>(p => ({
  className: p.className,
  DefaultIcon: p.UserIcon,
  HoverIcon: LogOut,
  toggledOn: false,
  onClick: p.onClick
}))``

const IfYouAreLoggedOutYouCanLogIn = styled(HeaderIcon).attrs(p => ({
  className: p.className,
  DefaultIcon: Twitch,
  HoverIcon: Twitch,
  toggledOn: false,
  onClick: p.onClick
}))``

const YouCanGetHelpIfYouNeed = styled(HeaderIcon).attrs(p => ({
  className: p.className,
  DefaultIcon: HelpCircle,
  HoverIcon: HelpCircle,
  toggledOn: p.toggledOn,
  onClick: p.onClick
}))``

export const HeaderButtons = { IfYouAreLoggedInYouCanLogOut, IfYouAreLoggedOutYouCanLogIn, YouCanGetHelpIfYouNeed }
export default HeaderButtons