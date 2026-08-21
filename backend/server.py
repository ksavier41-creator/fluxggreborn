from fastapi import FastAPI, APIRouter, HTTPException, Header, Body, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import logging
from pathlib import Path
from urllib.parse import urlencode
from datetime import datetime, timedelta, timezone
from typing import Optional, Annotated

import httpx
import jwt
from bson import ObjectId
from pydantic import BaseModel, BeforeValidator, ConfigDict, Field

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

DISCORD_CLIENT_ID = os.environ.get("DISCORD_CLIENT_ID", "")
DISCORD_CLIENT_SECRET = os.environ.get("DISCORD_CLIENT_SECRET", "")
STEAM_API_KEY = os.environ.get("STEAM_API_KEY", "")
JWT_SECRET = os.environ.get("JWT_SECRET", "")
PUBLIC_URL = os.environ.get("PUBLIC_URL", "").rstrip("/")
ADMIN_KEY = os.environ.get("ADMIN_KEY", "")
ADMIN_DISCORD_IDS = [x.strip() for x in os.environ.get("ADMIN_DISCORD_IDS", "").split(",") if x.strip()]

DISCORD_REDIRECT_URI = f"{PUBLIC_URL}/auth/discord/callback"
STEAM_RETURN_TO = f"{PUBLIC_URL}/auth/steam/callback"
STEAM_OPENID_ENDPOINT = "https://steamcommunity.com/openid/login"
STEAM_ID_RE = re.compile(r"^https://steamcommunity\.com/openid/id/(\d+)$")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_DAYS = 7
APPLICATION_TYPES = {"whitelist", "administracja", "biznes", "ekipa"}
APPLICATION_STATUSES = {"pending", "accepted", "rejected"}

PyObjectId = Annotated[str, BeforeValidator(str)]


class UserDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str
    avatar_url: Optional[str] = None
    discord_id: Optional[str] = None
    steam_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self) -> dict:
        doc = self.model_dump(by_alias=True, exclude={"id"})
        if self.id:
            doc["_id"] = ObjectId(self.id)
        return doc

    @classmethod
    def from_mongo(cls, doc: dict) -> "UserDocument":
        return cls(**doc)


class UserOut(BaseModel):
    id: str
    username: str
    avatar_url: Optional[str] = None
    discord_id: Optional[str] = None
    steam_id: Optional[str] = None
    created_at: str
    is_admin: bool = False


class AuthOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class DiscordExchangeIn(BaseModel):
    code: str


class ApplicationCreate(BaseModel):
    type: str = Field(min_length=2, max_length=40)
    nick: str = Field(min_length=2, max_length=60)
    discord: str = Field(min_length=2, max_length=60)
    steam_id: str = Field(min_length=2, max_length=40)
    motivation: str = Field(default="", max_length=2000)
    answers: Optional[dict[str, str]] = None


WHITELIST_QUESTION_KEYS = {"imie_ic", "wiek_ooc", "opis_postaci", "sytuacja"}

QUESTION_KEYS = {
    "whitelist": {"wiek", "doswiadczenie_rp", "historia_postaci", "co_odgrywasz", "kartel", "rozwoj_crime", "sabotaz"},
    "ekipa": {"nazwa_ekipy", "typ_ekipy", "ilosc_osob", "wklad", "watki", "historia_ekipy"},
    "biznes": {"nazwa_firmy", "typ_firmy", "pracownicy", "plan_biznesowy", "wklad_firmy"},
    "administracja": {"wiek", "doswiadczenie_admin", "awantura", "rdm", "metagaming"},
}


class ApplicationDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: Optional[str] = None
    username: str
    type: str
    nick: str
    discord: str
    steam_id: str
    motivation: str = ""
    answers: Optional[dict[str, str]] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self) -> dict:
        doc = self.model_dump(by_alias=True, exclude={"id"})
        if self.id:
            doc["_id"] = ObjectId(self.id)
        return doc

    @classmethod
    def from_mongo(cls, doc: dict) -> "ApplicationDocument":
        return cls(**doc)


class ApplicationOut(BaseModel):
    id: str
    username: str
    type: str
    nick: str
    discord: str
    steam_id: str
    motivation: str
    answers: Optional[dict[str, str]] = None
    status: str
    created_at: str


class ApplicationStatusIn(BaseModel):
    status: str


class AdminIn(BaseModel):
    discord_id: str = Field(min_length=5, max_length=30)


