import type React from 'react'
import wave from '../../assets/wave'
import {
  FloatWrapper,
  Graphic,
  GraphicBackground,
  Logo,
  LogoGraphic as LogoGraphicInner,
  LogoGroup,
  LogoInner,
  LogoPosition,
  RotateWrapper,
} from './styles'

type LogoGraphicProps = {
  size?: string
  logo: React.ReactNode
}

const LogoGraphic = ({ size = '100%', logo }: LogoGraphicProps) => {
  return (
    <Logo>
      <LogoPosition>
        <LogoInner>
          <FloatWrapper>
            <RotateWrapper>
              <LogoGraphicInner style={{ transform: `scale(${size})` }}>{logo}</LogoGraphicInner>
            </RotateWrapper>
          </FloatWrapper>
        </LogoInner>
      </LogoPosition>
    </Logo>
  )
}

export const FloatingGraphic = ({
  height = '130px',
  marginBottom,
  marginTop,

  logoCenter,
  logoTopRight,
  logoTopLeft,
  logoBottomRight,
  logoBottomLeft,
}: {
  height?: string
  marginBottom?: string
  marginTop?: string

  logoCenter: LogoGraphicProps
  logoTopRight?: LogoGraphicProps
  logoTopLeft?: LogoGraphicProps
  logoBottomRight?: LogoGraphicProps
  logoBottomLeft?: LogoGraphicProps
}) => {
  return (
    <Graphic $height={height} $marginBottom={marginBottom} $marginTop={marginTop}>
      <LogoGroup>
        <LogoGraphic {...logoCenter} />
        {logoTopLeft ? <LogoGraphic {...logoTopLeft} /> : <div />}
        {logoTopRight ? <LogoGraphic {...logoTopRight} /> : <div />}
        {logoBottomLeft ? <LogoGraphic {...logoBottomLeft} /> : <div />}
        {logoBottomRight ? <LogoGraphic {...logoBottomRight} /> : <div />}
      </LogoGroup>
      <GraphicBackground>{wave}</GraphicBackground>
    </Graphic>
  )
}
