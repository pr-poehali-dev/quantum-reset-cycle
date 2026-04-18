import { useState, useEffect } from "react";

const PROMO_URL = "https://functions.poehali.dev/97994864-b8ef-4aa1-a65c-6c224dd09363";
const PUBLIC_API = "https://functions.poehali.dev/2544f220-2740-43d1-bafd-a762dfb630f9";

interface MenuItem { id: number; name: string; description: string; price: number; image_url: string; tag: string; tag_color: string; is_dish_of_day: boolean; }
interface Promo { is_active: boolean; title: string; description: string; min_order: number; }

function generateCoupon() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "СУШ-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function Index() {
  const [promoOpen, setPromoOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [coupon, setCoupon] = useState("");
  const [step, setStep] = useState<"form" | "done">("form");
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [promo, setPromo] = useState<Promo | null>(null);

  useEffect(() => {
    fetch(PUBLIC_API).then(r => r.json()).then(d => {
      setMenuItems(d.items || []);
      setPromo(d.promo || null);
      if (d.promo?.is_active) {
        const timer = setTimeout(() => setPromoOpen(true), 3000);
        return () => clearTimeout(timer);
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const newCoupon = generateCoupon();
    setLoading(true);
    await fetch(PROMO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, coupon: newCoupon }),
    });
    setLoading(false);
    setCoupon(newCoupon);
    setStep("done");
  }

  function closePromo() {
    setPromoOpen(false);
    setStep("form");
    setName("");
    setPhone("");
    setCoupon("");
  }

  return (
    <>
      <div className="grain-overlay" />

      {/* Промо-модальное окно */}
      {promoOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => e.target === e.currentTarget && closePromo()}
        >
          <div
            style={{
              background: "var(--bg)",
              border: "var(--border)",
              boxShadow: "10px 10px 0 var(--dark)",
              maxWidth: "480px",
              width: "100%",
              padding: "40px 32px",
              position: "relative",
            }}
          >
            <button
              onClick={closePromo}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "24px",
                fontWeight: 800,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>

            {step === "form" ? (
              <>
                <div
                  style={{
                    background: "var(--primary)",
                    color: "white",
                    display: "inline-block",
                    padding: "4px 12px",
                    fontWeight: 800,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    marginBottom: "16px",
                    border: "var(--border)",
                  }}
                >
                  Акция
                </div>
                <h2
                  style={{
                    fontFamily: "Unbounded, sans-serif",
                    fontSize: "28px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    lineHeight: 1.1,
                    marginBottom: "12px",
                  }}
                >
                  {promo?.title || "УЧАСТВУЙ В РОЗЫГРЫШЕ"}
                </h2>
                <p style={{ color: "#555", marginBottom: "24px", lineHeight: 1.6 }}>
                  {promo?.description || `При заказе от ${promo?.min_order?.toLocaleString() || "1 200"} ₽ ты получаешь уникальный купон.`}
                </p>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input
                    type="text"
                    placeholder="Твоё имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      border: "var(--border)",
                      padding: "12px 16px",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      background: "white",
                      outline: "none",
                      width: "100%",
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Телефон"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{
                      border: "var(--border)",
                      padding: "12px 16px",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                      background: "white",
                      outline: "none",
                      width: "100%",
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-cta"
                    disabled={loading}
                    style={{ background: "var(--primary)", color: "white", width: "100%", fontSize: "14px", opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? "Сохраняем..." : "Получить купон"}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
                <h2
                  style={{
                    fontFamily: "Unbounded, sans-serif",
                    fontSize: "22px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  Твой купон готов!
                </h2>
                <p style={{ color: "#555", marginBottom: "24px", lineHeight: 1.6 }}>
                  При заказе от 1 200 ₽ назови этот код — и ты в розыгрыше!
                </p>
                <div
                  style={{
                    background: "var(--dark)",
                    color: "var(--accent)",
                    fontFamily: "Unbounded, sans-serif",
                    fontSize: "28px",
                    fontWeight: 800,
                    letterSpacing: "4px",
                    padding: "20px",
                    border: "var(--border)",
                    marginBottom: "24px",
                  }}
                >
                  {coupon}
                </div>
                <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
                  Сохрани код или сделай скриншот
                </p>
                <button
                  className="btn-cta"
                  onClick={closePromo}
                  style={{ background: "var(--primary)", color: "white", width: "100%" }}
                >
                  Закрыть
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <header className="header">
        <div className="logo">ЯПОНСКИЕ*СУШИ</div>
        <nav>
          <a href="#">Меню</a>
          <a href="#">О нас</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setPromoOpen(true); }}>Акции</a>
          <a href="#">Адрес</a>
        </nav>
        <a href="tel:+79523037070" className="btn-cta">Заказать</a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">
              ЯПОНИЯ
              <br />
              НА ТВОЕЙ <span>ТАРЕЛКЕ</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-8 md:mb-10 leading-relaxed text-[#555]">
              Свежайший лосось, тунец и угорь. Каждый ролл — это маленькое произведение искусства в духе токийских 70-х.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <a href="tel:+79523037070" className="btn-cta" style={{ background: "var(--primary)", color: "white" }}>
                Заказать сейчас
              </a>
              <button
                className="btn-cta"
                style={{ background: "white" }}
                onClick={() => setPromoOpen(true)}
              >
                Участвовать в акции
              </button>
            </div>
          </div>
          <div
            className="hero-img"
            style={{
              backgroundImage: `url("https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/6ad8bc54-e3f6-4d83-9b3f-b1751f98016e.jpg")`,
            }}
          >
            <div className="sticker">
              СВЕЖАК
              <br />
              КАЖДЫЙ ДЕНЬ
            </div>
            <div className="floating-tag hidden md:block" style={{ top: "20%", left: "10%" }}>
              #УМАМИ
            </div>
            <div className="floating-tag hidden md:block" style={{ bottom: "30%", right: "20%" }}>
              ТОКИО
            </div>
          </div>
        </section>

        <div className="marquee">
          <div className="marquee-content">
            &nbsp; * СУШИ КОТОРЫЕ ВЗРЫВАЮТ * СВЕЖАЯ РЫБА КАЖДЫЙ ДЕНЬ * ТОЛЬКО НАСТОЯЩИЙ ВКУС * ОТКРЫТЫ ДО 23:00 * ЛУЧШИЕ В
            ГОРОДЕ * СУШИ КОТОРЫЕ ВЗРЫВАЮТ * СВЕЖАЯ РЫБА КАЖДЫЙ ДЕНЬ * ТОЛЬКО НАСТОЯЩИЙ ВКУС * ОТКРЫТЫ ДО 23:00 * ЛУЧШИЕ В
            ГОРОДЕ
          </div>
        </div>

        <section className="section-padding">
          <div className="section-header">
            <h2 className="section-title">ВЫБОР ШЕФА</h2>
            <a
              href="#"
              className="text-sm md:text-base"
              style={{ color: "var(--dark)", fontWeight: 800, textTransform: "uppercase" }}
            >
              Всё меню
            </a>
          </div>

          <div className="menu-grid">
            {menuItems.map(item => (
              <div className="menu-card" key={item.id}>
                {item.is_dish_of_day && <span className="menu-tag" style={{ background: "#f5c842", color: "#1a1a1a" }}>Блюдо дня</span>}
                {!item.is_dish_of_day && item.tag && <span className="menu-tag" style={{ background: item.tag_color, color: "white" }}>{item.tag}</span>}
                <img src={item.image_url} alt={item.name} />
                <div className="menu-card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <h3>{item.name}</h3>
                    <span className="price">{item.price.toLocaleString()} ₽</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "#666" }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="retro-vibe">
          <div>
            <h2 className="vibe-title">ВАЙБ-ЧЕК ПРОЙДЕН.</h2>
            <p className="vibe-text">
              Мы не просто кормим. Мы переносим тебя в уличные суши-бары Токио 70-х — с джазом, тёплым светом и запахом
              свежего риса. Каждый визит — особый момент. Без суеты, только вкус.
            </p>
            <button className="btn-cta" style={{ background: "var(--dark)", color: "white", borderColor: "white" }}>
              Наша история
            </button>
          </div>
          <div
            className="vibe-img"
            style={{
              backgroundImage: `url("https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/21e49f63-9001-4af6-8055-814fca4ae3b9.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </section>

        <section className="section-padding">
          <h2 className="section-title" style={{ marginBottom: "40px", textAlign: "center" }}>
            @ЯПОНСКИЕ.СУШИ
          </h2>
          <div className="social-grid">
            <div className="social-item">
              <img src="https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/d5160c06-687d-490e-8d37-d95190a26875.jpg" alt="Суши фото 1" />
            </div>
            <div className="social-item">
              <img src="https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/6ad8bc54-e3f6-4d83-9b3f-b1751f98016e.jpg" alt="Суши фото 2" />
            </div>
            <div className="social-item">
              <img src="https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/21e49f63-9001-4af6-8055-814fca4ae3b9.jpg" alt="Суши фото 3" />
            </div>
            <div className="social-item">
              <img src="https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/b429e844-3bac-41b1-8939-c67c6f348a74.jpg" alt="Суши фото 4" />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <div className="footer-logo">ЯПОНСКИЕ*СУШИ</div>
          <p style={{ color: "#666", lineHeight: 1.6 }}>
            Японская кухня в духе ретро. Свежайшие ингредиенты, мастерство шефа и атмосфера как в Токио 70-х.
          </p>
        </div>
        <div className="footer-links">
          <h4>Навигация</h4>
          <ul>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Меню</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>О нас</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }} onClick={(e) => { e.preventDefault(); setPromoOpen(true); }}>Акции</a></li>
            <li><a href="#" style={{ color: "inherit", textDecoration: "none" }}>Контакты</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Часы работы</h4>
          <ul>
            <li>Пн–Пт: 12:00–23:00</li>
            <li>Сб–Вс: 11:00–00:00</li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Контакты</h4>
          <ul>
            <li>г. Архангельск, ул. Гайдара, 30</li>
            <li>
              <a href="tel:+79523037070" style={{ color: "inherit", textDecoration: "none" }}>
                +7 (952) 303-70-70
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}