import {readFileSync, writeFileSync} from 'fs'
import * as curlconverter from 'curlconverter'

const curl = readFileSync('./data/curl.txt').toString()
const {cookies, data} = JSON.parse(curlconverter.toJsonString(curl))

writeFileSync(
  './data/cookies.txt',
  Object.entries(cookies)
    .map((entry) => entry.join('='))
    .join('; '),
)
writeFileSync('./data/fraud-session-id.txt', data['nd-session-id'])
