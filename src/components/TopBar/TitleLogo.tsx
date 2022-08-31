import styled from "styled-components";
import TitleImage from "../AuthPanel/TitleImage";

export const TitleLogo = styled(TitleImage)`
  height: 40px;
  margin-top: 0px;
  margin-bottom: 4px;
  margin-left: 0px;
  margin-right: auto;
  padding-left: 8px;
  path {
    stroke: ${p => p.theme.colors.secondary.main};
    stroke-width: 8px;
  }
`