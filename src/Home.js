import React from 'react';
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faDiscord, faYoutube } from '@fortawesome/free-brands-svg-icons'
import Mint from './Mint';
import * as s from "./styles/globalStyles";

const CONTAINER_BG = '#c376c5';

export const Root = styled.div`
  background-color: #cf88d3;
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
  background-image: url(/config/images/banner.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top center;
  align-items: flex-end;
  min-height: 100vh;
`;

export const StyledContainer = styled.div`
  background-color: ${(props) => props.background};
  padding: 40px;
  width: 70%
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

const Home = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Root>
      <HeaderSection>
        <Navigation>
          {/* <img src='/config/images/logo.png' /> */}
          <SocialLink href="https://twitter.com/astardegens" target="_blank">
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </SocialLink>
          <SocialLink href="discord.gg/TGbsGh6UQZ" target="_blank">
            <FontAwesomeIcon icon={faDiscord} size="lg" />
          </SocialLink>
          <SocialLink href="https://www.youtube.com/channel/UCFNkLmrqNJExZ9nmQIJtpNg/videos" target="_blank">
            <FontAwesomeIcon icon={faYoutube} size="lg" />
          </SocialLink>
        </Navigation>
        {/* <Burger open={open} setOpen={setOpen} />
        <Menu open={open} setOpen={setOpen} /> */}
        <Mint />
      </HeaderSection>
      <StyledSection>
        <StyledContainer background={CONTAINER_BG} className="reveal" style={{color: "var(--primary-text)"}}>
          <s.TextTitle style={{ fontSize: 50}}>Mission</s.TextTitle>
          <s.SpacerLarge />
          Incubating promising projects and bringing new ideas to the Astar Ecosystem with the help of a community-governed DAO fund.
          <s.SpacerLarge />
          <s.SpacerLarge />
          <s.SpacerLarge />          
          <s.TextTitle style={{ fontSize: 50}}>Vision</s.TextTitle>
          <s.SpacerLarge />
          <p>ASTAR DEGENS DAO is focussed on helping the ASTAR community to be creative and try out their ideas without the fear of failure.  We want to be the enablers in funding and moulding your ideas in to a financially viable product, connecting to investors and taking the product to market</p>
          <p>70% of the funds raised from NFT minting will be moved to DAO wallet to start supporting the builders & projects from the ASTAR and the wider Polkadot ecosystem</p>
        </StyledContainer>
      </StyledSection>
      <StyledSection>
        <ImagesContainer background={CONTAINER_BG} className="reveal" style={{color: "var(--primary-text)"}}>
          <img src="/config/images/4.png" alt="Astar Degens NFT preview"/>
          <img src="/config/images/7.png" alt="Astar Degens NFT preview"/>
          <img src="/config/images/11.png" alt="Astar Degens NFT preview"/>
          <img src="/config/images/44.png" alt="Astar Degens NFT preview"/>
        </ImagesContainer>
      </StyledSection>
      <StyledSection>
        <StyledContainer background={CONTAINER_BG} className="reveal" style={{color: "var(--primary-text)"}}>
          <s.TextTitle style={{ fontSize: 50}}>Contacts</s.TextTitle>
          Discord: <a href="https://discord.gg/H9wHEjUjc6" target="_blank">https://discord.gg/H9wHEjUjc6</a>
          <s.SpacerLarge />   
          Twitter: <a href="https://twitter.com/astardegens" target="_blank">@astardegens</a>
          <s.SpacerLarge />
          Youtube: <a href="https://www.youtube.com/channel/UCFNkLmrqNJExZ9nmQIJtpNg/videos" target="_blank">https://www.youtube.com/channel/UCFNkLmrqNJExZ9nmQIJtpNg/videos</a>
          <s.SpacerLarge />
          Email: <a href="mailto:astardegens@gmail.com">astardegens@gmail.com</a>
          <s.SpacerLarge />
        </StyledContainer>
      </StyledSection>
    </Root>
  )
}

export default Home;