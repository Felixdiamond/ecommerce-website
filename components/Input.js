import { styled } from "styled-components";

const StyledInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 7px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    box-sizing: border-box;
    outline: none;
`;

export default function Input(props) {
    return <StyledInput {...props} />;
}