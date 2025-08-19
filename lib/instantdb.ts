import { init } from '@instantdb/react'

// Initialize InstantDB without schema for now
// Schema will be defined in the InstantDB dashboard
const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANTDB_APP_ID!,
})

export default db
