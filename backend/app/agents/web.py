from app.services.web_search_service import web_search


def web_agent(topic: str):
    return web_search(topic)