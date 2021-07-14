import React, { ForwardedRef } from 'react'
import styled from 'styled-components';

export const PlusOrMinusIcon = styled(React.forwardRef(({ className }: { className?: string }, ref: ForwardedRef<SVGSVGElement>) => (
  <svg className={className} ref={ref} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M 24.503 25.324 L 20.033 25.324 L 20.033 20.054 L 15.403 20.054 L 15.403 15.974 L 20.033 15.974 L 20.033 10.834 L 24.503 10.834 L 24.503 15.974 L 29.053 15.974 L 29.053 20.054 L 24.503 20.054 L 24.503 25.324 Z" transform="matrix(0.6862379312515259, 0, 0, 0.6901800632476807, -10.580429077148438, -7.475122928619385)"/>
    <path d="M 44.033 34.947 L 35.693 34.947 L 35.693 31.267 L 44.033 31.267 L 44.033 34.947 Z" transform="matrix(1.1005849838256836, 0, 0, 0.8192079663276672, -28.51435661315918, -11.882760047912598)"/>
    <path d="M 20.336 37.588 L 17.786 37.588 L 17.786 13.988 L 20.336 13.988 L 20.336 37.588 Z" transform="matrix(0.882544994354248, 0.8706550002098083, -0.7291309833526611, 0.739533007144928, 12.035626411437988, -25.731857299804688)"/>
  </svg>
)))`
  fill: rgb(51, 51, 51); 
  white-space: pre;
`

export default PlusOrMinusIcon