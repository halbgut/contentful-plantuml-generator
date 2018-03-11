const mkClass = exports.mkClass = (fieldId) => {
  const classObj = {
    addField: ({ optional, name, type }) => {
      classObj.attributes.fields.push({ optional, name, type })
    },

    addContentfulField: (field) => {
      if (field.type === 'Array') {
        const types = getTypesFromField(field.items)
        classObj.addField({
          optional: !field.required,
          name: field.id,
          type: `Array<${types.join(' | ')}>`,
        })

        types.forEach((type) => {
          classObj.addLink({
            from: classObj.attributes.name,
            to: type,
            connection: {
              type: `--`,
              from: 1,
              to: '*',
            },
          })
        })
      } else if (field.type === 'Link') {
        classObj.addField({
          optional: !field.required,
          name: field.id,
          type: field.linkType,
        })

        const connection = getConnectionFromField(field)
        classObj.addLink({
          from: classObj.attributes.name,
          to: field.linkType,
          connection,
        })
      } else {
        classObj.addField({
          optional: !field.required,
          name: field.id,
          type: getTypesFromField(field).join(' | '),
        })
      }
    },

    addLink: ({ from, to, connection }) => {
      classObj.attributes.links.push({ from, to, connection })
    },

    attributes: {
      name: fieldIdToClass(fieldId),
      fields: [],
      links: [],
    },

    toString: () =>
      classToString(classObj.attributes)
  }

  return classObj
}

const getTypesFromField = (field) => {
  if (field.type === 'Link') {
    if (field.linkType === 'Entry' && field.validations) {
      const linkTypeValidation = field.validations.find((validation) =>
        Array.isArray(validation.linkContentType)
      )
      if (linkTypeValidation) {
        return linkTypeValidation.linkContentType.map(fieldIdToClass)
      }
    }

    return [fieldIdToClass(field.linkType)]
  } else {
    return [fieldIdToClass(field.type)]
  }
}

const getConnectionFromField = (field) => {
  if (field.required) {
    return { type: '--', to: '1' }
  } else {
    return { type: '--', to: '0..1' }
  }
}

const fieldIdToClass = (fieldId) =>
  `${fieldId[0].toUpperCase()}${fieldId.substr(1)}`

const classesToString = exports.classesToString = (classes) =>
  classes.map((classObj) => classObj.toString())
    .join('\n\n')

const toPlantUmlString = exports.toPlantUmlString = ({ classes }) =>
`@startuml

${classesToString(classes)}

@enduml`

const classToString = (attributes) =>
`class ${attributes.name} {
${attributes.fields.map(fieldToString).join('\n')}
}

${attributes.links.map(linkToString).join('\n')}`

const fieldToString = (field) =>
  `  ${field.optional ? '?' : ''}${field.type} ${field.name}`

const linkToString = ({ from, to, connection }) =>
  `${from} ${connectionToString(connection)} ${to}`

const connectionToString = ({ from, to, type }) =>
  `${from ? `"${from}" ` : ''}${type}${to ? ` "${to}"` : ''}`
