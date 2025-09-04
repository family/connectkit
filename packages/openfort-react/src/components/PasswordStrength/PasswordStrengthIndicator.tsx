import { motion } from "framer-motion";
import styled from "../../styles/styled";
import { getPasswordStrength, getPasswordStrengthLabel, PasswordStrengthLabel } from "./password-utility";
import { useMemo } from "react";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const BarWrapper = styled.div`
  width: 100%;
  height: 4px;
  background: var(--ck-secondary-button-background);
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled(motion.div) <{ color: string }>`
  height: 100%;
  background: ${({ color }) => color};
  border-radius: 4px;
`;

const Label = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ck-body-color-muted);
`;

const LabelColor = styled.span<{ color: string }>`
  color: ${({ color }) => color};
`;

export const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const passwordStrength = getPasswordStrength(password); // should return a number between 0 and 1
  const label = getPasswordStrengthLabel(passwordStrength);

  const color = useMemo(() => {
    switch (label) {
      case "Weak":
        return "#ef4444"; // red-500
      case "Medium":
        return "#f59e0b"; // amber-500
      case "Strong":
        return "#10b981"; // emerald-500
      case "Very Strong":
        return "#3b82f6"; // blue-500
      default:
        return "#d1d5db"; // gray-300
    }
  }, [label]);

  return (
    <Container>
      <BarWrapper>
        <Progress
          color={color}
          initial={{ width: 0 }}
          animate={{ width: `${passwordStrength * 100}%` }}
          transition={{ ease: "easeOut", duration: 0.5 }}
        />
      </BarWrapper>
      <Label>Password strength: <LabelColor color={color}>{label}</LabelColor></Label>
    </Container>
  );
};
