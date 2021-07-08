import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { appStore, PREFERENCE_DISPLAY_META_ENABLED } from '../../furui/stores'
import { Post as Layout } from './post'
import { AlbumFile } from '../../furui/models'

export type PostProps = Readonly<{
  postId: number
  setModalContent: (albumfile: AlbumFile | null) => void
  setInReplyTo: React.Dispatch<React.SetStateAction<number | null>>
}>
export const Post: React.FC<PostProps> = ({
  postId,
  setModalContent,
  setInReplyTo,
}) => {
  return useObserver(() => {
    const post = appStore.posts.get(postId)
    if (post == null) {
      appStore.fetchPost(postId)
      return null
    }

    const metaEnabled = appStore.getPreference(PREFERENCE_DISPLAY_META_ENABLED)

    return (
      <Layout
        post={post}
        metaEnabled={metaEnabled}
        setModalContent={setModalContent}
        setInReplyTo={setInReplyTo}
        inReplyToContent={
          post.inReplyToId && (
            <Post
              postId={post.inReplyToId}
              setModalContent={setModalContent}
              setInReplyTo={setInReplyTo}
            />
          )
        }
      />
    )
  })
}
