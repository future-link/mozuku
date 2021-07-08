import * as React from 'react'

import * as styles from './layout.css'

const Container: React.FC = ({ children }) => (
  <div className={styles.layout}>{children}</div>
)
export default Container
