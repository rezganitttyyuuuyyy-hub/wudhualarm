/*
# Add language column to puzzles and seed Arabic + multilingual puzzle versions

1. Modified Tables
- `puzzles`: add `language` column (text, default 'en') so puzzles can be stored per-language.
  - Add a composite index on (language, is_active) for efficient lookups.
  - Drop the existing unique constraint on (profile_id, puzzle_id) in puzzle_attempts is NOT touched (it stays).

2. Data
- Seed 15 Arabic-language puzzles (Islamic trivia) with language='ar'.
- Seed 15 English-language puzzles with language='en' (replaces the existing ones, using ON CONFLICT DO NOTHING so no duplicates).
- Seed French, Turkish, Urdu, Indonesian, German, Spanish versions of the same 15 puzzles.

3. Security
- No policy changes. The existing SELECT policy on puzzles (is_active = true, TO authenticated) covers the new rows automatically.

4. Notes
- The frontend will query puzzles WHERE language = <activeLang> AND is_active = true.
- If no puzzles exist for a given language, the app falls back to English.
*/

-- Add language column to puzzles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'puzzles' AND column_name = 'language') THEN
    ALTER TABLE puzzles ADD COLUMN language text NOT NULL DEFAULT 'en';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_puzzles_language_active ON puzzles(language, is_active);

-- Helper: upsert a puzzle by (question, language)
-- We use ON CONFLICT DO NOTHING since there is no natural unique key; instead we delete+reinsert per language batch.

-- Clear existing English puzzles (seeded in previous migration) to avoid duplicates
DELETE FROM puzzles WHERE language = 'en';

