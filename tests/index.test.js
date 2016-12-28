import test from 'ava'
import CookieStorage from '../src'

test('cookie should be defined and have predefined properties', t => {
  const storage = new CookieStorage()

  t.is(typeof storage, 'object')
  t.is(storage.keyPrefix, '')
  t.is(storage.indexKey, 'reduxPersistIndex')
})

test('handles passed options', t => {
  const storage = new CookieStorage({keyPrefix: 'MyPrefix', indexKey: 'customKey'})

  t.is(storage.keyPrefix, 'MyPrefix')
  t.is(storage.indexKey, 'customKey')
})

test('sets cookie keys', async t => {
  const storage = new CookieStorage()

  await storage.setItem('some', 'value')
  await storage.setItem('another', 'meaning')

  const keys = await storage.getAllKeys()
  t.deepEqual(keys, ['some', 'another'])
})

test('gets cookie keys', async t => {
  const storage = new CookieStorage()

  await storage.setItem('question', 42)

  t.is(await storage.getItem('question'), 42)
})

test('removes cookie keys', async t => {
  const storage = new CookieStorage({keyPrefix: 'omen'})

  await storage.setItem('number of the beast', 666)
  await storage.setItem('another brick', 'in the wall')
  await storage.removeItem('number of the beast')

  t.is(await storage.getItem('number of the beast'), undefined)
  t.deepEqual(await storage.getAllKeys(), ['another brick'])
})
