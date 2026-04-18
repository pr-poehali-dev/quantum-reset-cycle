import { useState, useEffect, useRef } from "react";

const API = "https://functions.poehali.dev/60c1f990-ebd0-42ad-814a-3fcc2321caa0";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  tag: string;
  tag_color: string;
  is_dish_of_day: boolean;
  is_active: boolean;
  sort_order: number;
}

interface Promo {
  id: number;
  is_active: boolean;
  title: string;
  description: string;
  min_order: number;
}

interface Entry {
  id: number;
  name: string;
  phone: string;
  coupon: string;
  created_at: string;
}

const emptyItem = (): Omit<MenuItem, "id"> => ({
  name: "", description: "", price: 0, image_url: "",
  tag: "", tag_color: "#c0392b", is_dish_of_day: false, is_active: true, sort_order: 99,
});

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"menu" | "promo" | "entries">("menu");

  const [items, setItems] = useState<MenuItem[]>([]);
  const [promo, setPromo] = useState<Promo | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(emptyItem());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const api = (action: string, method = "GET", body?: object, id?: number) => {
    const url = `${API}?action=${action}${id ? `&id=${id}` : ""}`;
    return fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "X-Admin-Token": token },
      body: body ? JSON.stringify(body) : undefined,
    }).then(r => r.json());
  };

  async function login() {
    const res = await fetch(`${API}?action=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: loginInput }),
    }).then(r => r.json());
    if (res.ok) {
      localStorage.setItem("admin_token", loginInput);
      setToken(loginInput);
    } else {
      setLoginError("Неверный пароль");
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setToken("");
  }

  useEffect(() => {
    if (!token) return;
    if (tab === "menu") api("menu").then(d => setItems(d.items || []));
    if (tab === "promo") api("promo").then(d => setPromo(d.promo));
    if (tab === "entries") api("entries").then(d => setEntries(d.entries || []));
  }, [tab, token]);

  async function uploadImage(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const base64 = await new Promise<string>((res) => {
      const reader = new FileReader();
      reader.onload = () => res((reader.result as string).split(",")[1]);
      reader.readAsDataURL(file);
    });
    const data = await api("upload", "POST", { file: base64, ext });
    setUploading(false);
    return data.url || "";
  }

  function startAdd() {
    setEditing(null);
    setForm(emptyItem());
  }

  function startEdit(item: MenuItem) {
    setEditing(item);
    setForm({ ...item });
  }

  async function saveItem() {
    setSaving(true);
    if (editing) {
      await api("menu", "PUT", form, editing.id);
    } else {
      await api("menu", "POST", form);
    }
    const data = await api("menu");
    setItems(data.items || []);
    setEditing(null);
    setForm(emptyItem());
    setSaving(false);
  }

  async function deleteItem(id: number) {
    if (!confirm("Удалить блюдо?")) return;
    await api("menu", "DELETE", undefined, id);
    setItems(items.filter(i => i.id !== id));
  }

  async function savePromo() {
    if (!promo) return;
    setSaving(true);
    await api("promo", "PUT", promo);
    setSaving(false);
    alert("Акция сохранена!");
  }

  const inputStyle: React.CSSProperties = {
    border: "2px solid #1a1a1a", padding: "8px 12px", width: "100%",
    fontFamily: "Montserrat, sans-serif", fontSize: "14px", marginBottom: "10px",
    background: "white", outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontWeight: 800, textTransform: "uppercase",
    letterSpacing: "1px", marginBottom: "4px", display: "block", color: "#555",
  };

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf8f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ background: "white", border: "3px solid #1a1a1a", boxShadow: "8px 8px 0 #1a1a1a", padding: "40px", maxWidth: "400px", width: "100%" }}>
          <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>АДМИН ПАНЕЛЬ</div>
          <div style={{ color: "#666", marginBottom: "24px", fontSize: "14px" }}>ЯПОНСКИЕ*СУШИ</div>
          <label style={labelStyle}>Пароль</label>
          <input
            type="password" value={loginInput}
            onChange={e => setLoginInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={inputStyle} placeholder="Введите пароль"
          />
          {loginError && <div style={{ color: "#c0392b", fontSize: "13px", marginBottom: "10px" }}>{loginError}</div>}
          <button
            onClick={login}
            style={{ background: "#c0392b", color: "white", border: "2px solid #1a1a1a", padding: "12px 24px", fontWeight: 800, fontSize: "14px", textTransform: "uppercase", cursor: "pointer", width: "100%", boxShadow: "4px 4px 0 #1a1a1a" }}
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f5", fontFamily: "Montserrat, sans-serif" }}>
      {/* Шапка */}
      <div style={{ background: "white", borderBottom: "3px solid #1a1a1a", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 800, fontSize: "18px" }}>ЯПОНСКИЕ*СУШИ — АДМИН</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <a href="/" style={{ fontSize: "13px", fontWeight: 700, color: "#1a1a1a", textDecoration: "none", padding: "6px 12px", border: "2px solid #1a1a1a" }}>← Сайт</a>
          <button onClick={logout} style={{ fontSize: "13px", fontWeight: 700, background: "none", border: "2px solid #1a1a1a", padding: "6px 12px", cursor: "pointer" }}>Выйти</button>
        </div>
      </div>

      {/* Табы */}
      <div style={{ display: "flex", borderBottom: "3px solid #1a1a1a", background: "white" }}>
        {(["menu", "promo", "entries"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "14px 24px", fontWeight: 800, fontSize: "13px", textTransform: "uppercase",
            background: tab === t ? "#c0392b" : "transparent", color: tab === t ? "white" : "#1a1a1a",
            border: "none", borderRight: "2px solid #1a1a1a", cursor: "pointer", letterSpacing: "1px",
          }}>
            {t === "menu" ? "Меню" : t === "promo" ? "Акция" : "Участники"}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>

        {/* ---- МЕНЮ ---- */}
        {tab === "menu" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "20px", fontWeight: 800 }}>Блюда</div>
              <button onClick={startAdd} style={{ background: "#c0392b", color: "white", border: "2px solid #1a1a1a", padding: "10px 20px", fontWeight: 800, fontSize: "13px", textTransform: "uppercase", cursor: "pointer", boxShadow: "3px 3px 0 #1a1a1a" }}>
                + Добавить блюдо
              </button>
            </div>

            {/* Форма добавления/редактирования */}
            {(editing !== undefined && (editing !== null || form.name !== "" || !items.length)) && (
              <div style={{ background: "white", border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a", padding: "24px", marginBottom: "24px" }}>
                <div style={{ fontWeight: 800, fontSize: "16px", marginBottom: "16px", textTransform: "uppercase" }}>
                  {editing ? "Редактировать блюдо" : "Новое блюдо"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Название</label>
                    <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Сет «Токио»" />
                  </div>
                  <div>
                    <label style={labelStyle}>Цена (₽)</label>
                    <input style={inputStyle} type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} />
                  </div>
                </div>
                <label style={labelStyle}>Описание</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "70px" }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <label style={labelStyle}>Картинка</label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "center" }}>
                  <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                  <button
                    onClick={() => fileRef.current?.click()}
                    style={{ background: "#f5c842", border: "2px solid #1a1a1a", padding: "8px 14px", fontWeight: 800, fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "3px 3px 0 #1a1a1a" }}
                  >
                    {uploading ? "Загрузка..." : "Загрузить"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) { const url = await uploadImage(file); setForm(f => ({ ...f, image_url: url })); }
                  }} />
                </div>
                {form.image_url && <img src={form.image_url} alt="" style={{ width: "120px", height: "80px", objectFit: "cover", border: "2px solid #1a1a1a", marginBottom: "12px" }} />}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Тег (напр. «Хит»)</label>
                    <input style={inputStyle} value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>Цвет тега</label>
                    <input type="color" value={form.tag_color} onChange={e => setForm({ ...form, tag_color: e.target.value })} style={{ height: "40px", width: "100%", border: "2px solid #1a1a1a", cursor: "pointer" }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Порядок</label>
                    <input style={inputStyle} type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: +e.target.value })} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "4px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                    <input type="checkbox" checked={form.is_dish_of_day} onChange={e => setForm({ ...form, is_dish_of_day: e.target.checked })} style={{ width: "16px", height: "16px" }} />
                    Блюдо дня
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} style={{ width: "16px", height: "16px" }} />
                    Показывать на сайте
                  </label>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button onClick={saveItem} disabled={saving} style={{ background: "#c0392b", color: "white", border: "2px solid #1a1a1a", padding: "10px 24px", fontWeight: 800, fontSize: "13px", textTransform: "uppercase", cursor: "pointer", boxShadow: "3px 3px 0 #1a1a1a", opacity: saving ? 0.7 : 1 }}>
                    {saving ? "Сохранение..." : "Сохранить"}
                  </button>
                  <button onClick={() => { setEditing(null); setForm(emptyItem()); }} style={{ background: "white", border: "2px solid #1a1a1a", padding: "10px 20px", fontWeight: 800, fontSize: "13px", cursor: "pointer" }}>
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* Список блюд */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map(item => (
                <div key={item.id} style={{ background: "white", border: "2px solid #1a1a1a", padding: "16px", display: "flex", gap: "16px", alignItems: "center", opacity: item.is_active ? 1 : 0.5 }}>
                  <img src={item.image_url} alt="" style={{ width: "70px", height: "50px", objectFit: "cover", border: "2px solid #1a1a1a", flexShrink: 0 }} onError={e => (e.target as HTMLImageElement).style.display = "none"} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: "15px", display: "flex", gap: "8px", alignItems: "center" }}>
                      {item.name}
                      {item.is_dish_of_day && <span style={{ background: "#f5c842", border: "1px solid #1a1a1a", padding: "1px 7px", fontSize: "11px", fontWeight: 800 }}>БЛЮДО ДНЯ</span>}
                      {item.tag && <span style={{ background: item.tag_color, color: "white", padding: "1px 7px", fontSize: "11px", fontWeight: 800 }}>{item.tag}</span>}
                    </div>
                    <div style={{ fontSize: "13px", color: "#666", marginTop: "2px" }}>{item.description}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "16px", flexShrink: 0 }}>{item.price.toLocaleString()} ₽</div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={() => startEdit(item)} style={{ background: "#f5c842", border: "2px solid #1a1a1a", padding: "6px 12px", fontWeight: 800, fontSize: "12px", cursor: "pointer" }}>Изменить</button>
                    <button onClick={() => deleteItem(item.id)} style={{ background: "white", border: "2px solid #c0392b", color: "#c0392b", padding: "6px 12px", fontWeight: 800, fontSize: "12px", cursor: "pointer" }}>Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- АКЦИЯ ---- */}
        {tab === "promo" && promo && (
          <div style={{ background: "white", border: "3px solid #1a1a1a", boxShadow: "6px 6px 0 #1a1a1a", padding: "24px", maxWidth: "600px" }}>
            <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "20px", fontWeight: 800, marginBottom: "20px" }}>Настройки акции</div>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, fontSize: "14px", marginBottom: "20px", cursor: "pointer" }}>
              <input type="checkbox" checked={promo.is_active} onChange={e => setPromo({ ...promo, is_active: e.target.checked })} style={{ width: "18px", height: "18px" }} />
              Акция активна (показывать попап на сайте)
            </label>
            <label style={labelStyle}>Заголовок акции</label>
            <input style={inputStyle} value={promo.title} onChange={e => setPromo({ ...promo, title: e.target.value })} />
            <label style={labelStyle}>Описание</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "90px" }} value={promo.description} onChange={e => setPromo({ ...promo, description: e.target.value })} />
            <label style={labelStyle}>Минимальная сумма заказа (₽)</label>
            <input style={inputStyle} type="number" value={promo.min_order} onChange={e => setPromo({ ...promo, min_order: +e.target.value })} />
            <button onClick={savePromo} disabled={saving} style={{ background: "#c0392b", color: "white", border: "2px solid #1a1a1a", padding: "12px 28px", fontWeight: 800, fontSize: "14px", textTransform: "uppercase", cursor: "pointer", boxShadow: "4px 4px 0 #1a1a1a", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        )}

        {/* ---- УЧАСТНИКИ ---- */}
        {tab === "entries" && (
          <div>
            <div style={{ fontFamily: "Unbounded, sans-serif", fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>
              Участники розыгрыша — {entries.length} чел.
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", border: "2px solid #1a1a1a" }}>
                <thead>
                  <tr style={{ background: "#1a1a1a", color: "white" }}>
                    {["#", "Имя", "Телефон", "Купон", "Дата"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 800, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={e.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "10px 16px", color: "#888", fontSize: "13px" }}>{i + 1}</td>
                      <td style={{ padding: "10px 16px", fontWeight: 700 }}>{e.name}</td>
                      <td style={{ padding: "10px 16px" }}>{e.phone}</td>
                      <td style={{ padding: "10px 16px", fontFamily: "monospace", fontWeight: 700, color: "#c0392b", fontSize: "15px" }}>{e.coupon}</td>
                      <td style={{ padding: "10px 16px", fontSize: "13px", color: "#666" }}>{new Date(e.created_at).toLocaleString("ru")}</td>
                    </tr>
                  ))}
                  {!entries.length && (
                    <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#888" }}>Пока нет участников</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