-- English puzzles
INSERT INTO puzzles (question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category, language) VALUES
('How many prayers are there in a day in Islam?', '3', '5', '7', '10', 'b', 'easy', 'islamic', 'en'),
('Which prayer is performed before sunrise?', 'Fajr', 'Dhuhr', 'Asr', 'Isha', 'a', 'easy', 'islamic', 'en'),
('What is the act of washing before prayer called?', 'Salah', 'Wudhu', 'Zakat', 'Sawm', 'b', 'easy', 'islamic', 'en'),
('Which prayer has the most rakats?', 'Fajr', 'Asr', 'Maghrib', 'Isha', 'd', 'medium', 'islamic', 'en'),
('What do Muslims face during prayer?', 'The Kaaba', 'The Mosque', 'The Sun', 'The Moon', 'a', 'easy', 'islamic', 'en'),
('How many pillars of Islam are there?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'en'),
('Which month do Muslims fast?', 'Rajab', 'Ramadan', 'Shaban', 'Muharram', 'b', 'easy', 'islamic', 'en'),
('What is the first pillar of Islam?', 'Prayer', 'Fasting', 'Shahada', 'Charity', 'c', 'easy', 'islamic', 'en'),
('How many times is prayer performed daily?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'en'),
('Which prayer is at noon?', 'Fajr', 'Dhuhr', 'Maghrib', 'Isha', 'b', 'easy', 'islamic', 'en'),
('What is the term for the call to prayer?', 'Adhan', 'Iqama', 'Takbir', 'Dua', 'a', 'medium', 'islamic', 'en'),
('How many rakats in Fajr prayer?', '2', '3', '4', '6', 'a', 'medium', 'islamic', 'en'),
('What must you do before touching the Quran?', 'Sleep', 'Wudhu', 'Eat', 'Run', 'b', 'easy', 'islamic', 'en'),
('Which direction is the Qibla?', 'North', 'South', 'Toward Kaaba', 'East', 'c', 'easy', 'islamic', 'en'),
('What is the reward for praying in congregation?', '10 times', '27 times', '50 times', '100 times', 'b', 'hard', 'islamic', 'en');

-- Arabic puzzles
INSERT INTO puzzles (question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category, language) VALUES
('كم عدد الصلوات في اليوم في الإسلام؟', '٣', '٥', '٧', '١٠', 'b', 'easy', 'islamic', 'ar'),
('أي صلاة تُؤدى قبل شروق الشمس؟', 'الفجر', 'الظهر', 'العصر', 'العشاء', 'a', 'easy', 'islamic', 'ar'),
('ما هو عمل الوضوء قبل الصلاة؟', 'الصلاة', 'الوضوء', 'الزكاة', 'الصوم', 'b', 'easy', 'islamic', 'ar'),
('أي صلاة لها أكثر عدد من الركعات؟', 'الفجر', 'العصر', 'المغرب', 'العشاء', 'd', 'medium', 'islamic', 'ar'),
('في أي اتجاه يوجه المسلمون أثناء الصلاة؟', 'الكعبة', 'المسجد', 'الشمس', 'القمر', 'a', 'easy', 'islamic', 'ar'),
('كم عدد أركان الإسلام؟', '٣', '٤', '٥', '٦', 'c', 'easy', 'islamic', 'ar'),
('في أي شهر يصوم المسلمون؟', 'رجب', 'رمضان', 'شعبان', 'محرم', 'b', 'easy', 'islamic', 'ar'),
('ما هو الركن الأول من أركان الإسلام؟', 'الصلاة', 'الصوم', 'الشهادة', 'الزكاة', 'c', 'easy', 'islamic', 'ar'),
('كم مرة تُؤدى الصلاة يومياً؟', '٣', '٤', '٥', '٦', 'c', 'easy', 'islamic', 'ar'),
('أي صلاة تُؤدى عند الظهيرة؟', 'الفجر', 'الظهر', 'المغرب', 'العشاء', 'b', 'easy', 'islamic', 'ar'),
('ما هو مصطلح نداء الصلاة؟', 'الأذان', 'الإقامة', 'التكبير', 'الدعاء', 'a', 'medium', 'islamic', 'ar'),
('كم ركعة في صلاة الفجر؟', '٢', '٣', '٤', '٦', 'a', 'medium', 'islamic', 'ar'),
('ماذا يجب أن تفعل قبل لمس القرآن؟', 'النوم', 'الوضوء', 'الأكل', 'الجري', 'b', 'easy', 'islamic', 'ar'),
('ما هو اتجاه القبلة؟', 'الشمال', 'الجنوب', 'نحو الكعبة', 'الشرق', 'c', 'easy', 'islamic', 'ar'),
('ما هو أجر الصلاة في جماعة؟', '١٠ مرات', '٢٧ مرة', '٥٠ مرة', '١٠٠ مرة', 'b', 'hard', 'islamic', 'ar');

-- French puzzles
INSERT INTO puzzles (question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category, language) VALUES
('Combien de prières y a-t-il par jour en Islam?', '3', '5', '7', '10', 'b', 'easy', 'islamic', 'fr'),
('Quelle prière est accomplie avant le lever du soleil?', 'Fajr', 'Dhuhr', 'Asr', 'Isha', 'a', 'easy', 'islamic', 'fr'),
('Comment appelle-t-on l''ablution avant la prière?', 'Salah', 'Wudhu', 'Zakat', 'Sawm', 'b', 'easy', 'islamic', 'fr'),
('Quelle prière a le plus de rakats?', 'Fajr', 'Asr', 'Maghrib', 'Isha', 'd', 'medium', 'islamic', 'fr'),
('Vers quoi les musulmans se tournent-ils pendant la prière?', 'La Kaaba', 'La Mosquée', 'Le Soleil', 'La Lune', 'a', 'easy', 'islamic', 'fr'),
('Combien de piliers l''Islam a-t-il?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'fr'),
('Quel mois les musulmans jeûnent-ils?', 'Rajab', 'Ramadan', 'Shaban', 'Muharram', 'b', 'easy', 'islamic', 'fr'),
('Quel est le premier pilier de l''Islam?', 'Prière', 'Jeûne', 'Shahada', 'Charité', 'c', 'easy', 'islamic', 'fr'),
('Combien de fois la prière est-elle accomplie par jour?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'fr'),
('Quelle prière est à midi?', 'Fajr', 'Dhuhr', 'Maghrib', 'Isha', 'b', 'easy', 'islamic', 'fr'),
('Quel est le terme pour l''appel à la prière?', 'Adhan', 'Iqama', 'Takbir', 'Dua', 'a', 'medium', 'islamic', 'fr'),
('Combien de rakats dans la prière du Fajr?', '2', '3', '4', '6', 'a', 'medium', 'islamic', 'fr'),
('Que devez-vous faire avant de toucher le Coran?', 'Dormir', 'Wudhu', 'Manger', 'Courir', 'b', 'easy', 'islamic', 'fr'),
('Quelle est la direction de la Qibla?', 'Nord', 'Sud', 'Vers la Kaaba', 'Est', 'c', 'easy', 'islamic', 'fr'),
('Quelle est la récompense de la prière en groupe?', '10 fois', '27 fois', '50 fois', '100 fois', 'b', 'hard', 'islamic', 'fr');

-- Turkish puzzles
INSERT INTO puzzles (question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category, language) VALUES
('İslam''da günde kaç namaz vardır?', '3', '5', '7', '10', 'b', 'easy', 'islamic', 'tr'),
('Güneş doğmadan önce kılınan namaz hangisidir?', 'Sabah', 'Öğle', 'İkindi', 'Yatsı', 'a', 'easy', 'islamic', 'tr'),
('Namazdan önce yapılan abdest eylemi nedir?', 'Namaz', 'Abdest', 'Zekat', 'Oruç', 'b', 'easy', 'islamic', 'tr'),
('Hangi namazın en çok rekatı vardır?', 'Sabah', 'İkindi', 'Akşam', 'Yatsı', 'd', 'medium', 'islamic', 'tr'),
('Müslümanlar namaz sırasında neye yönelir?', 'Kabe', 'Cami', 'Güneş', 'Ay', 'a', 'easy', 'islamic', 'tr'),
('İslam''ın kaç şartı vardır?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'tr'),
('Müslümanlar hangi ayda oruç tutar?', 'Recep', 'Ramazan', 'Şaban', 'Muharrem', 'b', 'easy', 'islamic', 'tr'),
('İslam''ın ilk şartı nedir?', 'Namaz', 'Oruç', 'Şehadet', 'Zekat', 'c', 'easy', 'islamic', 'tr'),
('Namaz günde kaç kez kılınır?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'tr'),
('Hangi namaz öğle vaktinde kılınır?', 'Sabah', 'Öğle', 'Akşam', 'Yatsı', 'b', 'easy', 'islamic', 'tr'),
('Ezana verilen terim nedir?', 'Ezan', 'Kamet', 'Tekbir', 'Dua', 'a', 'medium', 'islamic', 'tr'),
('Sabah namazında kaç rekat vardır?', '2', '3', '4', '6', 'a', 'medium', 'islamic', 'tr'),
('Kur''an''a dokunmadan önce ne yapmalısınız?', 'Uyumak', 'Abdest', 'Yemek', 'Koşmak', 'b', 'easy', 'islamic', 'tr'),
('Kıble yönü nedir?', 'Kuzey', 'Güney', 'Kabe''ye doğru', 'Doğu', 'c', 'easy', 'islamic', 'tr'),
('Cemaatle namaz kılmanın sevabı nedir?', '10 kat', '27 kat', '50 kat', '100 kat', 'b', 'hard', 'islamic', 'tr');

-- Urdu puzzles
INSERT INTO puzzles (question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category, language) VALUES
('اسلام میں ایک دن میں کتنی نمازیں ہیں؟', '٣', '٥', '٧', '١٠', 'b', 'easy', 'islamic', 'ur'),
('سورج طلوع ہونے سے پہلے کون سی نماز ادا کی جاتی ہے؟', 'فجر', 'ظہر', 'عصر', 'عشاء', 'a', 'easy', 'islamic', 'ur'),
('نماز سے پہلے وضو کے عمل کو کیا کہتے ہیں؟', 'نماز', 'وضو', 'زکوٰة', 'صوم', 'b', 'easy', 'islamic', 'ur'),
('کون سی نماز میں سب سے زیادہ رکعت ہیں؟', 'فجر', 'عصر', 'مغرب', 'عشاء', 'd', 'medium', 'islamic', 'ur'),
('نماز کے دوران مسلمان کس طرف منہ کرتے ہیں؟', 'کعبہ', 'مسجد', 'سورج', 'چاند', 'a', 'easy', 'islamic', 'ur'),
('اسلام کے کتنے ارکان ہیں؟', '٣', '٤', '٥', '٦', 'c', 'easy', 'islamic', 'ur'),
('مسلمان کس مہینے میں روزہ رکھتے ہیں؟', 'رجب', 'رمضان', 'شعبان', 'محرم', 'b', 'easy', 'islamic', 'ur'),
('اسلام کا پہلا رکن کیا ہے؟', 'نماز', 'روزہ', 'شہادت', 'زکوٰة', 'c', 'easy', 'islamic', 'ur'),
('نماز دن میں کتنی بار ادا کی جاتی ہے؟', '٣', '٤', '٥', '٦', 'c', 'easy', 'islamic', 'ur'),
('کون سی نماز دوپہر میں ادا کی جاتی ہے؟', 'فجر', 'ظہر', 'مغرب', 'عشاء', 'b', 'easy', 'islamic', 'ur'),
('نماز کے لیے پکارنے کے عمل کو کیا کہتے ہیں؟', 'اذان', 'اقامت', 'تکبیر', 'دعا', 'a', 'medium', 'islamic', 'ur'),
('فجر کی نماز میں کتنی رکعت ہیں؟', '٢', '٣', '٤', '٦', 'a', 'medium', 'islamic', 'ur'),
('قرآن کو چھونے سے پہلے کیا کرنا چاہیے؟', 'سونا', 'وضو', 'کھانا', 'دوڑ', 'b', 'easy', 'islamic', 'ur'),
('قبلہ کی سمت کیا ہے؟', 'شمال', 'جنوب', 'کعبہ کی طرف', 'مشرق', 'c', 'easy', 'islamic', 'ur'),
('جماعت سے نماز پڑھنے کا اجر کیا ہے؟', '١٠ گنا', '٢٧ گنا', '٥٠ گنا', '١٠٠ گنا', 'b', 'hard', 'islamic', 'ur');

-- Indonesian puzzles
INSERT INTO puzzles (question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category, language) VALUES
('Berapa banyak sholat dalam sehari dalam Islam?', '3', '5', '7', '10', 'b', 'easy', 'islamic', 'id'),
('Sholat mana yang dilakukan sebelum matahari terbit?', 'Subuh', 'Zuhur', 'Asar', 'Isya', 'a', 'easy', 'islamic', 'id'),
('Apa nama tindakan berwudhu sebelum sholat?', 'Salah', 'Wudhu', 'Zakat', 'Puasa', 'b', 'easy', 'islamic', 'id'),
('Sholat mana yang memiliki rakaat terbanyak?', 'Subuh', 'Asar', 'Magrib', 'Isya', 'd', 'medium', 'islamic', 'id'),
('Ke mana umat Islam menghadap saat sholat?', 'Ka''bah', 'Masjid', 'Matahari', 'Bulan', 'a', 'easy', 'islamic', 'id'),
('Berapa rukun Islam?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'id'),
('Bulan apa umat Islam berpuasa?', 'Rajab', 'Ramadan', 'Sya''ban', 'Muharram', 'b', 'easy', 'islamic', 'id'),
('Apa rukun Islam pertama?', 'Sholat', 'Puasa', 'Syahadat', 'Zakat', 'c', 'easy', 'islamic', 'id'),
('Berapa kali sholat dilakukan sehari?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'id'),
('Sholat mana yang dilakukan di siang hari?', 'Subuh', 'Zuhur', 'Magrib', 'Isya', 'b', 'easy', 'islamic', 'id'),
('Apa istilah untuk panggilan sholat?', 'Adzan', 'Iqamah', 'Takbir', 'Doa', 'a', 'medium', 'islamic', 'id'),
('Berapa rakaat dalam sholat Subuh?', '2', '3', '4', '6', 'a', 'medium', 'islamic', 'id'),
('Apa yang harus Anda lakukan sebelum menyentuh Al-Quran?', 'Tidur', 'Wudhu', 'Makan', 'Lari', 'b', 'easy', 'islamic', 'id'),
('Arah mana kiblat?', 'Utara', 'Selatan', 'Ke Ka''bah', 'Timur', 'c', 'easy', 'islamic', 'id'),
('Apa pahala sholat berjamaah?', '10 kali', '27 kali', '50 kali', '100 kali', 'b', 'hard', 'islamic', 'id');

-- German puzzles
INSERT INTO puzzles (question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category, language) VALUES
('Wie viele Gebete gibt es pro Tag im Islam?', '3', '5', '7', '10', 'b', 'easy', 'islamic', 'de'),
('Welches Gebet wird vor Sonnenaufgang verrichtet?', 'Fadschr', 'Zuhr', 'Asr', 'Ischa', 'a', 'easy', 'islamic', 'de'),
('Wie heißt die Waschung vor dem Gebet?', 'Salah', 'Wudhu', 'Zakat', 'Sawm', 'b', 'easy', 'islamic', 'de'),
('Welches Gebet hat die meisten Rakats?', 'Fadschr', 'Asr', 'Maghrib', 'Ischa', 'd', 'medium', 'islamic', 'de'),
('Wohin wenden sich Muslime beim Gebet?', 'Zur Kaaba', 'Zur Moschee', 'Zur Sonne', 'Zum Mond', 'a', 'easy', 'islamic', 'de'),
('Wie viele Säulen hat der Islam?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'de'),
('In welchem Monat fasten Muslime?', 'Rajab', 'Ramadan', 'Scha''ban', 'Muharram', 'b', 'easy', 'islamic', 'de'),
('Was ist die erste Säule des Islam?', 'Gebet', 'Fasten', 'Schahada', 'Almosen', 'c', 'easy', 'islamic', 'de'),
('Wie oft wird das Gebet täglich verrichtet?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'de'),
('Welches Gebet ist um die Mittagszeit?', 'Fadschr', 'Zuhr', 'Maghrib', 'Ischa', 'b', 'easy', 'islamic', 'de'),
('Wie lautet der Begriff für den Gebetsruf?', 'Adhan', 'Iqama', 'Takbir', 'Dua', 'a', 'medium', 'islamic', 'de'),
('Wie viele Rakats hat das Fadschr-Gebet?', '2', '3', '4', '6', 'a', 'medium', 'islamic', 'de'),
('Was müssen Sie tun, bevor Sie den Koran berühren?', 'Schlafen', 'Wudhu', 'Essen', 'Laufen', 'b', 'easy', 'islamic', 'de'),
('In welche Richtung zeigt die Qibla?', 'Norden', 'Süden', 'Zur Kaaba', 'Osten', 'c', 'easy', 'islamic', 'de'),
('Was ist der Lohn für das Gebet in der Gemeinschaft?', '10-fach', '27-fach', '50-fach', '100-fach', 'b', 'hard', 'islamic', 'de');

-- Spanish puzzles
INSERT INTO puzzles (question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category, language) VALUES
('¿Cuántas oraciones hay al día en el Islam?', '3', '5', '7', '10', 'b', 'easy', 'islamic', 'es'),
('¿Qué oración se realiza antes del amanecer?', 'Fajr', 'Dhuhr', 'Asr', 'Isha', 'a', 'easy', 'islamic', 'es'),
('¿Cómo se llama el acto de lavarse antes de la oración?', 'Salah', 'Wudhu', 'Zakat', 'Sawm', 'b', 'easy', 'islamic', 'es'),
('¿Qué oración tiene más rakats?', 'Fajr', 'Asr', 'Maghrib', 'Isha', 'd', 'medium', 'islamic', 'es'),
('Hacia dónde se orientan los musulmanes durante la oración?', 'La Kaaba', 'La Mezquita', 'El Sol', 'La Luna', 'a', 'easy', 'islamic', 'es'),
('¿Cuántos pilares tiene el Islam?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'es'),
('¿En qué mes ayunan los musulmanes?', 'Rajab', 'Ramadán', 'Sha''ban', 'Muharram', 'b', 'easy', 'islamic', 'es'),
('¿Cuál es el primer pilar del Islam?', 'Oración', 'Ayuno', 'Shahada', 'Caridad', 'c', 'easy', 'islamic', 'es'),
('¿Cuántas veces se realiza la oración diariamente?', '3', '4', '5', '6', 'c', 'easy', 'islamic', 'es'),
('¿Qué oración es al mediodía?', 'Fajr', 'Dhuhr', 'Maghrib', 'Isha', 'b', 'easy', 'islamic', 'es'),
('¿Cuál es el término para el llamado a la oración?', 'Adhan', 'Iqama', 'Takbir', 'Dua', 'a', 'medium', 'islamic', 'es'),
('¿Cuántos rakats tiene la oración del Fajr?', '2', '3', '4', '6', 'a', 'medium', 'islamic', 'es'),
('¿Qué debes hacer antes de tocar el Corán?', 'Dormir', 'Wudhu', 'Comer', 'Correr', 'b', 'easy', 'islamic', 'es'),
('¿Cuál es la dirección de la Qibla?', 'Norte', 'Sur', 'Hacia la Kaaba', 'Este', 'c', 'easy', 'islamic', 'es'),
('¿Cuál es la recompensa por rezar en congregación?', '10 veces', '27 veces', '50 veces', '100 veces', 'b', 'hard', 'islamic', 'es');
