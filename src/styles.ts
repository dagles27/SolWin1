import styled from 'styled-components'

// src/styles.ts
import styled from 'styled-components'

export const MainWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  transition: width .25s ease, padding .25s ease;
  margin: 0 auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  /* DAS IST DER FIX – schiebt alles unter deinem neuen 80px Header runter */
  padding-top: 100px !important;
  margin-top: 0 !important;        /* überschreibt dein altes margin-top: 60px */

  @media (min-width: 600px) {
    padding: 20px;
    padding-top: 100px !important;   /* bleibt auch auf Tablet/Desktop */
    width: 1000px;
  }
  @media (min-width: 1280px) {
    padding: 20px;
    padding-top: 100px !important;
    width: 1100px;
  }
`
export const TosWrapper = styled.div`
  position: relative;
  &:after {
    content: " ";
    background: linear-gradient(180deg, transparent, #15151f);
    height: 50px;
    pointer-events: none;
    width: 100%;
    position: absolute;
    bottom: 0px;
    left: 0px;
  }
`

export const TosInner = styled.div`
  max-height: 400px;
  padding: 10px;
  overflow: auto;
  position: relative;
`
