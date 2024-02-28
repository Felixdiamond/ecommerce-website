import styled, { keyframes, css } from "styled-components";

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: sans-serif;
  animation: ${fadeIn} 2s ease-in;

  @media (max-width: 768px) {
    h1 {
      font-size: 3rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
`;

const StyledHeader = styled.h1`
  font-size: 4rem;
  margin-bottom: 2rem;
  color: #333;
  animation: ${bounce} 2s infinite;
`;

const StyledP = styled.p`
  font-size: 1.2rem;
  line-height: 1.5;
  color: #666;
  margin: 0 1rem;
  text-align: center;
`;

const Button56 = styled.button`
  align-items: center;
  background-color: #fee6e3;
  border: 2px solid #111;
  border-radius: 8px;
  box-sizing: border-box;
  color: #111;
  cursor: pointer;
  display: flex;
  font-family: Inter, sans-serif;
  font-size: 16px;
  height: 48px;
  justify-content: center;
  line-height: 24px;
  max-width: 100%;
  padding: 0 25px;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  align-items: center;

  :after {
    background-color: #111;
    border-radius: 8px;
    content: "";
    display: block;
    height: 48px;
    left: 0;
    width: 100%;
    position: absolute;
    top: -2px;
    transform: translate(8px, 8px);
    transition: transform 0.2s ease-out;
    z-index: -1;
  }

  :hover:after {
    transform: translate(0, 0);
  }

  :active {
    background-color: #ffdeda;
    outline: 0;
  }

  :hover {
    outline: 0;
  }

  @media (min-width: 768px) {
    padding: 0 40px;
  }
`;

const StyledSvg = styled.svg`
  width: 1rem;
  height: 1rem;
`;

const AccessDenied = () => {
  return (
    <StyledDiv className="access-denied">
      <StyledHeader>Oops!</StyledHeader>
      <StyledP>It seems you don't own this product or page not found.</StyledP>
      <StyledP>
        You can browse other products or head back to the homepage.
      </StyledP>
      <br />
      <Button56 onClick={() => {
        window.location.href = "/";
      }}>
        Go to homepage
        <StyledSvg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </StyledSvg>
      </Button56>
    </StyledDiv>
  );
};

export default AccessDenied;
