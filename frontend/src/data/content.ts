export interface RuleItem {
    title: string;
    content: string;
}

export interface RuleCategory {
    id: string;
    title: string;
    rules: RuleItem[];
}

export const ruleCategories: RuleCategory[] = [
    {
        id: "ogolne",
        title: "Postanowienia ogólne",
        rules: [
            {
                title: "1.1 Wiek i konto",
                content: "Na serwerze obowiązuje limit wieku 16+. Każdy gracz odpowiada za swoje konto — udostępnianie konta nie zwalnia z odpowiedzialności za popełnione na nim wykroczenia.",
            },
            {
                title: "1.2 Znajomość regulaminu",
                content: "Nieznajomość regulaminu nie zwalnia z jego przestrzegania. Regulamin może ulec zmianie — o istotnych zmianach informujemy na Discordzie.",
            },
            {
                title: "1.3 Nazwy postaci",
                content: "Imię i nazwisko postaci musi być realistyczne i nie może zawierać wulgaryzmów, nazw znanych osób ani treści obraźliwych.",
            },
        ],
    },
    {
        id: "roleplay",
        title: "Zasady Roleplay",
        rules: [
            {
                title: "2.1 Value of Life",
                content: "Twoja postać ceni swoje życie. Przy groźbie bronią lub przewadze liczebnej stosuj się do poleceń i odgrywaj strach.",
            },
            {
                title: "2.2 RDM / VDM",
                content: "Zabójstwo bez uzasadnienia fabularnego (RDM) oraz celowe rozbijanie pojazdów w celu zabicia (VDM) są surowo zabronione.",
            },
            {
                title: "2.3 Metagaming i Powergaming",
                content: "Zakaz wykorzystywania informacji spoza gry (Discord, streamy) w rozgrywce oraz wymuszania akcji niemożliwych do wykonania w realnym świecie.",
            },
            {
                title: "2.4 New Life Rule",
                content: "Po śmierci postaci zapominasz okoliczności swojej śmierci i nie wracasz w miejsce zdarzenia przez 30 minut.",
            },
            {
                title: "2.5 Fail RP i Combat Logging",
                content: "Zakaz łamania immersji oraz wychodzenia z gry w trakcie akcji RP, pościgu lub aresztowania.",
            },
        ],
    },
    {
        id: "serwer",
        title: "Zasady serwera",
        rules: [
            {
                title: "3.1 Cheat i modyfikacje",
                content: "Jakiekolwiek modyfikacje dające przewagę (aimbot, ESP, noclip) skutkują natychmiastową, trwałą blokadą konta.",
            },
            {
                title: "3.2 Wykorzystywanie błędów",
                content: "Bugi i exploity należy zgłaszać administracji. Ich wykorzystywanie traktowane jest jak cheatowanie.",
            },
            {
                title: "3.3 Streamsniping",
                content: "Śledzenie streamerów w grze na podstawie ich transmisji jest zabronione i karane banem.",
            },
        ],
    },
    {
        id: "administracja",
        title: "Zasady administracji",
        rules: [
            {
                title: "4.1 Decyzje administracji",
                content: "Decyzje administracji podejmowane w trakcie akcji RP są ostateczne. Odwołanie można złożyć wyłącznie poprzez ticket na Discordzie.",
            },
            {
                title: "4.2 Kanał pomocy",
                content: "Sprawy administracyjne załatwiamy przez system ticketów. Wołanie administratorów w grze w sprawach niepilnych jest niedozwolone.",
            },
            {
                title: "4.3 Udowadnianie",
                content: "W sporach decydują nagrania. Zalecamy nagrywanie rozgrywki — brak materiału może skutkować odrzuceniem zgłoszenia.",
            },
        ],
    },
    {
        id: "kary",
        title: "Kary",
        rules: [
            {
                title: "5.1 Rodzaje kar",
                content: "Stosujemy ostrzeżenia, wyrzucenie z serwera (kick), blokady czasowe (1h–30 dni) oraz blokady trwałe. Powtarzające się wykroczenia skutkują eskalacją kary.",
            },
            {
                title: "5.2 Odwołania",
                content: "Od kary można odwołać się w ciągu 7 dni poprzez ticket. Odwołanie bez dowodów zostanie automatycznie odrzucone.",
            },
        ],
    },
    {
        id: "discord",
        title: "Discord",
        rules: [
            {
                title: "6.1 Kultura wypowiedzi",
                content: "Na Discordzie obowiązuje zakaz wyzwisk, spamu, treści NSFW oraz reklam innych serwerów. Kanały tematyczne służą wyłącznie swoim celom.",
            },
            {
                title: "6.2 Weryfikacja",
                content: "Dostęp do pełnej społeczności wymaga połączenia konta Discord i Steam z profilem na stronie FluxGG Reborn.",
            },
        ],
    },
];

