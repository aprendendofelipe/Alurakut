import styled from 'styled-components';
import Box from '../Box';

const InputBox = styled(Box)`
  background: var(--backgroundQuarternary);

  input {
    padding: 14px 16px;
    margin-bottom: 14px;
    /* border: solid 1px; */
    border-radius: var(--commonRadius);
  }
  button {
    border: 0;
    padding: 8px 12px;
    color: #FFFFFF;
    background-color: var(--colorQuarternary);
    box-shadow: 
      0 2px 2px 0 rgb(0 0 0 / 14%),
      0 3px 1px -2px rgb(0 0 0 / 20%),
      0 1px 5px 0 rgb(0 0 0 / 12%);
  }
`;

export default InputBox