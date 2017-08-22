import axios from 'axios'
import {commonParams, options} from './config'
import jsonp from 'assets/js/jsonp'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    rnd: Math.random(),
    hostUin: 0,
    loginUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format: 'json'
  })

  return axios(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSongList(dissid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: dissid,
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf8',
    platform: 'yqq',
    needNewCode: 0
  })

  return jsonp(url, data, options)
}
