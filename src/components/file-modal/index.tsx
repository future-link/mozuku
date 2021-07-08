import * as React from 'react'
import Overlay from '../overlay'

import * as styles from './modal.css'
import { AlbumFile } from '../../furui/models'

type OnClose = () => void
type OpenInNewTab = (url: string) => void

type Opts = Readonly<{
  openInNewTab: OpenInNewTab
  onClose: OnClose
  file: AlbumFile
}>
type ChildOpts = Readonly<
  Omit<Opts, 'openInNewTab'> & {
    onOpen: (
      e: React.MouseEvent<HTMLImageElement | HTMLVideoElement, MouseEvent>
    ) => void
  }
>

const ImageModal: React.FC<ChildOpts> = ({ onOpen, file: image, onClose }) => {
  return (
    <picture className={styles.container} onClick={onClose}>
      {image.directs.map((variant) => (
        <source
          key={variant.id}
          srcSet={variant.url.href}
          type={variant.mime}
        />
      ))}
      <img onClick={onOpen} />
    </picture>
  )
}
const VideoModal: React.FC<ChildOpts> = ({ onOpen, file: video, onClose }) => {
  return (
    <div className={styles.container} onClick={onClose}>
      <video
        poster={video.thumbnail.url.href}
        src={video.variants.get('video')![0].url.href}
        controls
        autoPlay
        onClick={onOpen}
      />
    </div>
  )
}

const FileModal: React.FC<Opts> = ({ onClose, file, openInNewTab }) => {
  const onOpen: (
    e: React.MouseEvent<HTMLImageElement | HTMLVideoElement, MouseEvent>
  ) => void = (e) => {
    openInNewTab(e.currentTarget.currentSrc)
  }
  return (
    <Overlay>
      <div className={styles.background}>
        {file.type === 'image' ? (
          <ImageModal onOpen={onOpen} file={file} onClose={onClose} />
        ) : file.type === 'video' ? (
          <VideoModal onOpen={onOpen} file={file} onClose={onClose} />
        ) : (
          <></>
        )}
      </div>
    </Overlay>
  )
}
export default FileModal
