
import React from 'react';
import styled from "styled-components";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faDiscord, faYoutube } from '@fortawesome/free-brands-svg-icons'
import Mint from './Mint';
import * as s from "./styles/globalStyles";

const CONTAINER_BG = '#15162d';

export const Root = styled.div`
  background-color: #05061d;
`;

export const StyledSection = styled.section`
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 900px){
    section h1{
      font-size: 2rem;
      text-align: center;
    }
    section .text-container{
      flex-direction: column;
    }
  }
`;

export const HeaderSection = styled(StyledSection)`
  background-image: url(/config/images/background.jpg);
  background-repeat: no-repeat;
  min-height: 80vh;
  align-items: center;
  display: flex;

  @media (max-width: 800px){
    flex-direction: column;
  }
`;

export const StyledContainer = styled.div`
  background-color: ${(props) => props.background};
  padding: 40px;
  width: 70%;

  @media (max-width: 800px){
    padding: 10px;
    width: 90%;
  }
`;

export const ImagesContainer = styled(StyledContainer)`
  display:flex;
  flex-wrap: wrap;
  justify-content: center;

  img {
    margin: 10px;
    width: 350px;
    width: calc(100% / 2.5);
  }

  @media (max-width: 480px){
    img {
      width: 200px;
    }
  }
`;

export const ShidenPassContainer = styled(StyledContainer)`
  text-align: left;
`;

export const LogoConainer = styled(StyledContainer)`
  text-align: right;
  display: flex;
  flex-direction: column;
  img.back {
    width: 80%;
    min-width: 200px;
    max-width: 500px;
  }

  @media (max-width: 800px){
    text-align: center;
    margin-top: 50px;
  }
`;

export const Navigation = styled.div`
  position: absolute;
  top: 0;
  padding: 1rem;
  width: 100%;
  background-color: rgba(1,1,1,0.2);
  color: var(--accent-text);
  text-align: right;
`;

export const SocialLink = styled.a`
  margin-left: 16px;
  color: var(--accent-text);
`;

export const CoreTeamContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
`;

const Home = () => {
  const [open, setOpen] = React.useState(false);
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  return (
    <Root>
      <HeaderSection>
        <Navigation>
          <SocialLink href="https://twitter.com/AstarNetwork" target="_blank">
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </SocialLink>
          <SocialLink href="https://discord.gg/Z3nC9U4" target="_blank">
            <FontAwesomeIcon icon={faDiscord} size="lg" />
          </SocialLink>
          <SocialLink href="https://www.youtube.com/channel/UC36JgEF6gqatVSK9xlzzrvQ" target="_blank">
            <FontAwesomeIcon icon={faYoutube} size="lg" />
          </SocialLink>
        </Navigation>
        <LogoConainer style={{height: '100%'}}>
          {blockchain.account ? (data.isPassHolder ? <img width="100" src="/config/images/shiden-pass-ok.jpg" /> : <img width="100" src="/config/images/shiden-pass-nok.jpg" />) : <img width="100" src="/config/images/shiden-pass-gray.jpg" />}
          <img className="back" src="/config/images/mintingimage.png" />
        </LogoConainer>
        <StyledContainer>
          <Mint />
        </StyledContainer>
      </HeaderSection>
    </Root>
  )
}

export default Home;