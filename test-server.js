const http = require('http')

const server = http.createServer((req, res) => {
  let body = ''
  req.on('data', chunk => body += chunk)
  req.on('end', () => {
    console.log('✅ Webhook received!')
    console.log('Body:', body)
    res.writeHead(200)
    res.end('OK')
  })
})

server.listen(4000, () => {
  console.log('Test server running on port 4000')
})