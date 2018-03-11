#!/usr/bin/env node

require('rxjs')

const { paginatedRequest } = require('./lib/request')
const { mkClass, toPlantUmlString } = require('./lib/plantuml')

const [ , , spaceId ] = process.argv

paginatedRequest(`/spaces/${spaceId}/content_types`)
//  .do((obj) => console.log(JSON.stringify(obj, null, '  ')))
  .map((model) => {
    const classObj = mkClass(model.sys.id)
    model.fields.forEach(classObj.addContentfulField)

    return classObj
  })
  .toArray()
  .map((classes) => toPlantUmlString({ classes }))
  .do((classes) => process.stdout.write(`${classes}\n`))
  .subscribe({
    error: console.error
  })
