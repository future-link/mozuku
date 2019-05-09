import { useEffect } from 'react'

import { observable, computed, action } from 'mobx'

import seaClient from '../util/seaClient'

const KEYS = Object.freeze({
  SEA_CLIENT_PACK: 'mozuku::seaClientState',
  SAPP_CACHE: 'mozuku::stores::App'
})

import {
  Account,
  Post,
  BODYPART_TYPE_BOLD,
  BODYPART_TYPE_TEXT
} from '../models'
import { PostBodyPart } from '../models/post'

export type ShortcutFn = (ev: KeyboardEvent) => void

class SApp {
  readonly defaultTitle = 'Mozuku'

  @observable hidden = document.hidden
  private setHidden(hidden: boolean) {
    this.hidden = hidden
    this.hiddenListener.forEach(fn => fn(hidden))
  }
  private hiddenListener: ((h: boolean)=>void)[] = []
  subscribeHiddenChange(callback: (h: boolean)=>void) {
    // TODO: あとで unsubscribe いるかも
    this.hiddenListener.push(callback)
  }

  @observable loggedIn: boolean = false
  @computed get initialized() {
    return !!this.me
  }

  @observable accounts: Map<number, Account> = new Map()
  @observable posts: Map<number, Post> = new Map()

  @observable meId!: number
  @computed get me() {
    return this.meId ? this.accounts.get(this.meId) : undefined
  }
  private shortcuts: Map<number, ShortcutFn> = new Map()
  addShortcut(charCode: number, callback: ShortcutFn) {
    // 複数 callback 同じキーに設定しない (atarimae)
    // TODO: 同時に押していい感じに！ってキーバインディングしたいかもしれないのであとでやる かも
    this.shortcuts.set(charCode, callback)
  }
  removeShortcut(charCode: number) {
    this.shortcuts.delete(charCode)
  }

  load () {
    const ss = localStorage.getItem(KEYS.SEA_CLIENT_PACK)
    if (ss) {
      seaClient.unpack(ss)
      this.loggedIn = true
    }
    const sac = localStorage.getItem(KEYS.SAPP_CACHE)
    if (sac) {
      const { accounts, posts, me } = JSON.parse(sac)
      if (accounts) this.pushAccounts(accounts)
      if (posts) this.pushPosts(posts)
      if (me && this.posts.has(me)) this.meId = me
    }
  }
  save () {
    const p = seaClient.pack()
    localStorage.setItem(KEYS.SEA_CLIENT_PACK, p)
    const s = {
      accounts: Array.from(this.accounts.entries()),
      posts: Array.from(this.posts.entries()),
      me: this.meId
    }
    localStorage.setItem(KEYS.SAPP_CACHE, JSON.stringify(s))
  }

  constructor() {
    this.load()

    window.addEventListener('visibilitychange', () => {
      this.setHidden(document.hidden)
    })
    window.document.addEventListener('keypress', ev => {
      if (this.shortcuts.has(ev.charCode)) {
        this.shortcuts.get(ev.charCode)!(ev)
      }
    })
    const fn = () => {
      this.save()
      setTimeout(fn, 1000)
    }
    setTimeout(fn, 5000)
  }
  @action
  login() {
    this.save()
    this.loggedIn = true
  }
  @action
  logout() {
    seaClient.clear()
    this.save()
    this.loggedIn = false
  }

  async init() {
    try {
      const me = await seaClient
        .get('/v1/account')
        .then((d: any) => new Account(d))
      this.accounts.set(me.id, me)
      this.meId = me.id
    } catch(e) {
      alert('Check sea. You will be logged-out.')
      console.error(e)
      this.logout()
    }
  }

  async pushAccounts(as: any[]) {
    const asm = await Promise.all(as.map(async (a: any) => new Account(a)))
    asm.forEach(a => {
      this.accounts.set(a.id, a)
    })
  }
  async pushPosts(ps: any[]) {
    // Make bold me
    const boldMyScreenNameMiddleware = (a: Account) => (
      p: PostBodyPart
    ): PostBodyPart[] => {
      if (p.type !== BODYPART_TYPE_TEXT) {
        return [p]
      }
      const { screenName } = a
      const target = '@' + screenName
      const r = p.payload.split(new RegExp(`(${target})`, 'gi'))
      return r.map(t => {
        if (t === target) {
          return {
            type: BODYPART_TYPE_BOLD,
            payload: t
          }
        }
        return {
          type: BODYPART_TYPE_TEXT,
          payload: t
        }
      })
    }

    // cast to post
    const pms = await Promise.all(ps.map(async (p: any) => new Post(p)))
    // custom process for domain
    const posts = await Promise.all(
      pms.map(post => {
        // model に閉じれない物をここにおきます
        if (!this.me) return post // ほとんどの場合ありえない (呼び出しタイミングを考えると)
        post.body.process([boldMyScreenNameMiddleware(this.me)])
        return post
      })
    )
    posts.forEach(p => {
      this.posts.set(p.id, p)
    })
    return posts
  }
}

const app = new SApp()
export default app

export const useShortcut = (charCode: number, callback: ShortcutFn) => {
  // custom react hook for shortcut
  useEffect(() => {
    app.addShortcut(charCode, callback)
    return () => {
      app.removeShortcut(charCode)
    }
  }, [])
}

const w = <any>window
w.app = app
w.seaClient = seaClient
