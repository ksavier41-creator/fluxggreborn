# PRD — FluxGG Reborn (portal serwera FiveM GTA V RP)

## Oryginalne zlecenie
Nowoczesna, minimalistyczna, premium strona dla serwera FiveM RP "FluxGG Reborn". Strickt monochromatyczna (czerń / ciemnoszary / biel, cały tekst biały, zero kolorowych akcentów), efekty 3D (subtelne bryły w tle, parallax), kinetic hero z masked line reveal, osobne podstrony z routerem, działające konto demo (MOCK bez OAuth), czysty frontend z mockowanymi danymi, stack: React + TypeScript + Tailwind + Framer Motion + Three.js/R3F + Lenis. Poziom Awwwards — motion, craft, wow-factor.

## Persony
- Gracz RP — chce szybko dołączyć (GRAJ TERAZ / Discord), przeczytać regulamin, złożyć podanie.
- Gracz premium — przegląda pakiety VIP i kupuje produkty.
- Członek społeczności — zarządza profilem, weryfikuje Steam/Discord, sprawdza historię zakupów.

## Architektura
- Pure frontend (backend FastAPI/MongoDB celowo nietknięty).
- React 19 + TypeScript 5 + CRA/craco, Tailwind, framer-motion, lenis, three + @react-three/fiber v9, sonner, lucide-react.
- Routing: react-router-dom 7 — /, /platnosci, /regulamin, /profil, /o-nas, /weryfikacja, /podania.
- Mock auth: src/auth/AuthContext.tsx (localStorage `fluxgg-demo-auth-v1`, granica wymienna na OAuth provider).
- Dane mockowe: src/data/content.ts (produkty, regulamin, podania, statystyki, URL-e).
- Komponenty: Navbar, Footer, HeroScene (R3F), CustomCursor, PageLoader, Marquee, Reveal, TiltCard, Counter, LoginModal, SectionHeading.

## Zaimplementowane (2026-08-21)
- Konwersja szablonu JS → TypeScript (tsconfig, alias @/, usunięcie jsconfig).
- Kinetic hero: masked line-by-line reveal "FLUXGG / REBORN" (outline stroke), 3D torus knot + bryły (R3F, parallax myszy, wyłączone na mobile), vignette + noise overlay.
- Page loader z licznikiem %, Lenis smooth scroll, custom cursor (mix-blend-difference), slow editorial marquee, numerowany manifest (01–04), animowane liczniki statystyk.
- Płatności: 6 kart produktów, 3D tilt + glow na hover, KUP TERAZ → toast (MOCK płatności).
- Regulamin: 7 kategorii, custom accordion, wyszukiwarka na żywo.
- Profil: konto demo (login przez modal), avatar-inicjały, Discord/Steam ID, odznaki ZWERYFIKOWANY, rangi, historia zakupów, wylogowanie.
- Weryfikacja: karty Steam/Discord, stany Niepołączono/Weryfikowanie/Zweryfikowano (symulacja MOCK, persystencja).
- Podania: 5 typów kart, statusy OTWARTE/WKRÓTCE, modal z formularzem (wysyłka MOCK → toast).
- O nas: teksty + panel statystyk z licznikami.
- Responsywność: hamburger menu, full-screen overlay mobilny, karty w jednej kolumnie.
- data-testid na wszystkich interaktywnych elementach.

## Weryfikacja
Screenshoty e2e: home (hero + scroll), płatności (+toast), regulamin (search filtruje), login demo → profil, weryfikacja (pending→verified), podania (modal), mobile (burger + menu). Wszystkie przeszły.

## Backlog
- P0: Statystyki na żywo z FiveM (użytkownik: "potem podepniemy").
- P1: Zapis podań do bazy, panel admina do podań, edycja regulaminu z poziomu admina.
- P2: Blog/aktualności, changelog, i18n (PL/EN).

