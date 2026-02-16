# 📚 AttendMe – QR Attendance System (Vue 3 + TypeScript)

Aplikacja typu **Single Page Application (SPA)** do elektronicznego sprawdzania obecności studentów przy użyciu dynamicznych kodów QR.

Projekt został zrealizowany w ramach przedmiotu **Frameworki front-endowe** z wykorzystaniem **Vue 3 (Composition API) oraz TypeScript**.

---

## 🚀 Opis projektu

AttendMe umożliwia szybkie, bezpieczne i zautomatyzowane rejestrowanie obecności na zajęciach.

### Jak działa system?

1. 👨‍🎓 Student generuje dynamiczny kod QR (odświeżany co 2 sekundy).
2. 👨‍🏫 Wykładowca skanuje kod za pomocą kamery.
3. 🔐 Backend weryfikuje token oraz przypisuje obecność do odpowiednich zajęć.
4. ✅ Student otrzymuje informację zwrotną o poprawnym zarejestrowaniu obecności.

Aplikacja wykorzystuje autentykację tokenową **JWT** oraz rozróżnia role użytkowników:
- Student
- Wykładowca

---

## 🧑‍🏫 Funkcjonalności – Wykładowca

- 🔐 Logowanie do systemu
- 📋 Pulpit z listą prowadzonych zajęć
- 🔎 Filtrowanie zajęć (dziś, jutro, następny tydzień, minione, wszystkie)
- 📄 Ekran szczegółów zajęć:
  - Nazwa przedmiotu
  - Grupa
  - Termin
  - Lista obecności (imię, nazwisko, nr indeksu, status)
- 📷 Ekran skanowania kodów QR
- 🔄 Automatyczne odświeżanie listy obecności
- 🔗 Generowanie linku do ekranu skanowania

---

## 👨‍🎓 Funkcjonalności – Student

- 🔐 Logowanie do systemu
- 📱 Rejestracja urządzenia (aktywacja przez link)
- 📋 Pulpit z listą zajęć
- 🔎 Filtrowanie zajęć (zakres czasu, wyszukiwanie tekstowe)
- 📄 Ekran szczegółów zajęć:
  - Informacja o obecności
  - Historia obecności
  - Frekwencja całkowita
  - % zaawansowania kursu
- 📷 Generowanie dynamicznego kodu QR do rejestracji obecności
- 🔄 Cykliczne pobieranie nowego ticketu (co 2 sekundy)

---

## 🔐 Autentykacja

W aplikacji zastosowano autentykację tokenową **JWT**.

- Po zalogowaniu użytkownik otrzymuje token zapisywany w `sessionStorage`
- Student po rejestracji urządzenia otrzymuje dodatkowy token zapisywany w `localStorage`
- Tokeny są automatycznie dołączane do żądań HTTP

---

## 🌐 Backend

Aplikacja komunikuje się z backendem REST API:
https://attendme-backend.runasp.net/

## 🛠️ Technologie

- Vue 3
- Composition API
- TypeScript
- Vue Router
- Vite
- JWT Authentication
- REST API
- OpenAPI / NSwag
- Biblioteki do generowania i skanowania QR

---

## 📦 Instalacja i uruchomienie

### 1️⃣ Instalacja zależności
```bash
npm install

