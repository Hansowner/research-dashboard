export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
  path?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

const VALID_ENTITY_TYPES = ['jtbd', 'fact', 'pain', 'gain'] as const
const VALID_THEME_COLORS = ['blue', 'green', 'amber', 'purple', 'rose', 'cyan'] as const

export function validateJSON(jsonString: string): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Step 1: Check if valid JSON
  let data: any
  try {
    data = JSON.parse(jsonString)
  } catch (e) {
    return {
      isValid: false,
      errors: [{
        field: 'root',
        message: `Invalid JSON syntax: ${(e as Error).message}`,
        severity: 'error'
      }],
      warnings: []
    }
  }

  // Step 2: Check root structure
  if (typeof data !== 'object' || data === null) {
    errors.push({
      field: 'root',
      message: 'Root must be an object',
      severity: 'error'
    })
    return { isValid: false, errors, warnings }
  }

  if (!('themes' in data)) {
    errors.push({
      field: 'themes',
      message: 'Missing required "themes" property',
      severity: 'error'
    })
    return { isValid: false, errors, warnings }
  }

  if (!Array.isArray(data.themes)) {
    errors.push({
      field: 'themes',
      message: '"themes" must be an array',
      severity: 'error'
    })
    return { isValid: false, errors, warnings }
  }

  // Step 3: Validate each theme
  const themeIds = new Set<string>()

  data.themes.forEach((theme: any, themeIndex: number) => {
    const themePath = `themes[${themeIndex}]`

    // Check theme structure
    if (typeof theme !== 'object' || theme === null) {
      errors.push({
        field: `${themePath}`,
        message: 'Theme must be an object',
        severity: 'error',
        path: themePath
      })
      return
    }

    // Validate required theme fields
    validateRequired(theme, 'id', 'string', themePath, errors)
    validateRequired(theme, 'title', 'string', themePath, errors)
    validateRequired(theme, 'description', 'string', themePath, errors)
    validateRequired(theme, 'sources', 'array', themePath, errors)
    validateRequired(theme, 'clusterCount', 'number', themePath, errors)
    validateRequired(theme, 'color', 'string', themePath, errors)
    validateRequired(theme, 'clusters', 'array', themePath, errors)

    // Check theme ID uniqueness
    if (theme.id) {
      if (themeIds.has(theme.id)) {
        errors.push({
          field: `${themePath}.id`,
          message: `Duplicate theme ID "${theme.id}"`,
          severity: 'error',
          path: `${themePath}.id`
        })
      }
      themeIds.add(theme.id)
    }

    // Validate theme color
    if (theme.color && !VALID_THEME_COLORS.includes(theme.color)) {
      errors.push({
        field: `${themePath}.color`,
        message: `Invalid color "${theme.color}". Must be one of: ${VALID_THEME_COLORS.join(', ')}`,
        severity: 'error',
        path: `${themePath}.color`
      })
    }

    // Check cluster count consistency
    if (theme.clusters && theme.clusterCount !== undefined) {
      if (theme.clusterCount !== theme.clusters.length) {
        warnings.push({
          field: `${themePath}.clusterCount`,
          message: `clusterCount (${theme.clusterCount}) doesn't match clusters array length (${theme.clusters.length})`,
          severity: 'warning',
          path: `${themePath}.clusterCount`
        })
      }
    }

    // Validate clusters
    if (Array.isArray(theme.clusters)) {
      const clusterIds = new Set<string>()

      theme.clusters.forEach((cluster: any, clusterIndex: number) => {
        const clusterPath = `${themePath}.clusters[${clusterIndex}]`

        if (typeof cluster !== 'object' || cluster === null) {
          errors.push({
            field: clusterPath,
            message: 'Cluster must be an object',
            severity: 'error',
            path: clusterPath
          })
          return
        }

        // Validate required cluster fields
        validateRequired(cluster, 'id', 'string', clusterPath, errors)
        validateRequired(cluster, 'name', 'string', clusterPath, errors)
        validateRequired(cluster, 'summary', 'string', clusterPath, errors)
        validateRequired(cluster, 'entityCount', 'number', clusterPath, errors)
        validateRequired(cluster, 'entities', 'array', clusterPath, errors)

        // Check cluster ID uniqueness
        if (cluster.id) {
          if (clusterIds.has(cluster.id)) {
            errors.push({
              field: `${clusterPath}.id`,
              message: `Duplicate cluster ID "${cluster.id}" in theme "${theme.id || themeIndex}"`,
              severity: 'error',
              path: `${clusterPath}.id`
            })
          }
          clusterIds.add(cluster.id)
        }

        // Check entity count consistency
        if (cluster.entities && cluster.entityCount !== undefined) {
          if (cluster.entityCount !== cluster.entities.length) {
            warnings.push({
              field: `${clusterPath}.entityCount`,
              message: `entityCount (${cluster.entityCount}) doesn't match entities array length (${cluster.entities.length})`,
              severity: 'warning',
              path: `${clusterPath}.entityCount`
            })
          }
        }

        // Validate entities
        if (Array.isArray(cluster.entities)) {
          const entityIds = new Set<string>()

          cluster.entities.forEach((entity: any, entityIndex: number) => {
            const entityPath = `${clusterPath}.entities[${entityIndex}]`

            if (typeof entity !== 'object' || entity === null) {
              errors.push({
                field: entityPath,
                message: 'Entity must be an object',
                severity: 'error',
                path: entityPath
              })
              return
            }

            // Validate required entity fields
            validateRequired(entity, 'id', 'string', entityPath, errors)
            validateRequired(entity, 'statement', 'string', entityPath, errors)
            validateRequired(entity, 'type', 'string', entityPath, errors)
            validateRequired(entity, 'source', 'string', entityPath, errors)
            validateRequired(entity, 'transcriptId', 'string', entityPath, errors)
            validateRequired(entity, 'participantId', 'string', entityPath, errors)
            validateRequired(entity, 'timestamp', 'string', entityPath, errors)
            validateRequired(entity, 'date', 'string', entityPath, errors)
            validateRequired(entity, 'verbatimQuote', 'string', entityPath, errors)
            validateRequired(entity, 'context', 'string', entityPath, errors)

            // Check entity ID uniqueness
            if (entity.id) {
              if (entityIds.has(entity.id)) {
                errors.push({
                  field: `${entityPath}.id`,
                  message: `Duplicate entity ID "${entity.id}" in cluster "${cluster.id || clusterIndex}"`,
                  severity: 'error',
                  path: `${entityPath}.id`
                })
              }
              entityIds.add(entity.id)
            }

            // Validate entity type
            if (entity.type && !VALID_ENTITY_TYPES.includes(entity.type)) {
              errors.push({
                field: `${entityPath}.type`,
                message: `Invalid type "${entity.type}". Must be one of: ${VALID_ENTITY_TYPES.join(', ')}`,
                severity: 'error',
                path: `${entityPath}.type`
              })
            }

            // Validate optional array fields
            if ('pains' in entity && entity.pains !== undefined) {
              if (!Array.isArray(entity.pains)) {
                errors.push({
                  field: `${entityPath}.pains`,
                  message: 'pains must be an array of strings',
                  severity: 'error',
                  path: `${entityPath}.pains`
                })
              } else if (!entity.pains.every((p: any) => typeof p === 'string')) {
                errors.push({
                  field: `${entityPath}.pains`,
                  message: 'All items in pains array must be strings',
                  severity: 'error',
                  path: `${entityPath}.pains`
                })
              }
            }

            if ('gains' in entity && entity.gains !== undefined) {
              if (!Array.isArray(entity.gains)) {
                errors.push({
                  field: `${entityPath}.gains`,
                  message: 'gains must be an array of strings',
                  severity: 'error',
                  path: `${entityPath}.gains`
                })
              } else if (!entity.gains.every((g: any) => typeof g === 'string')) {
                errors.push({
                  field: `${entityPath}.gains`,
                  message: 'All items in gains array must be strings',
                  severity: 'error',
                  path: `${entityPath}.gains`
                })
              }
            }
          })
        }
      })
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

function validateRequired(
  obj: any,
  field: string,
  expectedType: 'string' | 'number' | 'array',
  path: string,
  errors: ValidationError[]
) {
  if (!(field in obj)) {
    errors.push({
      field: `${path}.${field}`,
      message: `Missing required field "${field}"`,
      severity: 'error',
      path: `${path}.${field}`
    })
    return
  }

  const value = obj[field]

  if (expectedType === 'array') {
    if (!Array.isArray(value)) {
      errors.push({
        field: `${path}.${field}`,
        message: `Field "${field}" must be an array`,
        severity: 'error',
        path: `${path}.${field}`
      })
    }
  } else if (typeof value !== expectedType) {
    errors.push({
      field: `${path}.${field}`,
      message: `Field "${field}" must be a ${expectedType}`,
      severity: 'error',
      path: `${path}.${field}`
    })
  }
}

export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid && result.warnings.length === 0) {
    return '✅ Valid! Your data structure is correct and ready to import.'
  }

  const errorCount = result.errors.length
  const warningCount = result.warnings.length

  let summary = ''

  if (errorCount > 0) {
    summary += `❌ ${errorCount} error${errorCount > 1 ? 's' : ''} found. `
  }

  if (warningCount > 0) {
    summary += `⚠️  ${warningCount} warning${warningCount > 1 ? 's' : ''} found. `
  }

  if (errorCount === 0 && warningCount > 0) {
    summary += 'You can still import, but fixing warnings is recommended.'
  }

  return summary.trim()
}
