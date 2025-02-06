import { keyframes } from "styled-components";
import styled from "../../../styles/styled";
import { useEffect } from "react";
import { useFortKit } from "../../FortKit";

const l3 = keyframes`
  20% { background-position: 0% 0%, 50% 50%, 100% 50% }
  40% { background-position: 0% 100%, 50% 0%, 100% 50% }
  60% { background-position: 0% 50%, 50% 100%, 100% 0% }
  80% { background-position: 0% 50%, 50% 50%, 100% 100% }
`;

const LoaderAnimation = styled.div`
  width: 60px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side, currentColor 80%, #0000);
  background: 
    var(--_g) 0% 50%,
    var(--_g) 50% 50%,
    var(--_g) 100% 50%;
  background-size: calc(100% / 3) 50%;
  opacity: 0.5;
  animation: ${l3} 1s infinite linear;
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 156px;
  margin-bottom: 64px;
`;

const Loader = () => {

  const { triggerResize } = useFortKit();

  useEffect(() => {
    return () => triggerResize();
  }, []);

  return (
    <LoaderWrapper>
      <LoaderAnimation />
    </LoaderWrapper>
  );
}

export default Loader;
