# Netlify için Next.js Projesi Kurulumu

1. **Netlify'da yeni bir site oluşturun** ve bu projeyi GitHub'a gönderin veya Netlify CLI ile deploy edin.
2. **Netlify ayarlarında**:
   - Build Command: `pnpm build` veya `npm run build`
   - Publish directory: `.next`
   - Node.js Version: 18 veya 20 önerilir
3. **next.config.mjs** dosyanızda aşağıdaki ayarları ekleyin:

```js
// next.config.mjs
const nextConfig = {
  output: 'standalone',
}
export default nextConfig
```

4. **Netlify için özel ayar dosyası ekleyin:**

`netlify.toml` dosyası oluşturun:

```toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

5. **Netlify Plugin'i ekleyin:**

```sh
pnpm add -D @netlify/plugin-nextjs
```

6. **Çevre değişkenleri** gerekiyorsa Netlify panelinden ekleyin.

Artık projeniz Netlify'ya deploy edilmeye hazır!
