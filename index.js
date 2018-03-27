#!/usr/bin/env node

require('rxjs')

const { mkClass, toPlantUmlString } = require('./lib/plantuml')

const [ , , spaceId, accessToken ] = process.argv
const CONTENTFUL_BASE_URL =
  process.env.CONTENTFUL_BASE_URL ||
  'https://api.contentful.com'


const { paginatedRequest } = require('./lib/request')({
  accessToken,
  baseUrl: CONTENTFUL_BASE_URL,
})

paginatedRequest(`/spaces/${spaceId}/content_types`)
  .map((model) => {
    const classObj = mkClass(model.sys.id)
    model.fields.forEach(classObj.addContentfulField)

    return classObj
  })
  .toArray()
  .map((classes) => toPlantUmlString({ classes }))
  .do((classes) => process.stdout.write(`${classes}\n`))
  .subscribe({
    error: (err) => {
      console.error(err)
      process.exit(1)
    },
  })
