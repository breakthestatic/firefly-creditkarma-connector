import query from './query.js'

const {DAYS_TO_FETCH = 10} = process.env

const isWithinDays = (date, days) =>
  new Date(date) > new Date(new Date().setDate(new Date().getDate() - days))

export const getTransactions = async (accessToken) => {
  let cursor
  let cursorDate = new Date()
  let transactions = []

  const fetchPage = (cursor) =>
    fetch('https://api.creditkarma.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            paginationInput: cursor ? {afterCursor: cursor} : {},
            categoryInput: {categoryId: null, primeCategoryType: null},
            datePeriodInput: {datePeriod: null},
            accountInput: {},
          },
        },
      }),
    })
      .then((response) => response.json())
      .then(({data}) => data.prime.transactionsHub.transactionPage)

  while (isWithinDays(cursorDate, DAYS_TO_FETCH)) {
    const page = await fetchPage(cursor)

    if (page.transactions.length === 0) break

    cursorDate = page.transactions.at(-1).date
    cursor = page.pageInfo.endCursor

    transactions = [
      ...transactions,
      ...page.transactions.filter(({date}) =>
        isWithinDays(date, DAYS_TO_FETCH),
      ),
    ]
  }

  return transactions
}