export interface ApplicationType {
    id: string;
    name: string;
    description: string;
    status: "open" | "soon";
    note: string;
}

export const applicationTypes: ApplicationType[] = [
    {
        id: "whitelist",
        name: "Podanie na whitelistę",
        description: "Dołącz do miasta jako pełnoprawny mieszkaniec. Opowiedz nam o swojej postaci i doświadczeniu w RP.",
        status: "open",
        note: "Rekrutacja ciągła",
    },
    {
        id: "administracja",
        name: "Podanie do administracji",
        description: "Szukamy osób do ekipy supportu i moderacji. Wymagane doświadczenie i nienaganna historia konta.",
        status: "soon",
        note: "Nabór wkrótce",
    },
    {
        id: "biznes",
        name: "Podanie na biznes",
        description: "Masz pomysł na własny lokal? Opisz koncepcję i dołącz do gospodarki miasta.",
        status: "open",
        note: "Wymagana koncepcja",
    },
    {
        id: "ekipa",
        name: "Podanie na ekipę",
        description: "Zarejestruj swoją grupę jako oficjalną ekipę serwera i zyskaj dostęp do systemów organizacji.",
        status: "soon",
        note: "Nabór wkrótce",
    },
];

export interface Stat {
    label: string;
    value: number;
    suffix: string;
}

export const stats: Stat[] = [
    { label: "GRACZE", value: 1240, suffix: "+" },
    { label: "AKTYWNYCH CZŁONKÓW", value: 3800, suffix: "+" },
    { label: "GODZIN ROZGRYWKI", value: 96000, suffix: "+" },
    { label: "EVENTÓW", value: 250, suffix: "+" },
];

export const DISCORD_URL = "https://discord.gg/SKQ9Qeps38";
export const FIVEM_CONNECT_URL = "fivem://connect/play.fluxgg.gg";

export interface ApplicationQuestion {
    key: string;
    label: string;
    textarea: boolean;
}

export const applicationQuestions: Record<string, ApplicationQuestion[]> = {
    whitelist: [
        { key: "wiek", label: "Wiek", textarea: false },
        { key: "doswiadczenie_rp", label: "Doświadczenie w RP", textarea: false },
        { key: "historia_postaci", label: "Historia postaci", textarea: true },
        { key: "co_odgrywasz", label: "Co będziesz odgrywał?", textarea: true },
        {
            key: "kartel",
            label: "Dostajesz informację, że Twoja postać jest poszukiwana przez groźny kartel. Jakie czynności wykonasz, aby Cię nie złapali?",
            textarea: true,
        },
        {
            key: "rozwoj_crime",
            label: "Opisz, w jaki sposób powinien przebiegać rozwój postaci crime na serwerach Hard RP",
            textarea: true,
        },
        {
            key: "sabotaz",
            label: "Ktoś sabotuje Twój biznes, ale nie wiesz kto. Jak chcesz temu zapobiec i co robisz, żeby dowiedzieć się, kto to robi?",
            textarea: true,
        },
    ],
    ekipa: [
        { key: "nazwa_ekipy", label: "Nazwa ekipy", textarea: false },
        { key: "typ_ekipy", label: "Typ ekipy (gang/organizacja)", textarea: false },
        { key: "ilosc_osob", label: "Ile masz osób do ekipy?", textarea: false },
        { key: "wklad", label: "Co Twoja ekipa wniesie do rozgrywki?", textarea: true },
        { key: "watki", label: "Jak Twoja ekipa będzie rozwijała wątki?", textarea: true },
        { key: "historia_ekipy", label: "Historia ekipy", textarea: true },
    ],
    biznes: [
        { key: "nazwa_firmy", label: "Nazwa firmy", textarea: false },
        { key: "typ_firmy", label: "Typ firmy", textarea: false },
        { key: "pracownicy", label: "Ilość pewnych pracowników od powstania firmy", textarea: false },
        { key: "plan_biznesowy", label: "Plan biznesowy", textarea: true },
        { key: "wklad_firmy", label: "Co Twoja firma wniesie na serwer?", textarea: true },
    ],
    administracja: [
        { key: "wiek", label: "Wiek", textarea: false },
        { key: "doswiadczenie_admin", label: "Doświadczenie w administracji", textarea: true },
        {
            key: "awantura",
            label: "Co zrobisz, gdy gracz awanturuje się na kanale pomocy?",
            textarea: true,
        },
        {
            key: "rdm",
            label: "Co zrobisz, gdy podczas spectowania graczy spotkasz gracza, który losowo strzela do ludzi?",
            textarea: true,
        },
        {
            key: "metagaming",
            label: "Słyszysz podczas rozmowy z graczem przez jego mikrofon rozmowy na Discordzie. Co robisz?",
            textarea: true,
        },
    ],
};

export const questionLabels: Record<string, string> = Object.fromEntries(
    Object.values(applicationQuestions)
        .flat()
        .map((q) => [q.key, q.label]),
);
