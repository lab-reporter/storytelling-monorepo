import ScrollDown from './scroll-down.js'
import breakpoint from '../breakpoint.js'
import styled from '../styled-components.js'
import { Transition } from 'react-transition-group'
import { useRef } from 'react'

const Block = styled.div`
  transform: ${
    /**
     *  @param {Object} props
     *  @param {string} props.topOffset
     */
    (props) => {
      return `translateY(${props.topOffset || '0px'});`
    }
  }
  height: 100%;
  width: calc(280 / 320 * 100%);
  margin: 0 auto;
`

const FlexBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  @media ${breakpoint.devices.laptop} {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 80px;
  }
`

const Content = styled.div`
  color: rgba(0, 9, 40, 0.87);
  font-size: 20px;
  line-height: 150%;
  font-weight: 400;
  margin-top: 32px;

  @media ${breakpoint.devices.laptop} {
    width: 440px;
    order: 1;
  }

  @media ${breakpoint.devices.laptopL} {
    width: 560px;
  }
`

const ImgBlock = styled.div`
  margin-top: 40px;
  position: relative;
  width: 100%;
  /* width:height = 4:3 */
  padding-bottom: 75%;

  @media ${breakpoint.devices.laptop} {
    width: 440px;
    height: 330px;
    order: 2;
    padding-bottom: 0;
  }

  @media ${breakpoint.devices.laptopL} {
    width: 560px;
    height: 420px;
  }
`

const Img = styled.img`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const StyledScrollDown = styled(ScrollDown)`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`

const duration = 500

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

/**
 *  @export
 *  @typedef {Object} Slide
 *  @param {string} imgSrc
 *  @param {string[]} content
 */

/**
 *  @param {Object} props
 *  @param {boolean} props.inProp
 *  @param {Slide} props.slide
 *  @param {string} [props.className]
 *  @param {string} [props.topOffset='0px']
 *  @param {boolean} [props.showScrollDown=true]
 *  @returns {React.ReactElement}
 */
export default function Background({
  className,
  topOffset = '0px',
  slide,
  inProp,
  showScrollDown = true,
}) {
  const nodeRef = useRef(null)
  return (
    <div className={className}>
      <Block topOffset={topOffset}>
        <Transition nodeRef={nodeRef} in={inProp} timeout={duration}>
          {(state) => {
            return (
              <FlexBox
                ref={nodeRef}
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
              >
                <ImgBlock>
                  <Img src={slide.imgSrc}></Img>
                </ImgBlock>
                <Content>
                  {slide.content.map((text, index) => {
                    return <p key={index}>{text}</p>
                  })}
                </Content>
              </FlexBox>
            )
          }}
        </Transition>
        {showScrollDown && <StyledScrollDown />}
      </Block>
    </div>
  )
}
