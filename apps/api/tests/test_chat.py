import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_chat_demo_mode(client: AsyncClient) -> None:
    res = await client.post(
        "/v1/chat",
        json={"messages": [{"role": "user", "content": "Hello"}]},
    )
    assert res.status_code == 200
    body = res.json()
    assert "reply" in body
    assert isinstance(body["reply"], str)
