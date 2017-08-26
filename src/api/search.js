import {commonParams, options} from './config'
import jsonp from 'assets/js/jsonp'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  })

  return jsonp(url, data, options)
}

export function search(query, page, perpage, zhida) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, commonParams, {
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  })

  return jsonp(url, data, options)
}
