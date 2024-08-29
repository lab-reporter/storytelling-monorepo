const {
  IS_UI_DISABLED,
  ACCESS_CONTROL_STRATEGY,
  PREVIEW_SERVER_ORIGIN,
  PREVIEW_SERVER_PATH,
  DATABASE_PROVIDER,
  DATABASE_URL,
  SESSION_SECRET,
  SESSION_MAX_AGE,
  GCS_URL_PREFIX,
  FILES_BASE_URL,
  FILES_STORAGE_PATH,
  IMAGES_BASE_URL,
  IMAGES_STORAGE_PATH,
  MEMORY_CACHE_TTL,
  MEMORY_CACHE_SIZE,
  CORS_ALLOW_ORIGINS,
} = process.env

enum DatabaseProvider {
  Sqlite = 'sqlite',
  Postgres = 'postgresql',
}

const getAllowOrigins = (cors: string) => {
  if (cors === '*') {
    return '*'
  } else if (typeof cors === 'string') {
    return cors.split(',')
  } else {
    return ['https://kids.twreporter.org', 'https://www.twreporter.org']
  }
}

export default {
  isUIDisabled: IS_UI_DISABLED === 'true',
  memoryCacheTtl: Number.isNaN(Number(MEMORY_CACHE_TTL))
    ? 300_000
    : Number(MEMORY_CACHE_TTL),
  memoryCacheSize: Number.isNaN(Number(MEMORY_CACHE_SIZE))
    ? 300
    : Number(MEMORY_CACHE_SIZE),
  accessControlStrategy: ACCESS_CONTROL_STRATEGY || 'cms', // the value could be one of 'cms', 'gql' or 'preview'
  database: {
    provider:
      DATABASE_PROVIDER === 'sqlite'
        ? DatabaseProvider.Sqlite
        : DatabaseProvider.Postgres,
    url:
      DATABASE_URL ||
      'postgres://user:password@localhost:5432/story-telling-public-cms',
  },
  session: {
    secret:
      SESSION_SECRET ||
      'default_session_secret_and_it_should_be_more_than_32_characters',
    maxAge:
      (typeof SESSION_MAX_AGE === 'string' && parseInt(SESSION_MAX_AGE)) ||
      60 * 60 * 24 * 1, // 1 days
  },
  gcs: {
    urlPrefix: GCS_URL_PREFIX || 'http://localhost:3000',
  },
  files: {
    baseUrl: FILES_BASE_URL || '/files',
    storagePath: FILES_STORAGE_PATH || 'public/files',
  },
  images: {
    baseUrl: IMAGES_BASE_URL || '/images',
    storagePath: IMAGES_STORAGE_PATH || 'public/images',
  },
  cors: {
    allowOrigins: getAllowOrigins(CORS_ALLOW_ORIGINS || ''),
  },
  previewServer: {
    origin: PREVIEW_SERVER_ORIGIN || 'http://localhost:3001',
    path: PREVIEW_SERVER_PATH || '/preview-server',
  },
}
