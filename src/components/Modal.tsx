import React from 'react'
import { Icon } from './Icon'
import useOutsideClick from '../hooks/useOnClickOutside'
import styled from 'styled-components'

interface Props extends React.PropsWithChildren {
  onClose?: () => void
}

// Overlay – jetzt deutlich höher als Header + Abstand von oben
const StyledModal = styled.div`
  @keyframes appear {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.70);
  backdrop-filter: blur(8px);
  z-index: 100000;           /* VIEL höher als Header (9999) */
  overflow-y: auto;
  animation: appear 0.3s;

  /* WICHTIG: Nicht mehr mittig zentrieren, sondern oben beginnen */
  padding: 90px 20px 40px;   /* 90px = Platz für den fixed Header */
`

// Container – jetzt flex-start statt center
const Container = styled.div`
  display: flex;
  min-height: 1px;                    /* verhindert unnötige Höhe */
  justify-content: center;
  align-items: flex-start;            /* Startet oben! */
`

// Wrapper bleibt fast gleich, nur kleine Verbesserungen
const Wrapper = styled.div`
  @keyframes wrapper-appear2 {
    0% { transform: scale(0.92); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }

  position: relative;
  max-width: min(100%, 480px);
  width: 100%;
  background: #15151f;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
  animation: wrapper-appear2 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
  color: white;

  & h1 {
    text-align: center;
    padding: 40px 0 20px;
    font-size: 24px;
  }

  & p {
   : center;
    padding: 0 30px;
  }

  & button.close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 11;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.1);
    }

    svg {
      color: white;
      width: 20px;
      height: 20px;
    }
  }
`

export function Modal({ children, onClose }: Props) {
  React.useEffect(() => {
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = oldOverflow
    }
  }, [])

  const ref = React.useRef<HTMLDivElement>(null!)
  useOutsideClick(ref, () => onClose?.())

  return (
    <StyledModal>
      <Container>
        <Wrapper ref={ref}>
          {onClose && (
            <button className="close" onClick={onClose}>
              <Icon.Close2 />
            </button>
          )}
          {children}
        </Wrapper>
      </Container>
    </StyledModal>
  )
}