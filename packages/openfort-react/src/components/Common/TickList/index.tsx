import { TickIcon } from '../../../assets/icons';
import { TickIconWrapper, TickItem, TickListContainer } from './styles';

const TickList = ({ items }: {
  items: string[]
}) => {
  return (
    <TickListContainer>
      {items.map((item, index) => (
        <TickItem key={index}>
          <TickIconWrapper>
            <TickIcon />
          </TickIconWrapper>
          <span>{item}</span>
        </TickItem>
      ))}
    </TickListContainer>
  )
};
TickList.displayName = 'TickList';

export default TickList;
