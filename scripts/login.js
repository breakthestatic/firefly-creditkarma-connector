import {readFileSync} from 'fs'
import {createHash} from 'crypto'

const {USERNAME, PASSWORD} = process.env

const cookieHeader = readFileSync('./data/cookies.txt').toString()
const fraudSessionId = readFileSync('./data/fraud-session-id.txt').toString()
const cookies = Object.fromEntries(
  cookieHeader.split(';').map((cookie) => cookie.trim().split('=')),
)
const hashedCsrfToken = createHash('sha256')
  .update(decodeURIComponent(cookies.CKCSRFTOKEN))
  .digest('hex')

export const getAccessToken = async () => {
  const response = await fetch('https://accounts.creditkarma.com/authorize', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      cookie: cookieHeader,
    },
    body: new URLSearchParams({
      username: USERNAME,
      password: PASSWORD,
      'nd-session-id': fraudSessionId,
      stk: hashedCsrfToken,
      awt: '1',
      idf: 'true',
      sourceSurface: 'login',
    }),
    method: 'POST',
  })

  const body = await response.text()

  return body.match(/window\._ACCESS_TOKEN\s*=\s*"(.*?)"/)?.[1]
}
