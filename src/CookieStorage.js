import Cookies from 'cookies-js'

const genericSetImmediate = typeof setImmediate === 'undefined' ? global.setImmediate : setImmediate
const nextTick = process && process.nextTick ? process.nextTick : genericSetImmediate

export class CookieStorage {

  constructor (options = {}) {
    this.keyPrefix = options.keyPrefix || ''
    this.indexKey = options.indexKey || 'reduxPersistIndex'
    this.cookiesLib = typeof window === 'undefined' ? new FakeCookies(options.cookies) : Cookies
  }

  getAllKeys (cb) {
    return new Promise((resolve, reject) => {
      try {
        const cookie = this.cookiesLib.get(this.indexKey)
        const result = cookie ? JSON.parse(cookie) : []
        nextTick(() => {
          typeof cb === 'function' && cb(null, result)
          resolve(result)
        })
      } catch (err) {
        typeof cb === 'function' && cb(err)
        reject(err)
      }
    })
  }

  getItem (key, cb) {
    return new Promise((resolve, reject) => {
      try {
        const value = this.cookiesLib.get(this.keyPrefix + key)
        nextTick(() => {
          typeof cb === 'function' && cb(null, value)
          resolve(value)
        })
      } catch (err) {
        typeof cb === 'function' && cb(err)
        reject(err)
      }
    })
  }

  setItem (key, value, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {}
    }
    return new Promise(async (resolve, reject) => {
      try {
        this.cookiesLib.set(this.keyPrefix + key, value, options)
        const keys = await this.getAllKeys()
        if (!keys.includes(key)) {
          keys.push(key)
          this.cookiesLib.set(this.indexKey, JSON.stringify(keys))
        }
        nextTick(() => {
          typeof cb === 'function' && cb(null)
          resolve()
        })
      } catch (err) {
        typeof cb === 'function' && cb(err)
        reject(err)
      }
    })
  }

  removeItem (key, cb) {
    return new Promise(async (resolve, reject) => {
      try {
        this.cookiesLib.expire(this.keyPrefix + key)
        let keys = await this.getAllKeys()
        keys = keys.filter(k => k !== key)
        this.cookiesLib.set(this.indexKey, JSON.stringify(keys))
        nextTick(() => {
          typeof cb === 'function' && cb(null)
          resolve()
        })
      } catch (err) {
        typeof cb === 'function' && cb(err)
        reject(err)
      }
    })
  }

  clear (cb) {
    return new Promise(async (resolve, reject) => {
      try {
        const keys = await this.getAllKeys()
        keys.forEach(key => this.cookiesLib.expire(this.keyPrefix + key))
        this.cookiesLib.expire(this.indexKey)
        nextTick(() => {
          typeof cb === 'function' && cb(null)
          resolve()
        })
      } catch (err) {
        typeof cb === 'function' && cb(err)
        reject(err)
      }
    })
  }
}

class FakeCookies {

  constructor(cookies = {}) {
    let parsed = {}
    Object.keys(cookies).forEach(key => {
      parsed[decodeURIComponent(key)] = cookies[key]
    })
    this.cookies = parsed
  }

  get (key) { return this.cookies[key] }

  set (key, value) { this.cookies[key] = value }

  expire (key ) { delete this.cookies[key] }
}