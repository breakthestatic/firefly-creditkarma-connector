export default `
    query GetTransactions($input: Prime_TransactionFiltersInput) {
      prime {
        transactionsHub(input: $input) {
          __typename
          ... on Prime_NoAccountsLinkedError {
            linkAccountUrl
            message
            title
          }
          ... on Prime_Transactions {
            transactionPage {
              __typename
              ... on Prime_TransactionPage {
                transactions {
                  __typename
                  ... on Prime_Transaction {
                    id
                    date
                    description
                    status
                    amount {
                      __typename
                      ... on Prime_AmountOfUsd {
                        value
                        asCurrencyString
                      }
                    }
                    account {
                      id
                      name
                      type
                      providerName
                      accountTypeAndNumberDisplay
                    }
                    category {
                      id
                      name
                      type
                    }
                    merchant {
                      id
                      name
                    }
                  }
                }
                pageInfo {
                  ... on Prime_PageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                  }
                }
              }
            }
            pageTitle: title
          }
        }
      }
    }
  `
