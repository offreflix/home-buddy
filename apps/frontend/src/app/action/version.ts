'use server'

import packageJson from '@/../package.json'

export async function getAppVersion() {
  return packageJson.version
}