class AdminOut(BaseModel):
    discord_id: str
    added_at: str


app = FastAPI()
api_router = APIRouter(prefix="/api")


def iso(dt_value) -> str:
    if isinstance(dt_value, datetime):
        return dt_value.isoformat()
    return str(dt_value) if dt_value else datetime.now(timezone.utc).isoformat()


def to_user_out(doc: dict, is_admin: bool = False) -> UserOut:
    return UserOut(
        id=str(doc["_id"]),
        username=doc.get("username", "Gracz"),
        avatar_url=doc.get("avatar_url"),
        discord_id=doc.get("discord_id"),
        steam_id=doc.get("steam_id"),
        created_at=iso(doc.get("created_at")),
        is_admin=is_admin,
    )


def to_application_out(doc: dict) -> ApplicationOut:
    return ApplicationOut(
        id=str(doc["_id"]),
        username=doc.get("username", ""),
        type=doc.get("type", ""),
        nick=doc.get("nick", ""),
        discord=doc.get("discord", ""),
        steam_id=doc.get("steam_id", ""),
        motivation=doc.get("motivation", ""),
        answers=doc.get("answers"),
        status=doc.get("status", "pending"),
        created_at=iso(doc.get("created_at")),
    )


def to_admin_out(doc: dict) -> AdminOut:
    return AdminOut(
        discord_id=doc.get("discord_id", ""),
        added_at=iso(doc.get("added_at")),
    )


def jwt_for(user_id: str) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {"sub": user_id, "iat": now, "exp": now + timedelta(days=JWT_EXPIRE_DAYS)},
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


