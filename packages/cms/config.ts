import envVar from './environment-variables'

const database : { provider: 'postgresql'|'sqlite', url: string} = {
  provider: envVar.database.provider,
  url: envVar.database.url,
}

const session : { secret: string, maxAge: number} = {
  secret: envVar.session.secret,
  maxAge: envVar.session.maxAge,
} 

const googleCloudStorage = {
  origin: envVar.gcs.origin,
}

const files = {
  baseUrl: envVar.files.baseUrl,
  storagePath: envVar.files.storagePath,
}

const images = {
  baseUrl: envVar.images.baseUrl,
  storagePath: envVar.images.storagePath,
}

export default {
  database,
  session,
  googleCloudStorage,
  files,
  images,
}
