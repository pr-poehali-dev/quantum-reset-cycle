export default function Index() {
  return (
    <>
      <div className="grain-overlay" />

      <header className="header">
        <div className="logo">ЯПОНСКИЕ*СУШИ</div>
        <nav>
          <a href="#">Меню</a>
          <a href="#">О нас</a>
          <a href="#">Акции</a>
          <a href="#">Адрес</a>
        </nav>
        <button className="btn-cta">Заказать</button>
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
              <button className="btn-cta" style={{ background: "var(--primary)", color: "white" }}>
                Заказать сейчас
              </button>
              <button className="btn-cta" style={{ background: "white" }}>
                Смотреть меню
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
            {/* Item 1 */}
            <div className="menu-card">
              <span className="menu-tag">Хит продаж</span>
              <img
                src="https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/d5160c06-687d-490e-8d37-d95190a26875.jpg"
                alt="Нигири с лососем"
              />
              <div className="menu-card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h3>Сет «Токио»</h3>
                  <span className="price">1 490 ₽</span>
                </div>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  12 нигири из лосося, тунца и угря. Подаётся с соусом понзу и маринованным имбирём.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="menu-card">
              <span className="menu-tag" style={{ background: "var(--secondary)" }}>
                Огонь
              </span>
              <img
                src="https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/b429e844-3bac41b1-8939-c67c6f348a74.jpg"
                alt="Роллы Спайси"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/6ad8bc54-e3f6-4d83-9b3f-b1751f98016e.jpg";
                }}
              />
              <div className="menu-card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h3>Спайси Дракон</h3>
                  <span className="price">990 ₽</span>
                </div>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  Острый тунец, авокадо, огурец, сверху — запечённый лосось с соусом шрирача.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="menu-card">
              <span className="menu-tag" style={{ background: "var(--accent)", color: "var(--dark)" }}>
                Популярное
              </span>
              <img
                src="https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/6ad8bc54-e3f6-4d83-9b3f-b1751f98016e.jpg"
                alt="Сет Сакура"
              />
              <div className="menu-card-body">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h3>Сет «Сакура»</h3>
                  <span className="price">2 200 ₽</span>
                </div>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  32 ролла на выбор: Филадельфия, Калифорния, Радуга и Дракон. Идеально на двоих.
                </p>
              </div>
            </div>
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
              <img
                src="https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/d5160c06-687d-490e-8d37-d95190a26875.jpg"
                alt="Суши фото 1"
              />
            </div>
            <div className="social-item">
              <img
                src="https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/6ad8bc54-e3f6-4d83-9b3f-b1751f98016e.jpg"
                alt="Суши фото 2"
              />
            </div>
            <div className="social-item">
              <img
                src="https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/21e49f63-9001-4af6-8055-814fca4ae3b9.jpg"
                alt="Суши фото 3"
              />
            </div>
            <div className="social-item">
              <img
                src="https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/b429e844-3bac-41b1-8939-c67c6f348a74.jpg"
                alt="Суши фото 4"
              />
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
            <li>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                Меню
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                О нас
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                Акции
              </a>
            </li>
            <li>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                Контакты
              </a>
            </li>
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