def bearer_user_id(authorization: Optional[str]) -> Optional[str]:
    if not authorization or not authorization.lower().startswith("bearer "):
        return None
    try:
        payload = jwt.decode(authorization[7:], JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return str(payload["sub"])
    except Exception:
        return None


async def is_admin_discord(discord_id: Optional[str]) -> bool:
    if not discord_id:
        return False
    return await db.admins.find_one({"discord_id": discord_id}) is not None


async def with_admin_flag(doc: dict) -> UserOut:
    return to_user_out(doc, is_admin=await is_admin_discord(doc.get("discord_id")))


def require_user_id(authorization: Optional[str]) -> str:
    uid = bearer_user_id(authorization)
    if not uid or not ObjectId.is_valid(uid):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wymagane zalogowanie")
    return uid


async def require_admin_user(authorization: Optional[str]) -> dict:
    uid = require_user_id(authorization)
    user_doc = await db.users.find_one({"_id": ObjectId(uid)})
    if not user_doc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Nie znaleziono użytkownika")
    if not await is_admin_discord(user_doc.get("discord_id")):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Brak uprawnień administratora")
    return user_doc


async def upsert_user(provider_field: str, provider_id: str, username: str, avatar_url: Optional[str], session_user_id: Optional[str]) -> dict:
    users = db.users
    if session_user_id and ObjectId.is_valid(session_user_id):
        current = await users.find_one({"_id": ObjectId(session_user_id)})
        if current:
            conflict = await users.find_one({provider_field: provider_id, "_id": {"$ne": current["_id"]}})
            if conflict:
                raise HTTPException(status.HTTP_409_CONFLICT, "To konto jest już połączone z innym użytkownikiem")
            await users.update_one(
                {"_id": current["_id"]},
                {"$set": {provider_field: provider_id, "avatar_url": avatar_url or current.get("avatar_url")}},
            )
            return await users.find_one({"_id": current["_id"]})
    existing = await users.find_one({provider_field: provider_id})
    if existing:
        await users.update_one(
            {"_id": existing["_id"]},
            {"$set": {"avatar_url": avatar_url or existing.get("avatar_url"), "username": existing.get("username") or username}},
        )
        return await users.find_one({"_id": existing["_id"]})
    doc = UserDocument(username=username, avatar_url=avatar_url, **{provider_field: provider_id})
    result = await users.insert_one(doc.to_mongo())
    return await users.find_one({"_id": result.inserted_id})


@api_router.get("/")
async def root():
    return {"message": "FluxGG Reborn API"}


@api_router.get("/auth/discord/start")
async def discord_start():
    if not DISCORD_CLIENT_ID or not DISCORD_CLIENT_SECRET:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Integracja Discord nie jest jeszcze skonfigurowana")
    params = urlencode({
        "client_id": DISCORD_CLIENT_ID,
        "redirect_uri": DISCORD_REDIRECT_URI,
        "response_type": "code",
        "scope": "identify",
    })
    return {"url": f"https://discord.com/oauth2/authorize?{params}"}


@api_router.post("/auth/discord/exchange", response_model=AuthOut)
async def discord_exchange(body: DiscordExchangeIn, authorization: Optional[str] = Header(default=None)):
    if not DISCORD_CLIENT_ID or not DISCORD_CLIENT_SECRET:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Integracja Discord nie jest jeszcze skonfigurowana")
    try:
        async with httpx.AsyncClient(timeout=10.0) as http:
            token_resp = await http.post(
                "https://discord.com/api/oauth2/token",
                data={
                    "client_id": DISCORD_CLIENT_ID,
                    "client_secret": DISCORD_CLIENT_SECRET,
                    "grant_type": "authorization_code",
                    "code": body.code,
                    "redirect_uri": DISCORD_REDIRECT_URI,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            if token_resp.status_code != 200:
                raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wymiana kodu Discord nie powiodła się")
            access_token = token_resp.json()["access_token"]
            me_resp = await http.get(
                "https://discord.com/api/users/@me",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            me_resp.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "Discord jest chwilowo niedostępny") from exc

    data = me_resp.json()
    discord_id = str(data["id"])
    avatar_url = (
        f"https://cdn.discordapp.com/avatars/{discord_id}/{data['avatar']}.png"
        if data.get("avatar")
        else None
    )
    username = data.get("global_name") or data.get("username") or "Gracz"

    user = await upsert_user("discord_id", discord_id, username, avatar_url, bearer_user_id(authorization))
    return AuthOut(access_token=jwt_for(str(user["_id"])), user=await with_admin_flag(user))


@api_router.get("/auth/steam/start")
async def steam_start():
    params = urlencode({
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": STEAM_RETURN_TO,
        "openid.realm": f"{PUBLIC_URL}/",
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
    })
    return {"url": f"{STEAM_OPENID_ENDPOINT}?{params}"}


async def verify_with_steam(params: dict) -> str:
    assertion = dict(params)
    assertion["openid.mode"] = "check_authentication"
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=False) as http:
            response = await http.post(
                STEAM_OPENID_ENDPOINT,
                data=assertion,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
        response.raise_for_status()
    except httpx.HTTPError as exc:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "Weryfikacja Steam jest chwilowo niedostępna") from exc

    result = dict(line.split(":", 1) for line in response.text.splitlines() if ":" in line)
    if result.get("is_valid", "").strip().lower() != "true":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Nieprawidłowa odpowiedź Steam")
    match = STEAM_ID_RE.fullmatch(params.get("openid.claimed_id", ""))
    if not match:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Nieprawidłowy identyfikator Steam")
    return match.group(1)


async def steam_profile(steam_id: str) -> dict:
    if not STEAM_API_KEY:
        return {}
    try:
        async with httpx.AsyncClient(timeout=10.0) as http:
            response = await http.get(
                "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
                params={"key": STEAM_API_KEY, "steamids": steam_id, "format": "json"},
            )
        response.raise_for_status()
        players = response.json().get("response", {}).get("players", [])
        return players[0] if players else {}
    except (httpx.HTTPError, ValueError):
        return {}


@api_router.post("/auth/steam/verify", response_model=AuthOut)
async def steam_verify(payload: dict = Body(...), authorization: Optional[str] = Header(default=None)):
    params = {k: str(v) for k, v in payload.items() if k.startswith("openid.")}
    required = {
        "openid.ns", "openid.mode", "openid.op_endpoint", "openid.claimed_id",
        "openid.identity", "openid.return_to", "openid.response_nonce",
        "openid.assoc_handle", "openid.signed", "openid.sig",
    }
    if not required.issubset(params):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Niekompletna odpowiedź Steam")
    if params["openid.op_endpoint"].rstrip("/") != STEAM_OPENID_ENDPOINT:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nieoczekiwany endpoint OpenID")
    if params["openid.return_to"] != STEAM_RETURN_TO:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nieoczekiwany adres return_to")

    steam_id = await verify_with_steam(params)
    profile = await steam_profile(steam_id)
    username = profile.get("personaname") or f"Steam {steam_id}"
    avatar_url = profile.get("avatarfull") or profile.get("avatarmedium") or profile.get("avatar")

    user = await upsert_user("steam_id", steam_id, username, avatar_url, bearer_user_id(authorization))
    return AuthOut(access_token=jwt_for(str(user["_id"])), user=await with_admin_flag(user))


@api_router.get("/auth/me", response_model=UserOut)
async def auth_me(authorization: Optional[str] = Header(default=None)):
    uid = require_user_id(authorization)
    doc = await db.users.find_one({"_id": ObjectId(uid)})
    if not doc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Nie znaleziono użytkownika")
    return await with_admin_flag(doc)


@api_router.delete("/auth/unlink/{provider}", response_model=UserOut)
async def unlink_provider(provider: str, authorization: Optional[str] = Header(default=None)):
    if provider not in {"discord", "steam"}:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nieznany dostawca")
    uid = require_user_id(authorization)
    await db.users.update_one({"_id": ObjectId(uid)}, {"$unset": {f"{provider}_id": ""}})
    doc = await db.users.find_one({"_id": ObjectId(uid)})
    return await with_admin_flag(doc)


DISCORD_WEBHOOK_URL = os.environ.get("DISCORD_WEBHOOK_URL", "")


async def notify_decision_webhook(discord_id: str, accepted: bool) -> None:
    if not DISCORD_WEBHOOK_URL:
        return
    message = (
        f"✅ Zatwierdzono podanie na WL: <@{discord_id}>"
        if accepted
        else f"❌ Odrzucone podanie na WL: <@{discord_id}>"
    )
    try:
        async with httpx.AsyncClient(timeout=8.0) as http:
            response = await http.post(
                DISCORD_WEBHOOK_URL,
                json={
                    "username": "FluxGG Reborn",
                    "content": message,
                    "allowed_mentions": {"users": [discord_id]},
                },
            )
            if response.status_code not in (200, 204):
                logger.warning("Discord webhook returned %s", response.status_code)
    except httpx.HTTPError:
        logger.warning("Discord webhook notification failed")


@api_router.post("/applications", response_model=ApplicationOut, status_code=201)
async def create_application(body: ApplicationCreate, authorization: Optional[str] = Header(default=None)):
    if body.type not in APPLICATION_TYPES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nieznany typ podania")
    stored_setting = await db.application_settings.find_one({"type": body.type})
    effective_status = stored_setting["status"] if stored_setting else APPLICATION_TYPE_DEFAULTS.get(body.type, "soon")
    if effective_status != "open":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nabór na ten typ podania jest zamknięty")
    required_keys = QUESTION_KEYS.get(body.type, set())
    answers = body.answers or {}
    if not required_keys.issubset(answers) or any(
        len(str(answers.get(key, "")).strip()) < 1 for key in required_keys
    ):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Uzupełnij wszystkie pytania podania")
    uid = require_user_id(authorization)
    user_doc = await db.users.find_one({"_id": ObjectId(uid)})
    if not user_doc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Nie znaleziono użytkownika")
    if not user_doc.get("discord_id") or not user_doc.get("steam_id"):
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "Aby złożyć podanie, połącz konto Discord i Steam w zakładce Weryfikacja",
        )
    doc = ApplicationDocument(
        user_id=uid,
        username=user_doc.get("username", "Gracz"),
        type=body.type,
        nick=body.nick,
        discord=user_doc["discord_id"],
        steam_id=user_doc["steam_id"],
        motivation=body.motivation,
        answers=body.answers,
    )
    result = await db.applications.insert_one(doc.to_mongo())
    created = await db.applications.find_one({"_id": result.inserted_id})
    return to_application_out(created)


@api_router.get("/applications/my", response_model=list[ApplicationOut])
async def my_applications(authorization: Optional[str] = Header(default=None)):
    uid = require_user_id(authorization)
    docs = await db.applications.find({"user_id": uid}).sort("created_at", -1).to_list(100)
    return [to_application_out(doc) for doc in docs]


@api_router.get("/admin/applications", response_model=list[ApplicationOut])
async def admin_applications(authorization: Optional[str] = Header(default=None)):
    await require_admin_user(authorization)
    docs = await db.applications.find().sort("created_at", -1).to_list(500)
    return [to_application_out(doc) for doc in docs]


class ApplicationStatusSetting(BaseModel):
    type: str
    status: str


@api_router.patch("/admin/applications/status")
async def admin_set_application_status(body: ApplicationStatusSetting, authorization: Optional[str] = Header(default=None)):
    await require_admin_user(authorization)
    if body.type not in APPLICATION_TYPE_DEFAULTS:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nieznany typ podania")
    if body.status not in {"open", "soon"}:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nieprawidłowy status naboru")
    await db.application_settings.update_one(
        {"type": body.type},
        {"$set": {"type": body.type, "status": body.status}},
        upsert=True,
    )
    return {"type": body.type, "status": body.status}


@api_router.patch("/admin/applications/{application_id}", response_model=ApplicationOut)
async def admin_update_application(application_id: str, body: ApplicationStatusIn, authorization: Optional[str] = Header(default=None)):
    await require_admin_user(authorization)
    if body.status not in APPLICATION_STATUSES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nieprawidłowy status")
    if not ObjectId.is_valid(application_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nie znaleziono podania")
    existing = await db.applications.find_one({"_id": ObjectId(application_id)})
    if not existing:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nie znaleziono podania")
    await db.applications.update_one(
        {"_id": ObjectId(application_id)},
        {"$set": {"status": body.status}},
    )
    doc = await db.applications.find_one({"_id": ObjectId(application_id)})
    if doc and doc.get("type") == "whitelist" and body.status in {"accepted", "rejected"}:
        await notify_decision_webhook(doc.get("discord", ""), body.status == "accepted")
    return to_application_out(doc)


@api_router.delete("/admin/applications/{application_id}", status_code=204)
async def admin_delete_application(application_id: str, authorization: Optional[str] = Header(default=None)):
    await require_admin_user(authorization)
    if not ObjectId.is_valid(application_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nie znaleziono podania")
    result = await db.applications.delete_one({"_id": ObjectId(application_id)})
    if result.deleted_count == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Nie znaleziono podania")


@api_router.get("/admin/admins", response_model=list[AdminOut])
async def admin_list_admins(authorization: Optional[str] = Header(default=None)):
    await require_admin_user(authorization)
    docs = await db.admins.find().sort("added_at", 1).to_list(200)
    return [to_admin_out(doc) for doc in docs]


@api_router.post("/admin/admins", response_model=AdminOut, status_code=201)
async def admin_add_admin(body: AdminIn, authorization: Optional[str] = Header(default=None)):
    await require_admin_user(authorization)
    await db.admins.update_one(
        {"discord_id": body.discord_id},
        {"$setOnInsert": {"discord_id": body.discord_id, "added_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    doc = await db.admins.find_one({"discord_id": body.discord_id})
    return to_admin_out(doc)


@api_router.delete("/admin/admins/{discord_id}", status_code=204)
async def admin_remove_admin(discord_id: str, authorization: Optional[str] = Header(default=None)):
    current = await require_admin_user(authorization)
    if current.get("discord_id") == discord_id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nie możesz usunąć samego siebie")
    await db.admins.delete_one({"discord_id": discord_id})


@api_router.post("/admin/bootstrap", status_code=201)
async def admin_bootstrap(body: AdminIn, x_admin_key: Optional[str] = Header(default=None)):
    if not ADMIN_KEY or x_admin_key != ADMIN_KEY:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Nieprawidłowy klucz administracyjny")
    await db.admins.update_one(
        {"discord_id": body.discord_id},
        {"$setOnInsert": {"discord_id": body.discord_id, "added_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    return {"ok": True, "discord_id": body.discord_id}


APPLICATION_TYPE_DEFAULTS = {
    "whitelist": "open",
    "administracja": "soon",
    "biznes": "open",
    "ekipa": "soon",
}


@api_router.get("/applications/status")
async def application_statuses():
    stored = {
        doc["type"]: doc["status"]
        for doc in await db.application_settings.find().to_list(50)
    }
    return {
        t: stored.get(t, default)
        for t, default in APPLICATION_TYPE_DEFAULTS.items()
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def create_indexes():
    await db.users.create_index("discord_id", unique=True, sparse=True)
    await db.users.create_index("steam_id", unique=True, sparse=True)
    await db.admins.create_index("discord_id", unique=True)
    for discord_id in ADMIN_DISCORD_IDS:
        await db.admins.update_one(
            {"discord_id": discord_id},
            {"$setOnInsert": {"discord_id": discord_id, "added_at": datetime.now(timezone.utc)}},
            upsert=True,
        )


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
