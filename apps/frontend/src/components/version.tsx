'use server'

import { getAppVersion } from '@/app/action/version'

export default async function AppVersion() {
  const version = await getAppVersion()

  return <span>Versão: {version}</span>
}
