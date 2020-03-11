import * as styled from 'styled-components';

declare module 'styled-components' {
  export type Styled<P extends object> = styled.StyledComponent<any, {}, P>;
}
