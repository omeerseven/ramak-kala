# Ramak Kala

**Tehlikeyi Gör, Bildir, Kazayı Önle.**

İş sağlığı ve güvenliği için QR kod tabanlı tehlike/ramak kala bildirim sistemi. Çalışanlar giriş yapmadan QR kodu okutarak bildirim formunu doldurur, yönetim ekibi bildirimleri panelden takip edip durumlarını günceller.

## Teknolojiler

- Next.js (App Router) + TypeScript
- Tailwind CSS
- **Supabase (PostgreSQL)** + Prisma ORM
- **Supabase Storage** (bildirim fotoğrafları)
- `qrcode` ile QR kod üretimi
- `lucide-react` ikonlar
- `bcryptjs` ile şifre hashleme

> Not: Proje ilk sürümde yerel SQLite ile geliştirildi. Vercel gibi serverless platformlarda dosya sistemi kalıcı olmadığı için (her istek farklı/geçici bir ortamda çalışabilir) veritabanı **Supabase PostgreSQL**'e, fotoğraf depolama da **Supabase Storage**'a taşındı.

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Supabase projenizden bağlantı bilgilerini alın

Aşağıdaki adımları [supabase.com](https://supabase.com) üzerinde oluşturduğunuz proje için uygulayın.

#### A) Veritabanı bağlantı dizeleri (`DATABASE_URL`, `DIRECT_URL`)

1. Supabase projenizi açın → sol menüden **Project Settings** (dişli ikonu) → **Database**.
2. **Connection string** bölümüne gelin.
3. **"Transaction" / "Connection pooling"** sekmesini seçin (port **6543**, `pgbouncer=true` içerir) → bu URL'yi kopyalayıp `DATABASE_URL` olarak kullanın. Uygulamanın normal çalışması (serverless ortamda çok sayıda eşzamanlı bağlantı) için bu havuzlanmış bağlantı gerekir.
4. **"Direct connection"** sekmesini seçin (port **5432**) → bu URL'yi `DIRECT_URL` olarak kullanın. Bu, sadece `prisma db push` / şema değişikliklerinde kullanılır.
5. Her iki URL'de de `[YOUR-PASSWORD]` kısmını, projeyi oluştururken belirlediğiniz veritabanı şifresiyle değiştirin (şifrenizi hatırlamıyorsanız aynı sayfadan "Reset database password" ile yenileyebilirsiniz).

#### B) Storage bilgileri (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)

1. **Project Settings → API** sayfasına gidin.
2. **Project URL** değerini kopyalayıp `SUPABASE_URL` olarak kullanın.
3. **Project API keys** altında **`service_role`** anahtarını kopyalayıp `SUPABASE_SERVICE_ROLE_KEY` olarak kullanın.
   ⚠️ Bu anahtar tüm Storage/Database kısıtlamalarını (RLS) atlayabilir — **asla** tarayıcıya/istemciye göndermeyin, `NEXT_PUBLIC_` ön eki koymayın, GitHub'a yüklemeyin. Sadece sunucu tarafında (API route'larda) ve Vercel/yerel `.env` ortam değişkeni olarak kullanılır.

#### C) Storage bucket'ı oluşturun

1. Supabase projenizde sol menüden **Storage**'a gidin.
2. **New bucket** → isim: `report-photos` (**tam olarak bu isim**, kod bunu referans alıyor) → **Public bucket** seçeneğini **kapalı** bırakın (private).
3. Herhangi bir Access Policy eklemenize gerek yok: fotoğraflara erişim `service_role` anahtarıyla backend üzerinden yapılıyor ve kodumuzdaki `/api/admin/photos/[dosya]` uç noktası isteği sadece oturum açmış yöneticilere izin veriyor.

### 3. Ortam değişkenlerini ayarlayın

`.env.example` dosyasını kopyalayıp gerçek değerlerle doldurun:

```bash
cp .env.example .env
```

| Değişken | Nereden alınır | Açıklama |
| --- | --- | --- |
| `DATABASE_URL` | Database → Connection string → **Transaction** (port 6543) | Uygulamanın kullandığı havuzlanmış bağlantı |
| `DIRECT_URL` | Database → Connection string → **Direct connection** (port 5432) | Sadece şema senkronizasyonunda (`prisma db push`) kullanılır |
| `SUPABASE_URL` | Project Settings → API → Project URL | Storage istemcisi için proje adresi |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` anahtarı | **Gizli.** Sadece sunucu tarafında kullanılır |
| `NEXT_PUBLIC_SITE_URL` | — | Ana sayfadaki QR kodun yönlendirdiği adres (aşağıya bakın) |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | — | İlk kurulumda (`db:seed`) oluşturulacak demo yönetici hesabı |

`.env` dosyası `.gitignore` ile Git'ten hariç tutulur — gerçek şifre/anahtarlarınız asla GitHub'a gönderilmez. Sadece placeholder değerler içeren `.env.example` deponda görünür.

### 4. Veritabanı şemasını Supabase'e uygulayın ve demo yönetici hesabını oluşturun

```bash
npm run db:push
npm run db:seed
```

- `db:push` komutu `prisma/schema.prisma`'daki tabloları (Report, Admin, Session) Supabase veritabanınızda oluşturur.
- `db:seed` komutu `ADMIN_USERNAME` / `ADMIN_PASSWORD` ile **şifresi bcrypt ile hashlenmiş** bir yönetici hesabı oluşturur. Şifreyi değiştirip tekrar çalıştırırsanız mevcut hesabın şifresi güncellenir.

> Demo kurulum bilgileri: **kullanıcı adı `admin`, şifre `admin123`**. Sunumdan önce `.env`'deki `ADMIN_PASSWORD` değerini değiştirip `npm run db:seed` komutunu tekrar çalıştırarak şifreyi değiştirebilirsiniz.

### 5. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Vercel'e Deploy Etme

1. GitHub reponuzu Vercel'de "Add New Project" ekranından içeri aktarın (Framework otomatik olarak Next.js algılanır, ek ayara gerek yoktur).
2. **Environment Variables** ekranında yukarıdaki tabloyla **aynı** değişkenleri, gerçek Supabase değerlerinizle doldurun:

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | Supabase Transaction pooler bağlantı dizesi (port 6543) |
   | `DIRECT_URL` | Supabase Direct connection bağlantı dizesi (port 5432) |
   | `SUPABASE_URL` | Supabase Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` anahtarı |
   | `NEXT_PUBLIC_SITE_URL` | Vercel'in vereceği/vermiş olduğu alan adı, örn. `https://ramak-kala.vercel.app` |
   | `ADMIN_USERNAME` | Yönetici kullanıcı adınız |
   | `ADMIN_PASSWORD` | Yönetici şifreniz |

   Hepsini **Production**, **Preview** ve **Development** ortamlarının tümü için eklemeniz önerilir.
