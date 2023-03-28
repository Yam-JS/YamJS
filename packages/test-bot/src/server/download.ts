import got from 'got'

export const downloadPaper = async (
  url = 'https://api.papermc.io/v2/projects/paper/versions/1.19.3/builds/448/downloads/paper-1.19.3-448.jar'
) => {
  const response = await got(url, { method: 'GET' })

  if (!response) throw new Error(`Unable to get ${url}`)

  return response.rawBody
}

export const downloadYamJs = async (version: string = '0.0.1', isLegacy = false) => {
  const response = await got(
    `https://github.com/Yam-JS/YamJS/releases/download/${version}/yamjs-paper-${
      isLegacy ? 'legacy-' : ''
    }${version}.jar`
  )

  if (!response) throw new Error(`Unable to get YamJS plugin`)

  return response.rawBody
}