## Zmiany (2026-08-21, iteracja 2)
- Usunięto: custom cursor, marquee, całą sekcję/stronę Płatności (+ kategoria Płatności w regulaminie, historia zakupów w profilu).
- Navbar: dodano PODANIA i WERYFIKACJĘ do głównego menu.
- Backend włączony: prawdziwe logowanie Steam OpenID (aktywne, klucz API w env) + Discord OAuth (kod gotowy, czeka na Client ID/Secret), JWT, linkowanie kont, DELETE unlink.
- Frontend: AuthContext na prawdziwej sesji (GET /api/auth/me), strony callback /auth/discord/callback i /auth/steam/callback, konto demo jako podgląd.

## Zmiany (2026-08-21, iteracja 3)
- Discord OAuth aktywowany (klucze w env), flow zweryfikowany do strony Discorda.
- Podania zapisują się do MongoDB (POST /api/applications, wymagany JWT), profil pokazuje "Moje podania" ze statusem, admin ma GET /api/admin/applications z kluczem x-admin-key.
- Link Discord podmieniony na https://discord.gg/SKQ9Qeps38. Link FiveM (GRAJ TERAZ) nadal placeholder.

## Zmiany (2026-08-21, iteracja 4)
- Panel admina /admin: lista podań z PRZYJMIJ/ODRZUĆ (PATCH statusu), zarządzanie administratorami po Discord ID (dodaj/usuń), bootstrap pierwszego admina kluczem, link ADMIN w navbarze dla adminów, is_admin w profilu użytkownika.
- Admin = zalogowany użytkownik z Discord ID w kolekcji admins (seed przez ADMIN_DISCORD_IDS lub bootstrap kluczem).

## Zmiany (2026-08-21, iteracja 5)
- Webhook Discord podłączony: nowe podanie na whitelistę wysyła embed na kanał administracji; inne typy podań nie powiadamiają (na prośbę użytkownika). Zweryfikowane: 204 od Discorda przy whitelist, brak wywołania przy biznes.

## Zmiany (2026-08-21, iteracja 6)
- Podanie na whitelistę ma własne pytania: imię i nazwisko postaci (IC), wiek (OOC), opis postaci, scenariusz RP (impreza prasowej firmy). Odpowiedzi zapisują się w polu `answers` i wyświetlają w panelu admina. Inne typy podań zachowują ogólne pole motywacji.
- Webhook Discord: emoji w wiadomościach decyzji — ✅ Zatwierdzono / ❌ Odrzucone podanie na WL: <@id>.

## Zmiany (2026-08-21, iteracja 7)
- Panel admina: karta "NABORY PODAŃ" — włączanie/wyłączanie naboru per typ (toggle, zapis w Mongo `application_settings`, backend blokuje zgłoszenia zamkniętego typu, strona /podania czyta statusy na żywo), filtry kategorii nad listą podań.
- Fix UX: okno podania ma data-lenis-prevent + overscroll-contain — scroll działa wewnątrz modala, tło się nie przesuwa.

## Zmiany (2026-08-21, iteracja 8)
- Indywidualne zestawy pytań dla każdego typu podania (whitelist 7 pytań RP, ekipa 6, biznes 5, administracja 5) — definicje w content.ts (applicationQuestions), walidacja per typ na backendzie (QUESTION_KEYS), odpowiedzi w panelu admina z etykietami (questionLabels). Walidacja: min. 1 znak na odpowiedź (liczby jednocyfrowe OK).

## Zmiany (2026-08-21, iteracja 9)
- Podania wymagają połączonych OBU kont (Discord + Steam) — backend 403 przy braku któregoś, frontend pokazuje toast z przyciskiem do Weryfikacji.
- Pola Discord ID / Steam ID w formularzu zablokowane (readonly, ikona kłódki); backend i tak nadpisuje je wartościami z konta (anty-spoofing).

## Następne kroki
1. Przetestować pełny flow Steam/Discord w przeglądarce (wymaga kont użytkownika).
2. FiveM stats po otrzymaniu kodu serwera cfx.re + prawdziwy link fivem://connect.
3. Opcjonalnie: powiadomienia o podaniach na Discord webhook (potrzebny URL webhooka).
