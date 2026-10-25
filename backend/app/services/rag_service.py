from app.services.vectorstore import (
    create_vectorstore,
)


def build_knowledge_base():
    return create_vectorstore()