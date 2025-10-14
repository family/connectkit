import React from "react"
import { FloatWrapper, Graphic, Logo, LogoGroup, LogoInner, LogoPosition, RotateWrapper, LogoGraphic as LogoGraphicInner, GraphicBackground } from "./styles"
import wave from "../../assets/wave"

type LogoGraphicProps = {
  size?: string
  logo: React.ReactNode
}

export const LogoGraphic = ({ size = "100%", logo }: LogoGraphicProps) => {
  return (
    <Logo>
      <LogoPosition>
        <LogoInner>
          <FloatWrapper>
            <RotateWrapper>
              <LogoGraphicInner style={{ transform: `scale(${size})` }}>
                {logo}
              </LogoGraphicInner>
            </RotateWrapper>
          </FloatWrapper>
        </LogoInner>
      </LogoPosition>
    </Logo>
  )
}

export const FloatingGraphic = ({
  height = "130px",
  logoCenter,
  logoTopRight,
  logoTopLeft,
  logoBottomRight,
  logoBottomLeft
}: {
  height?: string
  logoCenter: LogoGraphicProps
  logoTopRight?: LogoGraphicProps
  logoTopLeft?: LogoGraphicProps
  logoBottomRight?: LogoGraphicProps
  logoBottomLeft?: LogoGraphicProps
}) => {
  return (
    <Graphic $height={height}>
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