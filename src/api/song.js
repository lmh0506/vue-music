import axios from 'axios'
import {commonParams} from './config'

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    pcachetime: +new Date(),
    songmid: mid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })

  return axios(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
