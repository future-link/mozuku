import * as React from 'react'
import moment from 'moment-timezone'

import {
  Post,
  BODYPART_TYPE_LINK,
  BODYPART_TYPE_LINK_IMAGE,
  BODYPART_TYPE_BOLD
} from '../models'

export default ({ post }: { post: Post }) => (
  <div className="post">
    <div className="post__head post-head">
      <div className="post-head__name">
        <span
          className={`post-head__name__name ${
            // FIXME: DIRTY!
            post.author.name.trim().length === 0 ? 'empty' : ''
          }`}
        >
          {[].filter
            .call(
              post.author.name.trim(),
              (c: string) => c.charCodeAt(0) !== 8203
            )
            .join('')
            .replace(/[\u200B-\u200D\uFEFF]/g, '').length === 0
            ? 'empty'
            : post.author.name}
        </span>
        <span className="post-head__name__screenName">
          @{post.author.screenName}
        </span>
      </div>
      <div className="post-head__time">
        {moment(post.createdAt)
          .tz('Asia/Tokyo')
          .format('HH:mm:ss · D MMM YYYY')}
      </div>
    </div>
    <div className="post__body">
      {post.body.parts.map((p, i) => {
        switch (p.type) {
          case BODYPART_TYPE_LINK:
          case BODYPART_TYPE_LINK_IMAGE:
            return (
              <a key={i} href={p.payload} target="_blank">
                {decodeURI(p.payload)}
              </a>
            )
          case BODYPART_TYPE_BOLD:
            return (
              <span key={i} className="post__body__bold">
                {p.payload}
              </span>
            )
          default:
            return <React.Fragment key={i}>{p.payload}</React.Fragment>
        }
      })}
    </div>
    {post.images.length ? (
      <div className="post__image">
        {post.images.map((im, k) => (
          <a key={k} href={im.direct} target="_blank">
            <img className="post-image__img" src={im.thumbnail} />
          </a>
        ))}
      </div>
    ) : (
      <></>
    )}
    <div className="post__meta">This post from {post.application.name}</div>
  </div>
)
