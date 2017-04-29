import env from '../../env'

const baseUrl = env.HTTP_SCRIPT_BASEURL
const suffix = env.HTTP_SCRIPT_SUFFIX

export default function html(pageInfo, content, state) {
  let links = ``

  if (process.env.NODE_ENV === 'production') {
    links += `<link href="${baseUrl}/styles/default/index.min.css" rel="stylesheet" type="text/css" />`
  }

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charSet="utf-8"/>
    <title>${pageInfo.title}</title>
    <meta name="description" content=${pageInfo.description}/>
    <meta name="keyword" content=${pageInfo.keyword}/>
    <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    ${links}
  </head>
  <body>
    <div id="container">${content}</div>
    <script>
      window.__BUSINESS_ENV__ = "${process.env.BUSINESS_ENV}"
      window.__INITIAL_STATE__ = ${JSON.stringify(state)}
    </script>
    <script src="${baseUrl}/static/restaurant/scripts/main.js"></script>
  </body>
</html>`
}
