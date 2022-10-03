import styled from "styled-components";

export default function DocumentCard({ handleClick, textBody, createdAt }) {
  return (
    <>
      <Wrapper onClick={handleClick} data-testid="documentCard">
        <div>{textBody}</div>
        <small>{createdAt}</small>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  margin: 5px;
  padding: 5px;
`;
