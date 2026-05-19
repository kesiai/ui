import { useRef, useEffect } from 'react'
import { atom, useSetAtom } from 'jotai'
import dayjs, { type Dayjs } from 'dayjs'
import { useWS } from '@airiot/client'

export const serverTimeAtom = atom<Dayjs>(dayjs())

/**
 * 订阅 WebSocket time topic，将服务器时间写入全局 serverTimeAtom。
 * 本地每秒推进，服务器推送时校准。
 * 在 App 根组件调用一次即可。
 */
export function useServerTimeSync() {
  const setTime = useSetAtom(serverTimeAtom)
  const timeRef = useRef(dayjs())

  const { onData, subscribe } = useWS()

  useEffect(() => {
    const unsub = subscribe('time', {})
    return unsub
  }, [subscribe])

  useEffect(() => {
    onData((json: any) => {
      if (json?.time) {
        const server = dayjs(Number(json.time))
        timeRef.current = server
        setTime(server)
      }
    })
  }, [onData, setTime])

  useEffect(() => {
    const id = setInterval(() => {
      timeRef.current = timeRef.current.add(1, 'second')
      setTime(timeRef.current)
    }, 1000)
    return () => clearInterval(id)
  }, [setTime])
}