3. **Deploy** edin. Build sırasında `postinstall` script'i otomatik olarak `prisma generate` çalıştırır.
4. Veritabanı tabloları ve demo yönetici hesabı Vercel build'i sırasında **otomatik oluşturulmaz** — bunu bir kere, kendi bilgisayarınızdan, `.env` dosyanıza yukarıdaki Vercel'e girdiğiniz **aynı** Supabase değerlerini yazıp şu komutlarla yapmanız gerekir:
   ```bash
   npm run db:push
   npm run db:seed
   ```
5. Deploy tamamlandığında Vercel adresinizi `NEXT_PUBLIC_SITE_URL` değişkenine girip (adım 2) yeniden deploy edin ki ana sayfadaki QR kod doğru adrese yönlensin.
6. `https://<projeniz>.vercel.app/admin/login` üzerinden `ADMIN_USERNAME` / `ADMIN_PASSWORD` ile giriş yapabilirsiniz. Oturumlar artık gerçek bir Postgres veritabanında tutulduğu için Vercel'in serverless fonksiyonları arasında sorunsuz çalışır.

## Telefonla Test Etme (QR Kod)

**Yerelde test:**
1. Bilgisayarınızın yerel ağ IP adresini öğrenin (macOS: `ipconfig getifaddr en0`).
2. `.env` dosyasında `NEXT_PUBLIC_SITE_URL` değerini bu IP ile güncelleyin: `http://192.168.1.101:3000`
3. `npm run dev`'i yeniden başlatın, ana sayfayı yenileyin. Telefon ve bilgisayar aynı Wi-Fi ağında olmalı.

**Vercel'de test:** `NEXT_PUBLIC_SITE_URL`'i Vercel alan adınız olarak ayarlamanız yeterli (yukarıdaki Deploy bölümüne bakın) — telefon artık herhangi bir ağdan QR kodu okutabilir.

Ana sayfada QR kodun altındaki **"QR Kodu İndir"** butonuyla kodu PNG olarak indirip yazdırabilir veya paylaşabilirsiniz.

## Kullanım

- **`/`** — Tanıtım sayfası ve QR kod.
- **`/bildir`** — Giriş gerektirmeyen bildirim formu (iş yeri, konu, bildirim türü, açıklama, isteğe bağlı fotoğraf).
- **`/admin/login`** — Yönetici girişi.
- **`/admin`** — İstatistik kartları ve bildirim tablosu (oturum korumalı).
- **`/admin/bildirimler/[id]`** — Bildirim detayı, fotoğraf görüntüleme ve durum güncelleme (oturum korumalı).

Bildirim durumları: **Bekliyor → İnceleniyor → Sorun Çözüldü**. Yeni bildirimler varsayılan olarak "Bekliyor" durumunda oluşturulur ve değişiklikler Supabase (PostgreSQL) veritabanına kaydedilir.

## Güvenlik Notları

- Şifreler veritabanında düz metin olarak değil, `bcryptjs` ile hashlenmiş şekilde saklanır.
- Yönetici oturumları veritabanındaki `Session` tablosunda tutulan rastgele token'lar ile `httpOnly`, `secure` (prod'da) çerez üzerinden yönetilir.
- Yüklenen fotoğraflar Supabase Storage'daki **private** `report-photos` bucket'ında saklanır. Herkese açık (public) URL'leri yoktur; sadece sunucu tarafında `service_role` anahtarıyla, `/api/admin/photos/[dosya]` uç noktası üzerinden ve **yalnızca oturum açmış yöneticiler** tarafından indirilebilir.
- `SUPABASE_SERVICE_ROLE_KEY` istemciye asla gönderilmez; sadece sunucu/Vercel ortam değişkeni olarak tutulur.
- Fotoğraf yüklemede dosya türü (JPG/PNG/WEBP) ve boyut (en fazla 5 MB) kontrolü yapılır.
- Tüm yönetici sayfaları ve API işlemleri sunucu tarafında oturum kontrolünden geçer.

## Faydalı Komutlar

```bash
npm run dev        # Geliştirme sunucusu
npm run build      # Prodüksiyon derlemesi
npm run start      # Derlenmiş uygulamayı çalıştırır
npm run db:push    # Prisma şemasını Supabase veritabanına uygular
npm run db:seed    # Demo yönetici hesabını oluşturur/günceller
npx prisma studio  # Veritabanını tarayıcıda görüntülemek için (isteğe bağlı)
```
