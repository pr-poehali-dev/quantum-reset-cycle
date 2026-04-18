CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  tag TEXT DEFAULT '',
  tag_color TEXT DEFAULT '#ff4d00',
  is_dish_of_day BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE promo_settings (
  id SERIAL PRIMARY KEY,
  is_active BOOLEAN DEFAULT TRUE,
  title TEXT DEFAULT 'УЧАСТВУЙ В РОЗЫГРЫШЕ',
  description TEXT DEFAULT 'При заказе от 1 200 ₽ ты получаешь уникальный купон для участия в розыгрыше призов.',
  min_order INTEGER DEFAULT 1200,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO menu_items (name, description, price, image_url, tag, tag_color, sort_order) VALUES
  ('Сет «Токио»', '12 нигири из лосося, тунца и угря. Подаётся с соусом понзу и маринованным имбирём.', 1490, 'https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/d5160c06-687d-490e-8d37-d95190a26875.jpg', 'Хит продаж', '#c0392b', 1),
  ('Спайси Дракон', 'Острый тунец, авокадо, огурец, сверху — запечённый лосось с соусом шрирача.', 990, 'https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/6ad8bc54-e3f6-4d83-9b3f-b1751f98016e.jpg', 'Огонь', '#2d31fa', 2),
  ('Сет «Сакура»', '32 ролла на выбор: Филадельфия, Калифорния, Радуга и Дракон. Идеально на двоих.', 2200, 'https://cdn.poehali.dev/projects/0aeb8543-6068-48d5-a688-c1d9f92bb928/files/6ad8bc54-e3f6-4d83-9b3f-b1751f98016e.jpg', 'Популярное', '#f5c842', 3);

INSERT INTO promo_settings (is_active, title, description, min_order) VALUES
  (TRUE, 'УЧАСТВУЙ В РОЗЫГРЫШЕ', 'При заказе от 1 200 ₽ ты получаешь уникальный купон для участия в розыгрыше призов. Оставь имя и телефон — мы пришлём купон!', 1200);