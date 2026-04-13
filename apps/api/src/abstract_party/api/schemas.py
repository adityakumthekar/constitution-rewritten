from uuid import UUID

from pydantic import BaseModel, Field


class ChatMessageIn(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessageIn]
    conversation_id: UUID | None = None


class ChatResponse(BaseModel):
    reply: str
    conversation_id: UUID | None
    citations: list[str]


class MockLoginRequest(BaseModel):
    aadhaar_id: str = Field(..., min_length=4, max_length=32)
    pin: str = Field(..., min_length=4, max_length=12)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
