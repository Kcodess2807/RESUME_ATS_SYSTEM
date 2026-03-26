import logging
from datetime import datetime, timezone
from typing import List, Optional, Dict

logger=logging.getLogger('ats_resume_scorer')

try:
    from motor.motor_asyncio import AsyncIOMotorClient
    MOTOR_AVAILABLE = True
except ImportError:
    AsyncIOMotorClient = None  # type: ignore[misc, assignment]
    MOTOR_AVAILABLE = False
    logger.warning("motor package not installed — history storage disabled. Install with: pip install motor")

from backend.core.config import MONGODB_URI, MONGODB_DB

_client = None
_db = None


def _get_db():
    global _client, _db
    if not MOTOR_AVAILABLE:
        return None
    if not MONGODB_URI:
        return None
    if _db is None and AsyncIOMotorClient is not None:
        _client = AsyncIOMotorClient(MONGODB_URI)
        _db = _client[MONGODB_DB]
    return _db

async def save_analysis(user_id: str, filename:str, analysis_result:Dict)->Optional[str]:

    db = _get_db()
    if db is None:
        return None

    import json
    serializable_result = json.loads(json.dumps(analysis_result, default=str))

    doc = {
        "user_id": user_id,
        "filename": filename,
        "ats_score": serializable_result.get("ats_score", 0),
        "keyword_match": serializable_result.get("keyword_match", 0),
        "missing_keywords": serializable_result.get("missing_keywords", []),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "analysis_result": serializable_result, # Full payload for PDF downloads
    }

    try:
        result = await db.analyses.insert_one(doc)
        logger.info(f"Saved analysis for user {user_id}: {result.inserted_id}")
        return str(result.inserted_id)
    except Exception as exc:
        logger.error(f"Failed to save analysis: {exc}")
        return None


async def get_user_history(user_id: str) -> List[Dict]:
    db = _get_db()
    if db is None:
        return []
    
    try:
        # Include fields needed for table + the raw result for PDF
        cursor = db.analyses.find(
            {"user_id": user_id},
        ).sort("created_at", -1)

        results = []
        async for doc in cursor:
            results.append({
                "id": str(doc["_id"]),
                "filename": doc.get("filename", "resume"),
                "resume_name": doc.get("filename", "resume"),
                "job_title": "Software Engineer", # Fallback since we don't store role explicitly yet
                "ats_score": doc.get("ats_score", 0),
                "keyword_match": doc.get("keyword_match", 0),
                "missing_keywords": doc.get("missing_keywords", []),
                "date": doc.get("created_at", ""),
                "created_at": doc.get("created_at", ""),
                "analysis_result": doc.get("analysis_result", {}),
            })
        return results
    except Exception as exc:
        logger.error(f"Failed to fetch history: {exc}")
        return []
    
async def delete_analysis(analysis_id: str, user_id: str) -> bool:
    """
    Delete a specific analysis document, verifying ownership by user_id.
    """
    db = _get_db()
    if db is None:
        return False

    try:
        from bson import ObjectId
        result = await db.analyses.delete_one({
            "_id": ObjectId(analysis_id),
            "user_id": user_id,
        })
        return result.deleted_count > 0
    except Exception as exc:
        logger.error(f"Failed to delete analysis {analysis_id}: {exc}")
        return False
