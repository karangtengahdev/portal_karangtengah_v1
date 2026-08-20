#!/usr/bin/env python3
# Fix Swagger 401: samakan @ApiBearerAuth() -> @ApiBearerAuth('access-token')
# supaya cocok dgn scheme bernama 'access-token' di main.ts.
# Jalankan di folder nawasena-api: python3 fix_swagger_auth.py
import os, re

# cari semua controller CMS yang pakai @ApiBearerAuth tanpa argumen
targets = []
for root, _, files in os.walk('src/modules'):
    for f in files:
        if f.endswith('.ts'):
            targets.append(os.path.join(root, f))

fixed = 0
for path in targets:
    s = open(path).read()
    if '@ApiBearerAuth()' in s:
        s2 = s.replace("@ApiBearerAuth()", "@ApiBearerAuth('access-token')")
        open(path, 'w').write(s2)
        n = s.count('@ApiBearerAuth()')
        fixed += n
        print(f"  ~ {path} ({n}x)")

if fixed == 0:
    print("  Tidak ada @ApiBearerAuth() polos ditemukan (mungkin sudah benar semua).")
else:
    print(f"\nOK {fixed} @ApiBearerAuth diperbaiki -> 'access-token'")

# verifikasi konsistensi: cek main.ts pakai nama 'access-token'
main = open('src/main.ts').read()
if "'access-token'" in main and "addBearerAuth" in main:
    print("OK main.ts: scheme 'access-token' terdaftar - cocok.")
else:
    print("!! cek main.ts: pastikan addBearerAuth pakai nama 'access-token'")

print("\nRestart server, refresh /docs, klik Authorize, masukkan token (TANPA kata Bearer).")
print("Lalu tes endpoint cms -> curl harusnya ada header Authorization.")
