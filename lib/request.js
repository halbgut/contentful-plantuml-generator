const { Observable: O } = require('rxjs')
const { default: request } = require('@orq/superagent')

module.exports = ({ accessToken, baseUrl }) => {
  const PAGINATION_LIMIT = 100

  const contentfulRequest = (path, options) =>
    request(`${baseUrl}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

  const paginatedRequest = (path, options) => {
    const getPage = (skip) =>
      contentfulRequest(
        `${path}?limit=${PAGINATION_LIMIT}&skip=${skip}`,
        options
      )
      .switchMap(({ body }) => {
        const items$ = O.from(body.items)
        return body.total > (body.limit + body.skip)
          ? getPage(skip + PAGINATION_LIMIT)
              .merge(items$)
          : items$
      })

    return getPage(0)
  }

  return { paginatedRequest, contentfulRequest }
}
