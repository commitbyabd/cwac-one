# common place to do serialization


def serialize_document(document: dict) -> dict:
    document["id"] = str(document.pop("_id"))
    return document


def serialize_documents(documents: list[dict]) -> list[dict]:
    return [serialize_document(document) for document in documents]
