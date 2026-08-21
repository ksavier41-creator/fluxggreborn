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
- P0: Discord OAuth — uzupełnić DISCORD_CLIENT_ID/SECRET (redirect: /auth/discord/callback); statystyki na żywo z FiveM (użytkownik: "potem podepniemy").
- P1: Zapis podań do bazy, panel admina do podań, edycja regulaminu z poziomu admina.
- P2: Blog/aktualności, changelog, i18n (PL/EN).

## Zmiany (2026-08-21, iteracja 2)
- Usunięto: custom cursor, marquee, całą sekcję/stronę Płatności (+ kategoria Płatności w regulaminie, historia zakupów w profilu).
- Navbar: dodano PODANIA i WERYFIKACJĘ do głównego menu.
- Backend włączony: prawdziwe logowanie Steam OpenID (aktywne, klucz API w env) + Discord OAuth (kod gotowy, czeka na Client ID/Secret), JWT, linkowanie kont, DELETE unlink.
- Frontend: AuthContext na prawdziwej sesji (GET /api/auth/me), strony callback /auth/discord/callback i /auth/steam/callback, konto demo jako podgląd.

## Następne kroki
1. Użytkownik podaje Discord Client ID + Secret → wpisać do backend/.env, zrestartować backend.
2. Przetestować pełny flow Steam w przeglądarce (wymaga konta Steam).
3. FiveM stats po otrzymaniu kodu serwera cfx.re.
