import styled from 'styled-components';

const Box = styled.div`
  background: var(--backgroundTertiary);
  border-radius: 8px;

  padding: 16px;

  margin-bottom: 10px;
  .boxLink {
    font-size: 14px;
    color: var(--colorPrimary);
    text-decoration: none;
    font-weight: 800;
    word-break: break-word;
  }
  .title {
    font-size: 32px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .subTitle {
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .smallTitle {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 700;
    color: var(--textPrimaryColor);
    margin-bottom: 20px;
  }
  .inputTestimonialArea {
    border-radius: 8px;
    height: 80px;
    width: 100%;
    background-color: #F1F6FC;
    color: var(--colorPrimary);
    border: 0;
    padding: 8px;
    margin-bottom: 14px;
    resize: none;
    outline: none;
    ::placeholder {
      color: #9ec7e5;
      opacity: 1;
    }
  }
  hr {
    margin-top: 12px;
    margin-bottom: 8px;
    border-color: transparent;
    border-bottom-color: #ECF2FA;
  }
  input {
    width: 100%;
    background-color: #F1F6FC;
    color: var(--colorPrimary);
    border: 0;
    padding: 14px 16px;
    margin-bottom: 14px;
    border-radius: 10000px;
    ::placeholder {
      color: #9ec7e5;
      opacity: 1;
    }
  }
  button {
    border: 0;
    padding: 8px 12px;
    color: #FFFFFF;
    border-radius: 10000px;
    background-color: #6F92BB;
  }
`;

export default Box