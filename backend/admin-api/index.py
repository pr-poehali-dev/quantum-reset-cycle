import json
import os
import psycopg2
import boto3
import base64
import uuid

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
    "Content-Type": "application/json",
}


def resp(status, body):
    return {"statusCode": status, "headers": CORS, "body": json.dumps(body, ensure_ascii=False)}


def check_auth(event):
    token = event.get("headers", {}).get("X-Admin-Token", "")
    return token == os.environ.get("ADMIN_PASSWORD", "")


def handler(event: dict, context) -> dict:
    """Админ API: управление меню, акцией и блюдом дня."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    item_id = qs.get("id", "")

    # Авторизация
    if action == "login" and method == "POST":
        body = json.loads(event.get("body") or "{}")
        if body.get("password") == os.environ.get("ADMIN_PASSWORD", ""):
            return resp(200, {"ok": True})
        return resp(401, {"error": "Неверный пароль"})

    if not check_auth(event):
        return resp(401, {"error": "Не авторизован"})

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    # --- МЕНЮ: список ---
    if action == "menu" and method == "GET":
        cur.execute("SELECT id, name, description, price, image_url, tag, tag_color, is_dish_of_day, is_active, sort_order FROM menu_items ORDER BY sort_order")
        rows = cur.fetchall()
        conn.close()
        items = [{"id": r[0], "name": r[1], "description": r[2], "price": r[3], "image_url": r[4], "tag": r[5], "tag_color": r[6], "is_dish_of_day": r[7], "is_active": r[8], "sort_order": r[9]} for r in rows]
        return resp(200, {"items": items})

    # --- МЕНЮ: добавить ---
    if action == "menu" and method == "POST":
        body = json.loads(event.get("body") or "{}")
        cur.execute(
            "INSERT INTO menu_items (name, description, price, image_url, tag, tag_color, is_dish_of_day, is_active, sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (body["name"], body["description"], body["price"], body["image_url"], body.get("tag", ""), body.get("tag_color", "#c0392b"), body.get("is_dish_of_day", False), body.get("is_active", True), body.get("sort_order", 99))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return resp(200, {"ok": True, "id": new_id})

    # --- МЕНЮ: обновить ---
    if action == "menu" and method == "PUT" and item_id:
        body = json.loads(event.get("body") or "{}")
        cur.execute(
            "UPDATE menu_items SET name=%s, description=%s, price=%s, image_url=%s, tag=%s, tag_color=%s, is_dish_of_day=%s, is_active=%s, sort_order=%s, updated_at=NOW() WHERE id=%s",
            (body["name"], body["description"], body["price"], body["image_url"], body.get("tag", ""), body.get("tag_color", "#c0392b"), body.get("is_dish_of_day", False), body.get("is_active", True), body.get("sort_order", 99), item_id)
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # --- МЕНЮ: удалить ---
    if action == "menu" and method == "DELETE" and item_id:
        cur.execute("DELETE FROM menu_items WHERE id=%s", (item_id,))
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # --- АКЦИЯ: получить ---
    if action == "promo" and method == "GET":
        cur.execute("SELECT id, is_active, title, description, min_order FROM promo_settings ORDER BY id LIMIT 1")
        row = cur.fetchone()
        conn.close()
        if not row:
            return resp(200, {"promo": None})
        return resp(200, {"promo": {"id": row[0], "is_active": row[1], "title": row[2], "description": row[3], "min_order": row[4]}})

    # --- АКЦИЯ: обновить ---
    if action == "promo" and method == "PUT":
        body = json.loads(event.get("body") or "{}")
        cur.execute(
            "UPDATE promo_settings SET is_active=%s, title=%s, description=%s, min_order=%s, updated_at=NOW() WHERE id=%s",
            (body["is_active"], body["title"], body["description"], body["min_order"], body["id"])
        )
        conn.commit()
        conn.close()
        return resp(200, {"ok": True})

    # --- УЧАСТНИКИ АКЦИИ ---
    if action == "entries" and method == "GET":
        cur.execute("SELECT id, name, phone, coupon, created_at FROM promo_entries ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()
        entries = [{"id": r[0], "name": r[1], "phone": r[2], "coupon": r[3], "created_at": r[4].isoformat()} for r in rows]
        return resp(200, {"entries": entries})

    # --- ЗАГРУЗКА КАРТИНКИ ---
    if action == "upload" and method == "POST":
        body = json.loads(event.get("body") or "{}")
        file_data = base64.b64decode(body["file"])
        ext = body.get("ext", "jpg")
        key = f"menu/{uuid.uuid4()}.{ext}"
        s3 = boto3.client("s3", endpoint_url="https://bucket.poehali.dev",
                          aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
                          aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"])
        s3.put_object(Bucket="files", Key=key, Body=file_data, ContentType=f"image/{ext}")
        url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key}"
        conn.close()
        return resp(200, {"url": url})

    conn.close()
    return resp(404, {"error": "Not found"})
