self.addEventListener('fetch', event => {
  if (
    event.request.method === 'POST' &&
    event.request.url.endsWith('/index.html')
  ) {
    event.respondWith(handleShare(event.request));
  }
});

async function handleShare(request) {
  const formData = await request.formData();
  
  // Ambil kiriman file (jika ada)
  const file = formData.get('file'); 
  
  // Ambil kiriman teks/link (jika ada)
  // Kadang aplikasi share kirim di field 'text', kadang di 'url'
  const text = formData.get('text') || formData.get('url'); 

  const cache = await caches.open('shared-files');

  // Simpan sesuai jenisnya
  if (file) {
    await cache.put('/shared-image', new Response(file));
  }
  
  if (text) {
    await cache.put('/shared-text', new Response(text));
  }

  // Setelah dipilah, baru buka aplikasinya
  return Response.redirect('/index.html', 303);
}