export default async (req, res) => {
  // Directly points to your build configuration output folder name 'freshcartApp2'
  const { reqHandler } = await import('../dist/freshcartApp2/server/server.mjs');
  return reqHandler(req, res);
};
