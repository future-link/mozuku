import * as React from 'react'
import { Link } from 'react-router-dom'

import {
  Container,
  HeaderContainer,
  HeaderLogo,
  BodyContainer,
} from '../_layout'

export type NotFoundProps = Readonly<{ pathname: string }>

const NotFound: React.FC<NotFoundProps> = ({ pathname }) => (
  <Container>
    <HeaderContainer>
      <HeaderLogo />
    </HeaderContainer>
    <BodyContainer>
      <div style={{ padding: '12px 18px' }}>
        <h2>未存在 {pathname || '”不明”'} 項</h2>
        <Link to={{ pathname: '/' }}>戻る</Link>
      </div>
    </BodyContainer>
  </Container>
)
export default NotFound
