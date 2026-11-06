# Ramak Kala

**Tehlikeyi Gör, Bildir, Kazayı Önle.**

İş sağlığı ve güvenliği için QR kod tabanlı tehlike/ramak kala bildirim sistemi. Çalışanlar giriş yapmadan QR kodu okutarak bildirim formunu doldurur, yönetim ekibi bildirimleri panelden takip edip durumlarını günceller.

## Teknolojiler

- Next.js (App Router) + TypeScript
- Tailwind CSS
- SQLite + Prisma ORM
- `qrcode` ile QR kod üretimi
- `lucide-react` ikonlar
- `bcryptjs` ile şifre hashleme

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Ortam değişkenlerini ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın (proje zaten bir `.env` ile gelir, demo kurulum için ek işlem gerekmez):

```bash
cp .env.example .env
```

`.env` içeriği:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
SESSION_SECRET="ramak-kala-gizli-anahtar-degistir"
```

| Değişken | Açıklama |
| --- | --- |
| `DATABASE_URL` | SQLite veritabanı dosya yolu. Değiştirmeyin. |
| `NEXT_PUBLIC_SITE_URL` | Ana sayfadaki QR kodun yönlendirdiği adres. Aşağıdaki "Telefonla Test" bölümüne bakın. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | İlk kurulumda (`db:seed`) otomatik oluşturulacak demo yönetici hesabının bilgileri. |
| `SESSION_SECRET` | Oturum güvenliği için kullanılan gizli anahtar (prototipte sabit değer yeterlidir). |

### 3. Veritabanını oluşturun ve demo yönetici hesabını açın

```bash
npx prisma migrate dev --name init
npm run db:seed
```

Bu komut `ADMIN_USERNAME` / `ADMIN_PASSWORD` ile **şifresi bcrypt ile hashlenmiş** bir yönetici hesabı oluşturur. Veritabanı zaten kuruluysa ve `.env`'deki şifreyi değiştirip tekrar `npm run db:seed` çalıştırırsanız, mevcut hesabın şifresi güncellenir.

> Demo kurulum bilgileri: **kullanıcı adı `admin`, şifre `admin123`**. Sunum/teslim öncesi `.env` dosyasındaki `ADMIN_PASSWORD` değerini değiştirip `npm run db:seed` komutunu tekrar çalıştırarak şifreyi değiştirebilirsiniz.

### 4. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Telefonla Test Etme (QR Kod)

Next.js geliştirme sunucusu varsayılan olarak yerel ağdaki tüm arayüzlerde dinler (`npm run dev` çalıştığında terminalde `Network: http://<bilgisayar-ip>:3000` adresi yazar).

1. Bilgisayarınızın yerel ağ IP adresini öğrenin (macOS: `ipconfig getifaddr en0`).
2. `.env` dosyasında `NEXT_PUBLIC_SITE_URL` değerini bu IP ile güncelleyin, örnek:
   ```env
   NEXT_PUBLIC_SITE_URL="http://192.168.1.101:3000"
   ```
3. Geliştirme sunucusunu yeniden başlatın (`npm run dev`).
4. Ana sayfayı yenileyin, QR kod artık telefonunuzun da erişebileceği adrese yönlendirecektir.
5. Telefon ve bilgisayar **aynı Wi-Fi ağında** olmalıdır.
6. Siteyi bir sunucuya yayınladığınızda (canlıya aldığınızda) `NEXT_PUBLIC_SITE_URL` değerini yayınlanan alan adıyla değiştirmeniz yeterlidir.

Ana sayfada QR kodun altındaki **"QR Kodu İndir"** butonuyla kodu PNG olarak indirip yazdırabilir veya paylaşabilirsiniz.

## Kullanım

- **`/`** — Tanıtım sayfası ve QR kod.
- **`/bildir`** — Giriş gerektirmeyen bildirim formu (iş yeri, konu, bildirim türü, açıklama, isteğe bağlı fotoğraf).
- **`/admin/login`** — Yönetici girişi.
- **`/admin`** — İstatistik kartları ve bildirim tablosu (oturum korumalı).
- **`/admin/bildirimler/[id]`** — Bildirim detayı, fotoğraf görüntüleme ve durum güncelleme (oturum korumalı).

Bildirim durumları: **Bekliyor → İnceleniyor → Sorun Çözüldü**. Yeni bildirimler varsayılan olarak "Bekliyor" durumunda oluşturulur ve değişiklikler SQLite veritabanına kaydedilir.

## Güvenlik Notları

- Şifreler veritabanında düz metin olarak değil, `bcryptjs` ile hashlenmiş şekilde saklanır.
- Yönetici oturumları veritabanındaki `Session` tablosunda tutulan rastgele token'lar ile `httpOnly` çerez üzerinden yönetilir.
- Yüklenen fotoğraflar `public/` klasörü dışında, proje kökündeki `uploads/` klasöründe saklanır ve sadece oturum açmış yöneticiler `/api/admin/photos/[dosya]` uç noktası üzerinden görüntüleyebilir.
- Fotoğraf yüklemede dosya türü (JPG/PNG/WEBP) ve boyut (en fazla 5 MB) kontrolü yapılır.
- Tüm yönetici sayfaları ve API işlemleri sunucu tarafında oturum kontrolünden geçer.

## Faydalı Komutlar

```bash
npm run dev        # Geliştirme sunucusu
npm run build      # Prodüksiyon derlemesi
npm run start       # Derlenmiş uygulamayı çalıştırır
npm run db:seed     # Demo yönetici hesabını oluşturur/günceller
npx prisma studio    # Veritabanını tarayıcıda görüntülemek için (isteğe bağlı)
```
