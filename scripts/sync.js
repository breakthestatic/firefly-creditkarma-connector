import {readFileSync} from 'fs'
import {stringify} from 'csv/sync'
import url from 'url'
import {getAccessToken} from './login.js'
import {getTransactions} from './transactions.js'
import {byAccount, excludeTransfers, posted} from './transaction-filters.js'

const {
  ACCOUNTS,
  IMPORTER_HOST,
  IMPORTER_PROTOCOL = 'http',
  IMPORTER_PORT,
  IMPORTER_SECRET,
} = process.env

const accessToken = await getAccessToken()

const transactions = (await getTransactions(accessToken))
  .filter(posted)
  .filter(byAccount(ACCOUNTS))
  .filter(excludeTransfers)
  .map(({date, description, amount, account, category, id}) => [
    date,
    amount.value,
    description,
    category.name,
    `${account.providerName} ${account.accountTypeAndNumberDisplay}`,
    id,
  ])

const payload = stringify([
  ['Date', 'Amount', 'Description', 'Category', 'Account', 'Transaction Id'],
  ...transactions.sort(([a], [b]) => new Date(b) - new Date(a)),
])

console.log(payload)

const formData = new FormData()
formData.append('importable', new Blob([payload]))
formData.append('json', new Blob([readFileSync('./data/import_config.json')]))

await fetch(
  url.format({
    protocol: IMPORTER_PROTOCOL,
    host: IMPORTER_HOST,
    port: IMPORTER_PORT,
    pathname: '/autoupload',
    query: {secret: IMPORTER_SECRET},
  }),
  {
    method: 'POST',
    body: formData,
  },
)
