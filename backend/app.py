

from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException, Header, Response
from fastapi.middleware.cors import CORSMiddleware
from google.ads.googleads.errors import GoogleAdsException
from grpc import RpcError
from pydantic import BaseModel, HttpUrl, EmailStr
from google.ads.googleads.client import GoogleAdsClient
from groq import Groq
import time

from recommendation import AI_Recommendation
from add_api import google_add_api
from agent import Marketing_Agent

# FastAPI app initialization and CORS middleware
app = FastAPI()

# CORS configuration - must come before any routes
origins = [
    "http://localhost:8080",
    # "http://127.0.0.1:3000",
    # add your production domains here
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Catch-all OPTIONS handler for CORS preflight
@app.options("/{full_path:path}")
async def preflight_handler(full_path: str):
    return Response(status_code=200)

# In-memory user store (email → user record)
users_db: dict[str, dict] = {}

# =========================
# ===== Models ==========
# =========================
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    fullName: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    email: EmailStr
    fullName: str

class TokenResponse(BaseModel):
    user: User
    token: str

class QueryRequest(BaseModel):
    budget: str
    days: str
    campaignId: str
    url: HttpUrl

# =========================
# ===== Auth Endpoints ===
# =========================
@app.post("/auth/register", response_model=TokenResponse)
async def register(req: RegisterRequest):
    if req.email in users_db:
        raise HTTPException(status_code=400, detail="Email already in use")
    user_id = f"user-{len(users_db) + 1}"
    users_db[req.email] = {
        "id": user_id,
        "email": req.email,
        "fullName": req.fullName,
        "password": req.password,
    }
    token = user_id  # mock token
    return {"user": User(id=user_id, email=req.email, fullName=req.fullName), "token": token}

@app.post("/auth/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    user = users_db.get(req.email)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = user["id"]
    return {"user": User(id=token, email=user["email"], fullName=user["fullName"]), "token": token}

@app.get("/auth/me", response_model=User)
async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing Authorization header")
    token = authorization.split(" ", 1)[1]
    for user in users_db.values():
        if user["id"] == token:
            return User(id=user["id"], email=user["email"], fullName=user["fullName"])
    raise HTTPException(status_code=401, detail="Invalid token or user not found")

# =========================
# ===== Google Ads Agent ==
# =========================
client = GoogleAdsClient.load_from_storage(version="v18")
api_key = "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"
model = "llama-3.3-70b-versatile"
groq_client = Groq(api_key=api_key)
mk_agent = Marketing_Agent(groq_client, model, google_add_api, AI_Recommendation(api_key))

class AgentState:
    state = "budgeting"
    customer_id = "9115365119"
    client = client
    delivery_method = client.enums.BudgetDeliveryMethodEnum.STANDARD
    campaign_budget_resource_name = None
    campaign_name = None
    campaign_type = client.enums.AdvertisingChannelTypeEnum.DISPLAY
    campaign_status = client.enums.CampaignStatusEnum.ENABLED   # ← was PAUSED
    start_date = None
    end_date = None
    response = None
    campaign_resource_name = None
    locations = None
    language = None
    devices = None
    schedules = None
    business_name = None
    descriptions = None
    headlines = None
    link = None
    custom_parameters = None
    ad_group_resource_name = None
    tracking_template = None
    square_image_asset_resource_name = None
    landscape_image_asset_resource_name = None

@app.post("/api/executeQueries")
async def execute_queries(query_request: QueryRequest):
    responses = []

    # 1) initialize state
    agent = AgentState()
    agent.link = [str(query_request.url)]

    # 2) build a single unique campaign name
    unique_id = f"{query_request.campaignId}-{int(time.time())}"
    agent.campaign_name = unique_id

    # 3) Budgeting step
    start = time.time()
    agent = mk_agent.run(
        f"i have {query_request.budget} dollar budget for campaign",
        agent
    )
    responses.append({
        "state": agent.state,
        "response": agent.response,
        "duration": time.time() - start
    })

    # 4) Campaign creation – now using the timestamp-suffixed name
    start = time.time()
    agent = mk_agent.run(
        f"for {query_request.days} days and id will be {unique_id}",
        agent
    )
    responses.append({
        "state": agent.state,
        "response": agent.response,
        "duration": time.time() - start
    })

    # 5) Location & Language targeting
    start = time.time()
    agent = mk_agent.run(agent.link, agent)
    responses.append({
        "state": agent.state,
        "response": agent.response,
        "duration": time.time() - start
    })

    # 6) Audience targeting
    start = time.time()
    agent = mk_agent.run(agent.link, agent)
    responses.append({
        "state": agent.state,
        "response": agent.response,
        "duration": time.time() - start,
        "audience_criteria": getattr(agent, "applied_audience_criteria", {}),
    })

    # 7) Scheduling & Devices
    start = time.time()
    agent = mk_agent.run(agent.link, agent)
    responses.append({
        "state": agent.state,
        "response": agent.response,
        "duration": time.time() - start
    })

    # 8) Ad setup
    start = time.time()
    agent = mk_agent.run(agent.link, agent)
    responses.append({
        "state": agent.state,
        "response": agent.response,
        "duration": time.time() - start
    })

    return {"responses": responses}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")







