import { useState, useEffect } from 'react'
import {
  differenceInMonths,
  differenceInWeeks,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format
} from 'date-fns'
import riassumere, { interfaces as IRiassumere } from 'riassumere'

const Month = 'mo'
const Week = 'w'
const Day = 'd'
const Hour = 'h'
const Minute = 'm'
const Second = 's'
type TimeDiff = {
  type:
    | typeof Month
    | typeof Week
    | typeof Day
    | typeof Hour
    | typeof Minute
    | typeof Second
  duration: number
}
const diffFromNow = (dt: Date): TimeDiff | undefined => {
  const now = new Date()

  const months = differenceInMonths(now, dt)
  if (months > 0) return { type: Month, duration: months }

  const weeks = differenceInWeeks(now, dt)
  if (weeks > 0) return { type: Week, duration: weeks }

  const days = differenceInDays(now, dt)
  if (days > 0) return { type: Day, duration: days }

  const hours = differenceInHours(now, dt)
  if (hours > 0) return { type: Hour, duration: hours }

  const minutes = differenceInMinutes(now, dt)
  if (minutes > 0) return { type: Minute, duration: minutes }

  const seconds = differenceInSeconds(now, dt)
  if (seconds > 0) return { type: Second, duration: seconds }
}

// 虚無
const timerSubscribers = new Set<() => void>()
const timer = () => {
  Array.from(timerSubscribers.values()).forEach(async f => {
    f()
  })
  window.setTimeout(timer, 1000)
}
timer()

export const useRelativeTimeRepresent = (dt: Date) => {
  const [relativeTimeRepresent, setRTR] = useState(`0`)
  const setDiff = (d: TimeDiff) => {
    const t = `${d.duration}${d.type}`
    if (t !== relativeTimeRepresent) setRTR(t)
  }
  useEffect(() => {
    let t: number
    const runner = () => {
      const diff = main()
      if (!diff) timerSubscribers.delete(runner)
    }
    const main = () => {
      const diff = diffFromNow(dt)
      if (diff === undefined) return true
      switch (diff.type) {
        case Month:
          // stop timer
          setRTR(format(dt, 'd MMM yyyy'))
          return false
        default:
          setDiff(diff)
          return true
      }
    }
    runner()
    timerSubscribers.add(runner)
    return () => {
      window.clearTimeout(t)
    }
  }, [])
  return relativeTimeRepresent
}

const clawlCaches = new Map<string, IRiassumere.ISummary>()
export const useOGP = (href: string) => {
  const [result, setResult] = useState<IRiassumere.ISummary | undefined>()

  useEffect(() => {
    const main = async () => {
      if (clawlCaches.has(href)) {
        return setResult(clawlCaches.get(href))
      }
      const r = await riassumere(href)
      // あり得ないので無視
      if (Array.isArray(r)) return
      clawlCaches.set(href, r)
      return setResult(r)
    }
    main().catch(() => {})
  }, [])

  return result
}
