import breakpoint from '../breakpoint.js'
import styled, { keyframes } from '../styled-components.js'

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Text = styled.span`
  font-size: 14px;
  line-height: 100%;
  font-weight: 400;
  color: rgba(0, 9, 40, 0.5);
  opacity: 0.5;

  @meidia (${breakpoint.devices.tablet}) {
    font-size: 16px;
  }
`

const flowdown = keyframes`
   0%{
     transform-origin: 0% 0%;
     transform: scale(1,0);
   }
   50%{
     transform-origin: 0% 0%;
     transform: scale(1, 1);
   }
   50.1%{
     transform-origin: 0% 100%;
     transform: scale(1, 1);
   }
   100%{
     transform-origin: 0% 100%;
     transform: scale(1, 0);
   }
`

const Line = styled.div`
  border-left: 1px solid rgba(0, 9, 40, 0.3);
  opacity: 0.5;
  height: 32px;
  margin-top: 8px;

  animation: ${flowdown} 1.5s infinite;

  @meidia (${breakpoint.devices.tablet}) {
    height: 40px;
  }
`

export default function ScrollDown({ className = '' }) {
  return (
    <Block className={className}>
      <Text>往下滑動</Text>
      <Line />
    </Block>
  )
}
