export const posted = ({status}) => status.toLowerCase() === 'posted'

export const byAccount = (accounts) => {
  return ({account: {id}}) => accounts.includes(id)
}

export const excludeTransfers = ({category: {name}}) =>
  name.toLowerCase() !== 'transfer'
