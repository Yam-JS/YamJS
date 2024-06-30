export const downloadPaper = async (
  url = 'https://api.papermc.io/v2/projects/paper/versions/1.21/builds/39/downloads/paper-1.21-39.jar'
) => {
  const response = await fetch(url, { method: 'GET' })

  if (!response) throw new Error(`Unable to get ${url}`)

  return Buffer.from(await response.arrayBuffer())
}

export const downloadYamJs = async (version: string = '0.0.1', isLegacy = false) => {
  const response = await fetch(
    `https://github.com/Yam-JS/YamJS/releases/download/${version}/yamjs-paper-${
      isLegacy ? 'legacy-' : ''
    }${version}.jar`
  )

  if (!response) throw new Error(`Unable to get YamJS plugin`)

  return Buffer.from(await response.arrayBuffer())
}
