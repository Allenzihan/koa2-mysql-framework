export const errorRoute = ()=> {
  return (ctx, next) => {
    return next().catch((err) => {
        switch (err.status) {
        case 401:
          ctx.status = 401
          ctx.body = {
            code: 200,
            msg: 'Authentication Error.Protected resource, use authorization header to get access.'
          }
          break
        default: 
          throw err
      }
    })
 }
}

export const notFoundRoute = () => {
  return (ctx, next) => {
    switch (ctx.status) {
      case 404:
        ctx.body = '没有找到内容 - 404'
        break
    }
    next()
  }
}