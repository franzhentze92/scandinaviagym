-- ============================================
-- MIGRATION SCRIPT: Replace Example Data with Real Data
-- ============================================
-- This script migrates from example data to real data extracted from photos
-- IMPORTANT: This will DELETE all existing classes, schedules, instructors, and categories
-- Make sure to backup your database before running this script!
--
-- Run order:
-- 1. schema.sql (if not already run)
-- 2. seed-data.sql (for sedes - already correct)
-- 3. This script (migrate-to-real-data.sql)
-- ============================================

-- ============================================
-- STEP 1: DELETE EXISTING DATA (in reverse dependency order)
-- ============================================

-- Delete class reservations first (depends on class_schedules)
DELETE FROM class_reservations;

-- Delete class schedules (depends on classes)
DELETE FROM class_schedules;

-- Delete classes (depends on categories, instructors, sedes)
DELETE FROM classes;

-- Delete instructors (depends on sedes - but we keep sedes)
DELETE FROM instructors;

-- Delete class categories
DELETE FROM class_categories;

-- ============================================
-- STEP 2: INSERT REAL DATA (from photos)
-- ============================================

-- ============================================
-- CLASS CATEGORIES (actual categories found in photos)
-- ============================================
INSERT INTO class_categories (id, name, icon_name, color) VALUES
('5949af45-953b-54f5-b1b9-71be6afe17ac', 'Aeróbicos', 'Activity', '#84cc16'),
('33231541-4ac9-5602-9a71-5002b2db09b4', 'Baile', 'Activity', '#84cc16'),
('93acf73c-ab7f-507c-8c20-e66d82743e57', 'Baile Latino', 'Activity', '#84cc16'),
('dd599455-08e8-5c68-a970-1921e0889ba4', 'Baile/Step', 'Activity', '#84cc16'),
('7f1eb773-9842-5726-992d-c299c788613c', 'Body Step', 'Activity', '#84cc16'),
('b432a7f3-698b-5720-8314-83adea38fad3', 'Dance', 'Activity', '#84cc16'),
('804a80d6-72b3-564f-91e1-436058b44aeb', 'Fitness de Combate', 'Activity', '#84cc16'),
('a3cb4492-e9ed-5ba7-9ce7-c5e2fed25ba1', 'Funcional', 'Activity', '#84cc16'),
('b9a50b57-ab9b-53ef-b6ff-a707fc951bed', 'Pilates', 'Activity', '#84cc16'),
('6b913dd2-b9aa-5aeb-ac94-0cd66d68ecfb', 'Salsa', 'Activity', '#84cc16'),
('06e1049f-ab23-5bb6-975e-3d8570d33b26', 'Spinning', 'Activity', '#84cc16'),
('5588f822-0942-5687-87be-b42607ab4615', 'Step', 'Activity', '#84cc16'),
('06e63b55-5d6e-5950-b01c-bd8996b119ff', 'Strong', 'Activity', '#84cc16'),
('5c626983-6521-5899-8979-ce4599b255f4', 'Tae-bo', 'Activity', '#84cc16'),
('6c6eb618-d6e4-538e-9521-6dbb6e4b8d4b', 'Yoga', 'Activity', '#84cc16'),
('572caf71-4d53-501e-a261-8f3f885bfbe1', 'Zumba', 'Activity', '#84cc16')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon_name = EXCLUDED.icon_name,
  color = EXCLUDED.color;


