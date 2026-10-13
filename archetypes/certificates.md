---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
issuer: ""            # penerbit sertifikat
date: {{ .Date }}     # tanggal terbit; ubah sesuai sertifikat
image: ""             # opsional, mis. "images/sertifikat/nama.jpg" (taruh di static/images/sertifikat/)
link: ""              # opsional, tautan kredensial
---
