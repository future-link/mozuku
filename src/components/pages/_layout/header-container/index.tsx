import * as React from 'react'

import * as styles from './header.css'

const HeaderContainer: React.FC = ({ children }) => (
  <div className={styles.header_wrapper}>
    <div className={styles.header}>{children}</div>
  </div>
)
export default HeaderContainer
