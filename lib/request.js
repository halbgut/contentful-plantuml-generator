const { Observable: O } = require('rxjs')
const { default: request } = require('@orq/superagent')

const CONTENTFUL_BASE_URL =
  process.env.CONTENTFUL_BASE_URL ||
  'https://cdn.contentful.com'

const CONTENTFUL_API_KEY = process.env.CONTENTFUL_API_KEY

const PAGINATION_LIMIT = 100

const contentfulRequest = exports.contentfulRequest = (path, options) =>
  request(`${CONTENTFUL_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${CONTENTFUL_API_KEY}`,
    },
  })

exports.paginatedRequest = (path, options) => {
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