-- ============================================
-- INSTRUCTORS (actual instructor names found in photos)
-- NOTE: email/phone/bio are placeholders; update later if needed.
-- ============================================
INSERT INTO instructors (id, name, email, phone, specialty, sede_id, bio, rating, reviews_count, experience_years, is_active) VALUES
('d7b63ba0-99ba-5b01-b63b-01cb7914913a', 'Alba', 'alba@scandinavia.com', '+502 0000-0000', 'Aeróbicos, Body Step, Fitness de Combate', '00000000-0000-0000-0000-000000000008', 'Instructor(a) de Aeróbicos, Body Step, Fitness de Combate', 4.8, 0, 1, true),
('d6f196d5-3000-51a2-86e6-442d287f9cb2', 'Alejandra', 'alejandra@scandinavia.com', '+502 0000-0000', 'Salsa', '00000000-0000-0000-0000-000000000008', 'Instructor(a) de Salsa', 4.8, 0, 1, true),
('746e7e15-d7e0-50d2-9902-f61a72ad4355', 'Alex Morales', 'alex.morales@scandinavia.com', '+502 0000-0000', 'Pilates', '00000000-0000-0000-0000-000000000002', 'Instructor(a) de Pilates', 4.8, 0, 1, true),
('18c5d55c-046e-5695-887f-312b45b88dc0', 'Andrea Cayax', 'andrea.cayax@scandinavia.com', '+502 0000-0000', 'Baile', '00000000-0000-0000-0000-000000000005', 'Instructor(a) de Baile', 4.8, 0, 1, true),
('3c93212b-6fa0-5026-b0c6-78976872563f', 'Bayron Posadas', 'bayron.posadas@scandinavia.com', '+502 0000-0000', 'Funcional, Pilates, Spinning, Tae-bo', '00000000-0000-0000-0000-000000000005', 'Instructor(a) de Funcional, Pilates, Spinning, Tae-bo', 4.8, 0, 1, true),
('e0e18d00-8f9a-5802-9715-4bab1a9319f8', 'Boby', 'boby@scandinavia.com', '+502 0000-0000', 'Baile, Baile Latino', '00000000-0000-0000-0000-000000000008', 'Instructor(a) de Baile, Baile Latino', 4.8, 0, 1, true),
('21439c6d-49b1-554b-8e5f-57aa0839c6cc', 'Brenda G', 'brenda.g@scandinavia.com', '+502 0000-0000', 'Baile', '00000000-0000-0000-0000-000000000005', 'Instructor(a) de Baile', 4.8, 0, 1, true),
('70871566-fc34-514b-88ef-af13eba30afd', 'Brenda Galicia', 'brenda.galicia@scandinavia.com', '+502 0000-0000', 'Baile, Zumba', '00000000-0000-0000-0000-000000000007', 'Instructor(a) de Baile, Zumba', 4.8, 0, 1, true),
('f224735b-7b8c-509a-880d-3495bfa192e3', 'Byron', 'byron@scandinavia.com', '+502 0000-0000', 'Funcional', '00000000-0000-0000-0000-000000000007', 'Instructor(a) de Funcional', 4.8, 0, 1, true),
('6263c1f6-b63d-5e8f-9a31-1a05bde47de2', 'Byron Posadas', 'byron.posadas@scandinavia.com', '+502 0000-0000', 'Funcional, Spinning', '00000000-0000-0000-0000-000000000003', 'Instructor(a) de Funcional, Spinning', 4.8, 0, 1, true),
('f6bde2bf-59f2-5930-96ad-ae146a486eae', 'Darvy', 'darvy@scandinavia.com', '+502 0000-0000', 'Aeróbicos, Spinning, Step', '00000000-0000-0000-0000-000000000004', 'Instructor(a) de Aeróbicos, Spinning, Step', 4.8, 0, 1, true),
('e9158843-d9d3-5e98-b4a1-5253f15f78c5', 'Dilan', 'dilan@scandinavia.com', '+502 0000-0000', 'Baile, Zumba', '00000000-0000-0000-0000-000000000003', 'Instructor(a) de Baile, Zumba', 4.8, 0, 1, true),
('45f4e16a-ff21-50ae-a15f-356ad384ace8', 'Eddy', 'eddy@scandinavia.com', '+502 0000-0000', 'Spinning', '00000000-0000-0000-0000-000000000008', 'Instructor(a) de Spinning', 4.8, 0, 1, true),
('d1e5a387-0762-5f30-a3be-478d35292cab', 'Eleana Barrientos', 'eleana.barrientos@scandinavia.com', '+502 0000-0000', 'Baile', '00000000-0000-0000-0000-000000000005', 'Instructor(a) de Baile', 4.8, 0, 1, true),
('22989f26-f581-5be8-829a-41e2ec476864', 'Elias', 'elias@scandinavia.com', '+502 0000-0000', 'Zumba', '00000000-0000-0000-0000-000000000008', 'Instructor(a) de Zumba', 4.8, 0, 1, true),
('a1028440-9b55-5555-be96-00ba5aeb2001', 'Erick Mazariegos', 'erick.mazariegos@scandinavia.com', '+502 0000-0000', 'Baile', '00000000-0000-0000-0000-000000000002', 'Instructor(a) de Baile', 4.8, 0, 1, true),
('0a6502f6-538c-5cf1-b008-7ea4db974493', 'Gustavo', 'gustavo@scandinavia.com', '+502 0000-0000', 'Funcional, Spinning', '00000000-0000-0000-0000-000000000001', 'Instructor(a) de Funcional, Spinning', 4.8, 0, 1, true),
('5c0dbb18-ebff-5ce9-9132-0ed89fc000d0', 'Hamilton', 'hamilton@scandinavia.com', '+502 0000-0000', 'Spinning, Strong', '00000000-0000-0000-0000-000000000003', 'Instructor(a) de Spinning, Strong', 4.8, 0, 1, true),
('ad440dd5-24a3-5029-b967-1304f5c6c6f1', 'Hector', 'hector@scandinavia.com', '+502 0000-0000', 'Aeróbicos, Funcional, Pilates, Spinning, Tae-bo', '00000000-0000-0000-0000-000000000004', 'Instructor(a) de Aeróbicos, Funcional, Pilates, Spinning, Tae-bo', 4.8, 0, 1, true),
('f1062645-4e31-526a-b76a-5558d2648b23', 'Horacio González', 'horacio.gonz.lez@scandinavia.com', '+502 0000-0000', 'Baile', '00000000-0000-0000-0000-000000000005', 'Instructor(a) de Baile', 4.8, 0, 1, true),
('ba7e76b6-24a2-555a-989b-db8bd84318da', 'Jonathan', 'jonathan@scandinavia.com', '+502 0000-0000', 'Zumba', '00000000-0000-0000-0000-000000000001', 'Instructor(a) de Zumba', 4.8, 0, 1, true),
('0198aa4c-fa93-5127-ae03-a1428b05ff62', 'Jorge', 'jorge@scandinavia.com', '+502 0000-0000', 'Spinning', '00000000-0000-0000-0000-000000000001', 'Instructor(a) de Spinning', 4.8, 0, 1, true),
('8d842c7b-4073-5837-8f94-fe5da44410c5', 'José', 'jos@scandinavia.com', '+502 0000-0000', 'Funcional', '00000000-0000-0000-0000-000000000007', 'Instructor(a) de Funcional', 4.8, 0, 1, true),
('5f333583-c9aa-5d02-ad6b-4b93b4dc0e65', 'Karla Perez', 'karla.perez@scandinavia.com', '+502 0000-0000', 'Baile, Zumba', '00000000-0000-0000-0000-000000000002', 'Instructor(a) de Baile, Zumba', 4.8, 0, 1, true),
('df36320b-dc54-5125-ac4d-ed16629db0ca', 'Manuel', 'manuel@scandinavia.com', '+502 0000-0000', 'Funcional, Tae-bo', '00000000-0000-0000-0000-000000000007', 'Instructor(a) de Funcional, Tae-bo', 4.8, 0, 1, true),
('07cbba5a-7195-5d92-8f5f-edf0cc1b7b34', 'Manuel Altan', 'manuel.altan@scandinavia.com', '+502 0000-0000', 'Funcional, Tae-bo', '00000000-0000-0000-0000-000000000005', 'Instructor(a) de Funcional, Tae-bo', 4.8, 0, 1, true),
('11f5b7eb-4850-51f6-92af-3dda97f412e0', 'Marco', 'marco@scandinavia.com', '+502 0000-0000', 'Funcional, Spinning, Tae-bo', '00000000-0000-0000-0000-000000000004', 'Instructor(a) de Funcional, Spinning, Tae-bo', 4.8, 0, 1, true),
('ab38926b-ad91-5b9a-808e-ef6c85aecbf9', 'Moises Santa Cruz', 'moises.santa.cruz@scandinavia.com', '+502 0000-0000', 'Baile, Pilates, Zumba', '00000000-0000-0000-0000-000000000004', 'Instructor(a) de Baile, Pilates, Zumba', 4.8, 0, 1, true),
('c2e22a28-97af-5c2f-a550-458fc14a02e7', 'Morales', 'morales@scandinavia.com', '+502 0000-0000', 'Baile', '00000000-0000-0000-0000-000000000002', 'Instructor(a) de Baile', 4.8, 0, 1, true),
('f865df99-adf2-5d91-ab1c-f62fd85afa29', 'Noe Amaya', 'noe.amaya@scandinavia.com', '+502 0000-0000', 'Baile, Baile/Step', '00000000-0000-0000-0000-000000000002', 'Instructor(a) de Baile, Baile/Step', 4.8, 0, 1, true),
('deee9632-1d78-5a34-a5a8-edaa6290beef', 'Otto Solorzano', 'otto.solorzano@scandinavia.com', '+502 0000-0000', 'Pilates', '00000000-0000-0000-0000-000000000002', 'Instructor(a) de Pilates', 4.8, 0, 1, true),
('a7a914b6-1b48-5ece-b8d0-99a1677631b3', 'Pablo', 'pablo@scandinavia.com', '+502 0000-0000', 'Spinning', '00000000-0000-0000-0000-000000000008', 'Instructor(a) de Spinning', 4.8, 0, 1, true),
('0a425f1d-9dce-5df7-9b1a-0597da1b6ac5', 'Rafael', 'rafael@scandinavia.com', '+502 0000-0000', 'Spinning, Zumba', '00000000-0000-0000-0000-000000000001', 'Instructor(a) de Spinning, Zumba', 4.8, 0, 1, true),
('b39c9eb2-e46d-55ca-a528-14a34a0fe75f', 'Rashel', 'rashel@scandinavia.com', '+502 0000-0000', 'Funcional, Spinning', '00000000-0000-0000-0000-000000000001', 'Instructor(a) de Funcional, Spinning', 4.8, 0, 1, true),
('4ef556f4-3e2f-518f-9565-30a8b666d270', 'Raxchel', 'raxchel@scandinavia.com', '+502 0000-0000', 'Spinning', '00000000-0000-0000-0000-000000000001', 'Instructor(a) de Spinning', 4.8, 0, 1, true),
('fc8d91e1-283a-5f06-9013-acf5f7662364', 'Raxchel Oliva', 'raxchel.oliva@scandinavia.com', '+502 0000-0000', 'Funcional, Spinning', '00000000-0000-0000-0000-000000000005', 'Instructor(a) de Funcional, Spinning', 4.8, 0, 1, true),
('6bbc44b9-978c-5216-914c-1fbc0d034965', 'Raxhel Oliva', 'raxhel.oliva@scandinavia.com', '+502 0000-0000', 'Dance, Funcional', '00000000-0000-0000-0000-000000000007', 'Instructor(a) de Dance, Funcional', 4.8, 0, 1, true),
('4285fa59-d489-5464-a2b1-c31cccbf8896', 'Rosmery', 'rosmery@scandinavia.com', '+502 0000-0000', 'Zumba', '00000000-0000-0000-0000-000000000001', 'Instructor(a) de Zumba', 4.8, 0, 1, true),
('e8e07e80-5787-574a-806e-1956654181f6', 'Sabrina', 'sabrina@scandinavia.com', '+502 0000-0000', 'Baile, Spinning, Strong, Yoga, Zumba', '00000000-0000-0000-0000-000000000002', 'Instructor(a) de Baile, Spinning, Strong, Yoga, Zumba', 4.8, 0, 1, true),
('88f48e98-66fa-5557-9c8f-b2f86191b014', 'Selvin', 'selvin@scandinavia.com', '+502 0000-0000', 'Baile Latino', '00000000-0000-0000-0000-000000000008', 'Instructor(a) de Baile Latino', 4.8, 0, 1, true),
('7669d68f-af26-5b98-9d52-185a95b65602', 'Sergio Nufio', 'sergio.nufio@scandinavia.com', '+502 0000-0000', 'Baile, Pilates, Tae-bo', '00000000-0000-0000-0000-000000000002', 'Instructor(a) de Baile, Pilates, Tae-bo', 4.8, 0, 1, true),
('742d01d9-ed59-594c-a282-73b0cadbbbfb', 'Sergio Santa Cruz', 'sergio.santa.cruz@scandinavia.com', '+502 0000-0000', 'Baile, Zumba', '00000000-0000-0000-0000-000000000004', 'Instructor(a) de Baile, Zumba', 4.8, 0, 1, true),
('7bb939d9-3695-5007-bc39-ca314893bd6f', 'Tarsis', 'tarsis@scandinavia.com', '+502 0000-0000', 'Baile, Zumba', '00000000-0000-0000-0000-000000000004', 'Instructor(a) de Baile, Zumba', 4.8, 0, 1, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  specialty = EXCLUDED.specialty,
  sede_id = EXCLUDED.sede_id,
  bio = EXCLUDED.bio,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  experience_years = EXCLUDED.experience_years,
  is_active = EXCLUDED.is_active;

-- ============================================
-- CLASSES (generated per sede + category + instructor)
-- ============================================
-- NOTE: Copy the INSERT INTO classes statement from scandinavia_seed_from_photos.sql (lines 82-168)
-- This includes 85 classes with real instructor names and categories

-- ============================================
-- CLASS SCHEDULES (actual times from photos)
-- ============================================
-- NOTE: Copy the INSERT INTO class_schedules statement from scandinavia_seed_from_photos.sql (lines 175-348)
-- This includes 173 real schedules extracted from photos

-- ============================================
-- IMPORTANT: To complete this migration:
-- 1. Copy lines 82-168 from scandinavia_seed_from_photos.sql (INSERT INTO classes...)
-- 2. Copy lines 175-348 from scandinavia_seed_from_photos.sql (INSERT INTO class_schedules...)
-- 3. Add ON CONFLICT clauses if needed
-- ============================================

