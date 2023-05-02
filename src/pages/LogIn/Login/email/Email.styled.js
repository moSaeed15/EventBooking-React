import styled from 'styled-components';

export const StyledEmail = styled.div`
  border: 1px solid #999999;
  background-color: white;
  width: 350px;
  height: 50px;
  margin-right: 10px;
  margin-top: 10px;
  padding-right: 20px;
  position: relative;
  input {
    outline: none;
    position: relative;
    line-height: 1.2em;
    font-size: 14px;
    width: 348px;
    height: 48px;

    border-style: hidden;
    padding: 6px 5px 6px;
  }

  label {
    margin-left: 10px;
    display: inline-block;
    font-size: 13px;
    color: #999999;
    position: absolute;
    left: 0;

    z-index: 3;
  }
  &:hover {
    border: 1px solid;
    border-color: blue;

    label {
      display: inline-block;
      font-size: 13px;
      color: blue;
    }
  }
`;
