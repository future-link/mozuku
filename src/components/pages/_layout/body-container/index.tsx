import * as React from 'react'

import * as styles from './container.css'

const BodyContainer: React.FC = ({ children }) => (
  <div className={styles.container}>{children}</div>
)
export default BodyContainer
