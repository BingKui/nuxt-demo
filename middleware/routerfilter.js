export default function (context) {
  // context.userAgent = context.isServer ? context.req.headers['user-agent'] : navigator.userAgent
  const { redirect, route } = context;
  console.log(context);
  if (route.path === '/m/weixin/pay-router') {
    return redirect('/m/weixin/myorder');
  }
}
