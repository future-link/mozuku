import * as React from 'react'

import { Account } from '../../furui/models'
import * as styles from './index.css'

type AvatarOpts = Readonly<{ account: Account; className?: string }>

function DummyAvatar({ name, className }: { name: string; className: string }) {
  return (
    <svg className={className}>
      <rect
        width="100%"
        height="100%"
        style={{ fill: 'var(--color-background)' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        fontStyle="bold"
        dominantBaseline="central"
        className={styles.no_select}
      >
        {name.substr(0, 1).toUpperCase()}
      </text>
    </svg>
  )
}

const Avatar: React.FC<AvatarOpts> = function Avatar({
  account,
  className = '',
}) {
  const imageClassName = [className, styles.avatar].join(' ')
  if (account.avatarFile) {
    return (
      <picture>
        {account.avatarFile.thumbnails.map((t) => (
          <source key={t.id} srcSet={t.url.href} type={t.mime} />
        ))}
        <img className={imageClassName} title={account.avatarFile.fileName} />
      </picture>
    )
  }
  return <DummyAvatar name={account.name} className={imageClassName} />
}

export default Avatar
