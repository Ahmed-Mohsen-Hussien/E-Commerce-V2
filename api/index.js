export default async (req, res) => {
  const { reqHandler } = await import('../dist/freshcartApp2/server/server.mjs');
  return reqHandler(req, res);
};
