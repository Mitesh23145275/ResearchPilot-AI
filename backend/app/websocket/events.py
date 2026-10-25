from app.websocket.connection_manager import manager

async def send_event(agent: str, status: str):
    await manager.broadcast({
        "agent": agent,
        "status": status
    })