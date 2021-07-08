import * as React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../../static/logo.png'
import * as styles from './header-logo.css'

const LogoImg = <img src={logo} width="64" height="64" alt="Mozuku" />

export type HeaderLogoProps = Readonly<{ disabled?: boolean }>

const HeaderLogo: React.FC<HeaderLogoProps> = ({ disabled = false }) => (
  <h1 className={styles.logo}>
    {disabled ? LogoImg : <Link to={{ pathname: '/' }}>{LogoImg}</Link>}
  </h1>
)
export default HeaderLogo
