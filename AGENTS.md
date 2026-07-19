# Software Requirement Specification (SRS)

# PREECARE Web
### AI-Based Preeeclampsia Screening Information System

**Version:** 1.0  
**Framework:** Next.js 15 + TypeScript + Tailwind CSS

---

# Revision History

| Version | Date | Author | Description |
|----------|------|--------|-------------|
| 1.0 | 2026 | PREECARE Team | Initial SRS |

# Table of Contents

1. Introduction
2. Overall Description
3. User Roles
4. System Architecture
5. Functional Requirements
6. Non-Functional Requirements
7. User Interface Requirements
8. Database Design
9. AI Prediction Flow
10. Future Development

---

# 1. Introduction

## 1.1 Purpose

PREECARE Web adalah sistem informasi kesehatan berbasis web yang mengintegrasikan alat skrining preeklamsia, Artificial Intelligence (AI), tenaga kesehatan, dan rumah sakit untuk mendukung deteksi dini, monitoring ibu hamil, serta proses rujukan pasien.

## 1.2 Scope

- Menerima data otomatis dari alat PREECARE
- Menerima data faktor risiko dari LCD touchscreen
- Menjalankan AI Prediction
- Menyimpan histori pemeriksaan
- Dashboard pasien
- Dashboard tenaga kesehatan
- Dashboard rumah sakit
- Monitoring kehamilan ±8 bulan
- Sistem rujukan lintas fasilitas kesehatan

## 1.3 Definitions

| Istilah | Penjelasan |
|---------|------------|
| AI | Artificial Intelligence |
| Nakes | Tenaga Kesehatan |
| Screening | Pemeriksaan awal |
| Referral | Rujukan ke Rumah Sakit |

---

# 2. Overall Description

## Product Flow

```text
Pasien
   │
   ▼
Alat PREECARE
   │
 Internet
   │
   ▼
REST API
   │
   ▼
Next.js Backend
   │
   ▼
AI Prediction
   │
   ▼
PostgreSQL
   │
   ▼
Dashboard
```

---

# 3. User Roles

## Pasien

- Login
- Melihat hasil skrining
- Melihat histori
- Grafik tekanan darah
- Grafik protein urin
- Status rujukan

## Nakes Puskesmas

- Registrasi pasien
- Screening
- Monitoring
- Melihat AI
- Mengirim rujukan

## Dokter Rumah Sakit

- Melihat pasien rujukan
- Histori pasien
- Diagnosis lanjutan

## Administrator

- Kelola user
- Kelola fasilitas kesehatan
- Kelola database
- Kelola AI

---

# 4. System Architecture

```text
+---------------------+
| PREECARE Device     |
+----------+----------+
           |
        Internet
           |
+----------v----------+
| REST API (Next.js)  |
+----------+----------+
           |
+----------v----------+
| AI Prediction       |
+----------+----------+
           |
+----------v----------+
| PostgreSQL          |
+----------+----------+
           |
+----------v----------+
| Web Dashboard       |
+---------------------+
```

---

# 5. Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-01 | Login berdasarkan role |
| FR-02 | Registrasi pasien |
| FR-03 | Sinkronisasi data alat otomatis |
| FR-04 | Input faktor risiko melalui LCD |
| FR-05 | AI Prediction (Low, Medium, High Risk) |
| FR-06 | Dashboard Puskesmas |
| FR-07 | Dashboard Pasien |
| FR-08 | Historical data & grafik |
| FR-09 | Rujukan otomatis ke Rumah Sakit |
| FR-10 | Dashboard Rumah Sakit |
| FR-11 | Notifikasi email |

### Faktor Risiko yang Diinput pada LCD

- Riwayat preeklamsia
- Diabetes
- Hipertensi
- Riwayat keluarga
- Kehamilan pertama
- Usia kehamilan

---

# 6. Non-Functional Requirements

## Performance

- AI < 3 detik
- Dashboard < 2 detik
- Upload data < 5 detik

## Security

- HTTPS
- JWT Authentication
- Password Hashing
- RBAC

## Compatibility

- Desktop
- Tablet
- Mobile
- Chrome
- Edge
- Firefox
- Safari

---

# 7. User Interface Requirements

## Design Theme

Healthcare Theme

### Color Palette

| Element | Color |
|----------|-------|
| Primary | #0EA5E9 |
| Secondary | #10B981 |
| Background | #F8FAFC |

### Style

- Clean
- Minimalis
- Professional
- Card Layout
- Rounded Corner
- Soft Shadow

---

# 8. Database Design

## Patient

```text
patient_id
nik
nama
tanggal_lahir
usia_kehamilan
alamat
```

## Screening

```text
screening_id
patient_id
systolic
diastolic
protein_urin
ai_result
confidence
created_at
```

## RiskFactor

```text
diabetes
riwayat_preeklamsia
riwayat_keluarga
hipertensi
kehamilan_pertama
```

## Referral

```text
referral_id
patient_id
asal_puskesmas
tujuan_rs
status
```

---

# 9. AI Prediction Flow

```text
Tekanan Darah
      │
Protein Urin
      │
Risk Factor
      │
AI Prediction
      │
Risk Classification
      │
Dashboard
      │
Referral
```

---

# 10. Future Development

- Integrasi SATUSEHAT
- Telemedicine
- WhatsApp Notification
- Mobile App
- AI Explainability
- Multi-Puskesmas Dashboard

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 15 |
| Backend | Next.js API |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth |
| AI | Python FastAPI |
| Charts | Recharts |
| Deployment | Vercel + Railway |
