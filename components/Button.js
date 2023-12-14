import { primary } from "@/lib/colors";
import { css, styled } from "styled-components";

export const ButtonStyle = css`
  border: 0;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  text-decoration: none;
  font-weight: 500;
  font-family: "Roboto", sans-serif;
  svg {
    height: 1rem;
    margin-right: 0.3rem;
  }
  align-items: center;
  ${(props) =>
    props.block &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    `}
  ${(props) =>
    props.white &&
    !props.outline &&
    css`
      background-color: #fff;
      color: #222;
    `}
  ${(props) =>
    props.white &&
    props.outline &&
    css`
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;
    `}
  ${(props) =>
    props.black &&
    !props.outline &&
    css`
      background-color: #000;
      color: #fff;
      margin-top: 1rem;
    `}
    ${(props) =>
    props.black &&
    props.block &&
    props.disabled &&
    css`
      background-color: grey;
      color: #fff;
      margin-top: 1rem;
      pointer-events: none;
    `}
  ${(props) =>
    props.black &&
    props.outline &&
    css`
      background-color: transparent;
      color: #000;
      border: 1px solid #000;
    `}
  ${(props) =>
    props.primary &&
    !props.outline &&
    css`
      background-color: ${primary};
      border: 1px solid ${primary};
      color: #fff;
    `}
    ${(props) =>
    props.primary &&
    props.outline &&
    props.smaller &&
    css`
      background-color: ${primary};
      border: 1px solid ${primary};
      color: #fff;
      padding: 5px 10px;
      font-size: 0.8rem;
    `}
    ${(props) =>
    props.primary &&
    props.outline &&
    css`
      background-color: transparent;
      border: 1px solid ${primary};
      color: ${primary};
    `}
  ${(props) =>
    props.size === "l" &&
    css`
      font-size: 0.8rem;
      font-weight: 500;
    `}
`;

const StyledButton = styled.button`
  ${ButtonStyle}
`;

export default function CustomBtn({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>;
}
