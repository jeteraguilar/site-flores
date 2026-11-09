-- Dados iniciais (idempotente). Fotos ficam nulas até a loja enviar as reais.
INSERT INTO categories (slug, name, description, sort_order) VALUES
('buques', 'Buquês', 'Buquês e arranjos para presentear em qualquer ocasião.', 1),
('plantas', 'Plantas', 'Folhagens e plantas ornamentais para casa e jardim.', 2),
('cactos-e-suculentas', 'Cactos e Suculentas', 'Pouca rega, muita personalidade.', 3),
('frutiferas', 'Frutíferas e Mudas', 'Mudas de frutíferas, horta e temperos.', 4),
('pelucias', 'Pelúcias e Presentes', 'Pelúcias para acompanhar flores e presentes.', 5),
('vasos-e-insumos', 'Vasos, Insumos e Acessórios', 'Vasos, terra, adubo e ferramentas de jardinagem.', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, description, featured, sort_order)
SELECT c.id, p.name, p.description, p.featured, p.sort_order
FROM (VALUES
  ('buques', 'Buquê de girassóis', 'Girassóis com margaridas em papel kraft.', true, 1),
  ('buques', 'Buquê de rosas', 'Rosas brancas e vermelhas embaladas para presente.', true, 2),
  ('plantas', 'Costela-de-adão (monstera)', 'Folhagem tropical para meia-sombra.', true, 1),
  ('cactos-e-suculentas', 'Cactos sortidos', 'Variedades em vaso pequeno.', true, 1),
  ('frutiferas', 'Mudas frutíferas', 'Limão, jabuticaba, acerola e outras.', false, 1),
  ('pelucias', 'Coelhinho de pelúcia', 'Embalado para presente.', true, 1),
  ('vasos-e-insumos', 'Vasos e terra adubada', 'Vasos de barro e cerâmica, terra e adubo.', false, 1)
) AS p(slug, name, description, featured, sort_order)
JOIN categories c ON c.slug = p.slug
WHERE NOT EXISTS (SELECT 1 FROM products);
