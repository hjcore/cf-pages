export async function onRequest(context) {
  const { source, target } = context.env;

  if (!source || !target || context.request.headers.get('host') != source) {
    return new Response(
      JSON.stringify({ code: 400, msg: 'Source not match or miss source, target.', date: Date.now() }),
      { status: 400 }
    );
  }
  // console.log(context.request.headers.get('host'));
  const url = context.request.url.replace(source, target);

  try {
    const res = await fetch(url, context.request);

    context.waitUntil(res);

    return res;
  } catch {}

  return new Response(JSON.stringify({ code: 502, date: Date.now() }), { status: 502 });
}
