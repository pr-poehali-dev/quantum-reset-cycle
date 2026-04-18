import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
}


def handler(event: dict, context) -> dict:
    """Публичное API: меню и настройки акции для сайта."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    cur.execute("SELECT id, name, description, price, image_url, tag, tag_color, is_dish_of_day, sort_order FROM menu_items WHERE is_active=TRUE ORDER BY sort_order")
    rows = cur.fetchall()
    items = [{"id": r[0], "name": r[1], "description": r[2], "price": r[3], "image_url": r[4], "tag": r[5], "tag_color": r[6], "is_dish_of_day": r[7], "sort_order": r[8]} for r in rows]

    cur.execute("SELECT is_active, title, description, min_order FROM promo_settings ORDER BY id LIMIT 1")
    row = cur.fetchone()
    promo = {"is_active": row[0], "title": row[1], "description": row[2], "min_order": row[3]} if row else None

    conn.close()
    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"items": items, "promo": promo}, ensure_ascii=False),
    }
