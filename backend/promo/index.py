import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Сохранение заявки на участие в акции и получение списка заявок."""

    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    if event.get("httpMethod") == "POST":
        body = json.loads(event.get("body") or "{}")
        name = body.get("name", "").strip()
        phone = body.get("phone", "").strip()
        coupon = body.get("coupon", "").strip()

        if not name or not phone or not coupon:
            conn.close()
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "Заполните все поля"}),
            }

        cur.execute(
            "INSERT INTO promo_entries (name, phone, coupon) VALUES (%s, %s, %s) ON CONFLICT (coupon) DO NOTHING RETURNING id",
            (name, phone, coupon),
        )
        conn.commit()
        conn.close()
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"ok": True}),
        }

    if event.get("httpMethod") == "GET":
        cur.execute("SELECT id, name, phone, coupon, created_at FROM promo_entries ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()
        entries = [
            {"id": r[0], "name": r[1], "phone": r[2], "coupon": r[3], "created_at": r[4].isoformat()}
            for r in rows
        ]
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({"entries": entries}),
        }

    conn.close()
    return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}