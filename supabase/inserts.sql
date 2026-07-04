SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict bk3jDwkrdQzZ8Qvl702o6CEU1fcyd79rXO3y1fvbKFmowiGX5oD05xaHJMpXObr

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'a34fc050-1e5b-4f7a-a11c-edd2b1758bd5', 'authenticated', 'authenticated', 'juan.hernandez@correo.cl', '$2a$10$0QVNBkMFqp14kf0tQtL2H.JuTdcRR/Q74GWPfKjYJG9nRhkam17Rm', '2026-05-29 00:39:36.214999+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-18 00:23:45.716752+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-29 00:39:36.21178+00', '2026-06-18 00:23:45.733282+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', 'authenticated', 'authenticated', 'maria.gonzalez@vcm.cl', '$2a$10$GcMoFCE/oBCloBajveqYVuTJGAtajept5jnpPlcgUlYKcpl1dQ2gK', '2026-05-29 00:37:38.136076+00', NULL, '', NULL, 'ead0570e889ad5ea559d3c99490c423699b318db81918f1cb5aad4bf', '2026-06-04 19:20:45.078278+00', '', '', NULL, '2026-07-02 19:37:19.915154+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-29 00:37:38.112272+00', '2026-07-02 19:37:19.941538+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '714bbba3-32b8-43cb-9084-dabc371a3118', 'authenticated', 'authenticated', 'carlos.munoz@vcm.cl', '$2a$10$DOg0BfgrbOzMbFZkJ6zd7O6pKrg/ptXF3zpSYrDqZ3BNLjJqGVIu6', '2026-05-29 00:38:08.902216+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-02 19:42:52.321483+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-29 00:38:08.898843+00', '2026-07-02 19:42:52.343609+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '71350bdc-762a-4d27-9974-276ce996f1f2', 'authenticated', 'authenticated', 'canki.test@gmail.com', '$2a$10$g8QHmkR/xv9Ns1ZHghfKduvqv4cuthUDgcR3jXLRh63e18ttqBcN2', '2026-05-28 17:17:22.228067+00', '2026-05-28 17:16:24.720301+00', '', NULL, '', NULL, '', '', NULL, '2026-05-28 17:17:22.234025+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-28 17:16:24.685538+00', '2026-05-28 17:17:22.246567+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6b23dfd4-5052-4853-937e-d32b3801c10f', 'authenticated', 'authenticated', 'isabel.contreras@vcm.cl', '$2a$10$7niD.wjXr9UZOUP5HuPtXeggbqCE5CceE8XjFJR7b7TOOkPfZjrpi', '2026-05-29 00:40:17.799191+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-29 00:40:17.793843+00', '2026-05-29 00:40:17.800012+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', 'authenticated', 'authenticated', 'bnjmnvd6@gmail.com', '$2a$10$zM6.OCgVYl4MQKfPrDM24eT8TXX1SC9X4KdCZviqhv6YhRXfwny6m', '2026-06-16 20:04:39.244374+00', NULL, '', '2026-06-16 20:03:38.607656+00', '', NULL, '', '', NULL, '2026-07-02 18:07:49.002128+00', '{"provider": "email", "providers": ["email"]}', '{"rut": "214294087", "sub": "0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb", "email": "bnjmnvd6@gmail.com", "nombres": "Benjamín", "telefono": "+56964121888", "apellidos": "Oviedo", "email_verified": true, "phone_verified": false}', NULL, '2026-06-16 20:03:38.582638+00', '2026-07-02 19:06:24.550671+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c3dc3fa1-b864-4c3f-ac1a-116183412417', 'authenticated', 'authenticated', 'correodepruebatesting@gmail.com', '$2a$10$qPFAyJkutTXybFGUd.Vf4eNaMqRdDcR9.gkAiv16SjaY/CDngrckO', '2026-07-02 19:50:18.887929+00', NULL, 'faa1fdf32b6dc969d300bc7c9f5538972501e2a66d8691e775a07575', '2026-07-02 19:50:17.901326+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"sub": "c3dc3fa1-b864-4c3f-ac1a-116183412417", "email": "correodepruebatesting@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2026-07-02 19:50:17.833222+00', '2026-07-02 19:50:18.232546+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'eb935a55-6f06-4ed6-b1f0-b263766cf6ae', 'authenticated', 'authenticated', 'valentina.torres@correo.cl', '$2a$10$Ymxlk/HwlQoHa/PetZjWxO5VOmWeMwlbZxxjkQ568lWwKF66MkOYe', '2026-05-29 00:39:48.459993+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-01 01:51:54.982286+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-29 00:39:48.457019+00', '2026-07-01 02:49:31.319337+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'bc8b6769-36fb-4503-8fed-a2fda8502528', 'authenticated', 'authenticated', 'roberto.silva@vcm.cl', '$2a$10$WHdQCO3QSamLtocROEd/KOBb6bkVFeM0.asQA4DSanJFvWEwiMIie', '2026-05-29 00:38:45.163172+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-29 00:38:45.158758+00', '2026-05-29 00:38:45.170793+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c3ac89ea-9e36-445a-9502-1a6c06e77975', 'authenticated', 'authenticated', 'autoridadprueba@gmail.com', '$2a$06$mbuWLWY5a/j8WEN6Oyko3u.Xv4lldWcQHrZ89W6d/1OIa3Wt6Gugi', '2026-06-25 06:09:56.109569+00', NULL, '812a57735620ec2759908fd08fe4b204d46eed7efce745598633d38c', '2026-06-25 05:51:59.35262+00', '', NULL, '', '', NULL, '2026-07-02 19:58:12.347052+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "c3ac89ea-9e36-445a-9502-1a6c06e77975", "email": "autoridadprueba@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2026-06-25 05:51:59.341338+00', '2026-07-02 19:58:12.390786+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '88b9eae0-3dde-43b4-93ff-2ed952f2f469', 'authenticated', 'authenticated', 'diego.ramirez@correo.cl', '$2a$10$oybsjq4upt/aSfm5nMwut.ca/1KbuuH4Vk13OE7FSDEh3Q2DudpHy', '2026-05-29 00:40:01.744803+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-29 00:40:01.74118+00', '2026-05-29 00:40:01.745644+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '86beb092-b6d2-4127-be5b-6fbd5bdb967c', 'authenticated', 'authenticated', 'patricia.rojas@vcm.cl', '$2a$10$JsjxrOG2Z6HTm2Wyn57wXeeixZkHM3CFnNbRhSTtFM5B6aQuLylYm', '2026-05-29 00:38:27.538546+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-19 03:09:10.201258+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-29 00:38:27.532004+00', '2026-06-19 16:46:18.283301+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '5db4a5d6-d967-42e8-9d00-25bbfde075e4', 'authenticated', 'authenticated', 'autoridaducmprueba@gmail.com', '$2a$10$/06wSB4SLdNWPzDL20IGyuHqYkJZ.2Kpc5lKCDgt3lE9c1JroBdqa', NULL, NULL, '06411e482a2a1f809e3d1fc46e07a5c02d2a82c324979f018bb8ddb9', '2026-06-25 05:50:32.604341+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"sub": "5db4a5d6-d967-42e8-9d00-25bbfde075e4", "email": "autoridaducmprueba@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2026-06-25 05:50:32.560945+00', '2026-06-25 05:50:32.857337+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '47cbe9d5-3135-4f7a-b0c0-e1686de7ec65', 'authenticated', 'authenticated', 'francisco.lopez@vcm.cl', '$2a$10$Y1cycenyyf5jIBcRnK7wBObmpchkoRKMWB15KtavK4cFjJyxxa05G', '2026-05-29 00:39:22.354384+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-19 16:53:07.618013+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-29 00:39:22.351105+00', '2026-06-19 16:53:07.636824+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '5898288a-b920-4e1e-bde0-d505f00f9367', 'authenticated', 'authenticated', 'andrea.perez@vcm.cl', '$2a$10$y27ib4wXaaBSGIcNPYJLkuSEbAXrvtkQu3unNzvSu/LxQ8BITHP/a', '2026-05-29 00:39:01.551828+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-19 17:20:42.716006+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-05-29 00:39:01.548204+00', '2026-06-19 18:22:59.292499+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '4605c97b-42ff-4058-b157-122fbb47d569', 'authenticated', 'authenticated', 'bnjmnvd2@gmail.com', '$2a$10$zULSjKcQMRPndpdGL5ZBA.tFDK849q2H.s/8/uBFoj.bPcJcS7eFC', '2026-06-25 19:11:33.559347+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-26 00:09:09.322274+00', '{"provider": "email", "providers": ["email"]}', '{"rut": "214294086", "sub": "4605c97b-42ff-4058-b157-122fbb47d569", "email": "bnjmnvd2@gmail.com", "nombres": "Usuario", "telefono": "+56964121881", "apellidos": "Prueba", "email_verified": true, "phone_verified": false}', NULL, '2026-06-25 19:10:38.525471+00', '2026-06-26 00:09:09.326097+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '38450548-79d5-4fb4-9aab-77e4916032f2', 'authenticated', 'authenticated', 'correotestingvcm@gmail.com', '$2a$10$lyhJkqVKDneIiPa8omc40OpuvgqLL0jP.yolVl0/BpHTACvY851/m', '2026-07-02 17:33:02.894778+00', NULL, '', NULL, '', '2026-07-02 19:18:38.468679+00', '', '', NULL, '2026-07-02 19:19:34.624408+00', '{"provider": "email", "providers": ["email"]}', '{"rut": "192266033", "sub": "38450548-79d5-4fb4-9aab-77e4916032f2", "email": "correotestingvcm@gmail.com", "nombres": "Benjamin Sebastian", "telefono": "+56964121888", "apellidos": "Oviedo Oviedo", "email_verified": true, "phone_verified": false}', NULL, '2026-07-02 17:32:43.105124+00', '2026-07-02 19:19:34.646268+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '5559aabb-f80d-460e-b6ab-06fef4a8d5fd', 'authenticated', 'authenticated', 'bnjmnvd@gmail.com', '$2a$10$./OPricPk6Fp0wCyCYzPDukuGhhWGlSqPWfQv4Xad/WgiHy42ImMK', '2026-07-01 04:03:52.52472+00', NULL, '', '2026-07-01 04:02:51.792413+00', '', '2026-07-02 02:58:43.865506+00', '', '', NULL, '2026-07-03 01:58:41.126315+00', '{"provider": "email", "providers": ["email"]}', '{"rut": "195745501", "sub": "5559aabb-f80d-460e-b6ab-06fef4a8d5fd", "email": "bnjmnvd@gmail.com", "nombres": "Nicolas", "telefono": "+56912121212", "apellidos": "Oviedo", "email_verified": true, "phone_verified": false}', NULL, '2026-07-01 04:02:51.725162+00', '2026-07-03 01:58:41.224768+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'dfec9fa3-c1c9-4678-8c72-9367cf355512', 'authenticated', 'authenticated', 'pcarvajall@utem.cl', '$2a$10$vQ2l0fPt1DI96rAEsPDe0uQzOAJxrShwq0WWDX0NUm1qCDPTl0jiu', '2026-06-30 02:11:46.283204+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-30 02:45:04.264272+00', '{"provider": "email", "providers": ["email"]}', '{"rut": "213259776", "sub": "dfec9fa3-c1c9-4678-8c72-9367cf355512", "email": "pcarvajall@utem.cl", "nombres": "pedro ariel", "telefono": "+56934692623", "apellidos": "carvajal lagos", "email_verified": true, "phone_verified": false}', NULL, '2026-06-30 02:11:12.635356+00', '2026-06-30 02:45:04.299551+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '595ea6a1-c27f-43be-93bf-a83af60d3043', 'authenticated', 'authenticated', 'ignaciocarlos016@gmail.com', '$2a$10$KOAEGpI5Zn4In6ycP9ev7u0cOMQQu88vh1NaqSUf.eWGSDwgcMHBa', '2026-06-25 21:02:47.976903+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-30 04:49:48.433133+00', '{"provider": "email", "providers": ["email"]}', '{"rut": "212492949", "sub": "595ea6a1-c27f-43be-93bf-a83af60d3043", "email": "ignaciocarlos016@gmail.com", "nombres": "Carlos Ignacio", "telefono": "+56945701201", "apellidos": "Cabello Troncoso", "email_verified": true, "phone_verified": false}', NULL, '2026-06-25 21:02:17.82653+00', '2026-06-30 04:49:48.504625+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('71350bdc-762a-4d27-9974-276ce996f1f2', '71350bdc-762a-4d27-9974-276ce996f1f2', '{"sub": "71350bdc-762a-4d27-9974-276ce996f1f2", "email": "canki.test@gmail.com", "email_verified": true, "phone_verified": false}', 'email', '2026-05-28 17:16:24.717002+00', '2026-05-28 17:16:24.717053+00', '2026-05-28 17:16:24.717053+00', 'ac0c4562-d4de-4187-9bfe-a9f42aa262a1'),
	('1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', '{"sub": "1e3eecb5-14cd-40a7-91c6-f75966d9dfa6", "email": "maria.gonzalez@vcm.cl", "email_verified": false, "phone_verified": false}', 'email', '2026-05-29 00:37:38.129829+00', '2026-05-29 00:37:38.129882+00', '2026-05-29 00:37:38.129882+00', '6b6c1903-84e3-474b-a511-ee43818008d7'),
	('714bbba3-32b8-43cb-9084-dabc371a3118', '714bbba3-32b8-43cb-9084-dabc371a3118', '{"sub": "714bbba3-32b8-43cb-9084-dabc371a3118", "email": "carlos.munoz@vcm.cl", "email_verified": false, "phone_verified": false}', 'email', '2026-05-29 00:38:08.900649+00', '2026-05-29 00:38:08.9007+00', '2026-05-29 00:38:08.9007+00', '3f576832-e355-4a08-9b4a-23430decb77c'),
	('86beb092-b6d2-4127-be5b-6fbd5bdb967c', '86beb092-b6d2-4127-be5b-6fbd5bdb967c', '{"sub": "86beb092-b6d2-4127-be5b-6fbd5bdb967c", "email": "patricia.rojas@vcm.cl", "email_verified": false, "phone_verified": false}', 'email', '2026-05-29 00:38:27.537174+00', '2026-05-29 00:38:27.537222+00', '2026-05-29 00:38:27.537222+00', 'bb9801c8-b46f-4e4d-80dd-4bbca274e9e7'),
	('bc8b6769-36fb-4503-8fed-a2fda8502528', 'bc8b6769-36fb-4503-8fed-a2fda8502528', '{"sub": "bc8b6769-36fb-4503-8fed-a2fda8502528", "email": "roberto.silva@vcm.cl", "email_verified": false, "phone_verified": false}', 'email', '2026-05-29 00:38:45.161527+00', '2026-05-29 00:38:45.161574+00', '2026-05-29 00:38:45.161574+00', '234f49df-b5ec-4ad3-b247-349778073e4b'),
	('5898288a-b920-4e1e-bde0-d505f00f9367', '5898288a-b920-4e1e-bde0-d505f00f9367', '{"sub": "5898288a-b920-4e1e-bde0-d505f00f9367", "email": "andrea.perez@vcm.cl", "email_verified": false, "phone_verified": false}', 'email', '2026-05-29 00:39:01.550219+00', '2026-05-29 00:39:01.550267+00', '2026-05-29 00:39:01.550267+00', '5fd18a85-f96c-440a-b870-e395bf795672'),
	('47cbe9d5-3135-4f7a-b0c0-e1686de7ec65', '47cbe9d5-3135-4f7a-b0c0-e1686de7ec65', '{"sub": "47cbe9d5-3135-4f7a-b0c0-e1686de7ec65", "email": "francisco.lopez@vcm.cl", "email_verified": false, "phone_verified": false}', 'email', '2026-05-29 00:39:22.352996+00', '2026-05-29 00:39:22.353041+00', '2026-05-29 00:39:22.353041+00', '330f45ff-3fe7-4fd2-94c6-ce077023d4e2'),
	('a34fc050-1e5b-4f7a-a11c-edd2b1758bd5', 'a34fc050-1e5b-4f7a-a11c-edd2b1758bd5', '{"sub": "a34fc050-1e5b-4f7a-a11c-edd2b1758bd5", "email": "juan.hernandez@correo.cl", "email_verified": false, "phone_verified": false}', 'email', '2026-05-29 00:39:36.213497+00', '2026-05-29 00:39:36.213546+00', '2026-05-29 00:39:36.213546+00', '8ca85074-b500-485d-ae50-714582624ff4'),
	('eb935a55-6f06-4ed6-b1f0-b263766cf6ae', 'eb935a55-6f06-4ed6-b1f0-b263766cf6ae', '{"sub": "eb935a55-6f06-4ed6-b1f0-b263766cf6ae", "email": "valentina.torres@correo.cl", "email_verified": false, "phone_verified": false}', 'email', '2026-05-29 00:39:48.45811+00', '2026-05-29 00:39:48.45816+00', '2026-05-29 00:39:48.45816+00', 'c60f976a-e840-4abc-9492-22725f0ddf60'),
	('88b9eae0-3dde-43b4-93ff-2ed952f2f469', '88b9eae0-3dde-43b4-93ff-2ed952f2f469', '{"sub": "88b9eae0-3dde-43b4-93ff-2ed952f2f469", "email": "diego.ramirez@correo.cl", "email_verified": false, "phone_verified": false}', 'email', '2026-05-29 00:40:01.743086+00', '2026-05-29 00:40:01.743144+00', '2026-05-29 00:40:01.743144+00', 'af75d821-dad4-445a-bc97-e1fa52e58653'),
	('6b23dfd4-5052-4853-937e-d32b3801c10f', '6b23dfd4-5052-4853-937e-d32b3801c10f', '{"sub": "6b23dfd4-5052-4853-937e-d32b3801c10f", "email": "isabel.contreras@vcm.cl", "email_verified": false, "phone_verified": false}', 'email', '2026-05-29 00:40:17.797654+00', '2026-05-29 00:40:17.797707+00', '2026-05-29 00:40:17.797707+00', '5fbedcb3-ba8d-4d4d-bfc2-eeb45e1d7c6f'),
	('dfec9fa3-c1c9-4678-8c72-9367cf355512', 'dfec9fa3-c1c9-4678-8c72-9367cf355512', '{"rut": "213259776", "sub": "dfec9fa3-c1c9-4678-8c72-9367cf355512", "email": "pcarvajall@utem.cl", "nombres": "pedro ariel", "telefono": "+56934692623", "apellidos": "carvajal lagos", "email_verified": true, "phone_verified": false}', 'email', '2026-06-30 02:11:12.787296+00', '2026-06-30 02:11:12.787348+00', '2026-06-30 02:11:12.787348+00', 'b4b19ca1-1d97-4fe3-b90b-6157bda1c091'),
	('0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '{"rut": "214294087", "sub": "0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb", "email": "bnjmnvd6@gmail.com", "nombres": "Benjamín", "telefono": "+56964121888", "apellidos": "Oviedo", "email_verified": true, "phone_verified": false}', 'email', '2026-06-16 20:03:38.600575+00', '2026-06-16 20:03:38.600632+00', '2026-06-16 20:03:38.600632+00', 'c80175ea-e47e-4efc-8de3-d15b073cf556'),
	('5db4a5d6-d967-42e8-9d00-25bbfde075e4', '5db4a5d6-d967-42e8-9d00-25bbfde075e4', '{"sub": "5db4a5d6-d967-42e8-9d00-25bbfde075e4", "email": "autoridaducmprueba@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-25 05:50:32.593046+00', '2026-06-25 05:50:32.593095+00', '2026-06-25 05:50:32.593095+00', '7a1829dc-e81e-4536-9ae9-dc03b3d7740a'),
	('c3ac89ea-9e36-445a-9502-1a6c06e77975', 'c3ac89ea-9e36-445a-9502-1a6c06e77975', '{"sub": "c3ac89ea-9e36-445a-9502-1a6c06e77975", "email": "autoridadprueba@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-25 05:51:59.350057+00', '2026-06-25 05:51:59.35011+00', '2026-06-25 05:51:59.35011+00', 'bad6d803-e5d4-4334-879b-6ca4ac55d68d'),
	('4605c97b-42ff-4058-b157-122fbb47d569', '4605c97b-42ff-4058-b157-122fbb47d569', '{"rut": "214294086", "sub": "4605c97b-42ff-4058-b157-122fbb47d569", "email": "bnjmnvd2@gmail.com", "nombres": "Usuario", "telefono": "+56964121881", "apellidos": "Prueba", "email_verified": true, "phone_verified": false}', 'email', '2026-06-25 19:10:38.608757+00', '2026-06-25 19:10:38.608808+00', '2026-06-25 19:10:38.608808+00', 'e53bfc5c-6ea6-4300-bfcf-91de11d09219'),
	('595ea6a1-c27f-43be-93bf-a83af60d3043', '595ea6a1-c27f-43be-93bf-a83af60d3043', '{"rut": "212492949", "sub": "595ea6a1-c27f-43be-93bf-a83af60d3043", "email": "ignaciocarlos016@gmail.com", "nombres": "Carlos Ignacio", "telefono": "+56945701201", "apellidos": "Cabello Troncoso", "email_verified": true, "phone_verified": false}', 'email', '2026-06-25 21:02:17.871126+00', '2026-06-25 21:02:17.871175+00', '2026-06-25 21:02:17.871175+00', '0d3aaa43-8ece-4cfa-aeaa-baada0b71fc4'),
	('5559aabb-f80d-460e-b6ab-06fef4a8d5fd', '5559aabb-f80d-460e-b6ab-06fef4a8d5fd', '{"rut": "195745501", "sub": "5559aabb-f80d-460e-b6ab-06fef4a8d5fd", "email": "bnjmnvd@gmail.com", "nombres": "Nicolas", "telefono": "+56912121212", "apellidos": "Oviedo", "email_verified": true, "phone_verified": false}', 'email', '2026-07-01 04:02:51.78412+00', '2026-07-01 04:02:51.784169+00', '2026-07-01 04:02:51.784169+00', 'c5630ab8-5826-42cc-8ae0-56876e7ede36'),
	('38450548-79d5-4fb4-9aab-77e4916032f2', '38450548-79d5-4fb4-9aab-77e4916032f2', '{"rut": "192266033", "sub": "38450548-79d5-4fb4-9aab-77e4916032f2", "email": "correotestingvcm@gmail.com", "nombres": "Benjamin Sebastian", "telefono": "+56964121888", "apellidos": "Oviedo Oviedo", "email_verified": true, "phone_verified": false}', 'email', '2026-07-02 17:32:43.180308+00', '2026-07-02 17:32:43.180357+00', '2026-07-02 17:32:43.180357+00', '1e4999b3-e90b-40f5-a47b-11d5f377de8d'),
	('c3dc3fa1-b864-4c3f-ac1a-116183412417', 'c3dc3fa1-b864-4c3f-ac1a-116183412417', '{"sub": "c3dc3fa1-b864-4c3f-ac1a-116183412417", "email": "correodepruebatesting@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-07-02 19:50:17.884251+00', '2026-07-02 19:50:17.884299+00', '2026-07-02 19:50:17.884299+00', '2389a770-3476-4d01-9503-75496d49b209');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('af96d2be-182d-421f-a38a-3f99e7176909', '71350bdc-762a-4d27-9974-276ce996f1f2', '2026-05-28 17:17:22.235163+00', '2026-05-28 17:17:22.235163+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 OPR/131.0.0.0', '200.86.255.111', NULL, NULL, NULL, NULL, NULL),
	('3070bc08-79ef-4dcf-a350-1d5a6b06d4c4', '5898288a-b920-4e1e-bde0-d505f00f9367', '2026-06-19 17:20:42.717195+00', '2026-06-19 18:22:59.304467+00', NULL, 'aal1', NULL, '2026-06-19 18:22:59.304351', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '179.60.66.79', NULL, NULL, NULL, NULL, NULL),
	('990f9584-63aa-428c-b494-a4964c6aff50', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', '2026-07-02 02:44:29.893753+00', '2026-07-02 07:51:40.789706+00', NULL, 'aal1', NULL, '2026-07-02 07:51:40.789622', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.162.82.229', NULL, NULL, NULL, NULL, NULL),
	('7c2f7d5a-ec2c-431e-ae31-f58de8a5b3ba', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '2026-07-02 18:07:49.002219+00', '2026-07-02 19:06:24.551875+00', NULL, 'aal1', NULL, '2026-07-02 19:06:24.551779', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.162.82.229', NULL, NULL, NULL, NULL, NULL),
	('ed6ad4a4-9bee-4921-8a9d-8685ece92b80', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', '2026-07-02 19:37:19.916296+00', '2026-07-02 19:37:19.916296+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.162.82.229', NULL, NULL, NULL, NULL, NULL),
	('d5518df7-4e9c-4bf3-8009-e5bdac94bbe1', 'a34fc050-1e5b-4f7a-a11c-edd2b1758bd5', '2026-06-18 00:20:12.167312+00', '2026-06-18 00:20:12.167312+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36', '200.9.234.130', NULL, NULL, NULL, NULL, NULL),
	('9a9c0a7c-f086-4500-ac7c-5d9f681caa87', 'a34fc050-1e5b-4f7a-a11c-edd2b1758bd5', '2026-06-18 00:22:41.612532+00', '2026-06-18 00:22:41.612532+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36', '200.9.234.130', NULL, NULL, NULL, NULL, NULL),
	('dfde3697-5214-4a3d-95c7-a1a3d7c2e2c3', 'a34fc050-1e5b-4f7a-a11c-edd2b1758bd5', '2026-06-18 00:23:45.717899+00', '2026-06-18 00:23:45.717899+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/149.0.7827.55 Safari/537.36', '200.9.234.130', NULL, NULL, NULL, NULL, NULL),
	('68c97881-c8f9-49ea-bf27-2e16c7bc63c2', '5898288a-b920-4e1e-bde0-d505f00f9367', '2026-06-19 02:30:14.124756+00', '2026-06-19 02:30:14.124756+00', NULL, 'aal1', NULL, NULL, 'curl/8.18.0', '179.60.66.79', NULL, NULL, NULL, NULL, NULL),
	('dcebf9e5-530a-4b5f-ab78-3b22cc88dca1', '5898288a-b920-4e1e-bde0-d505f00f9367', '2026-06-19 02:30:52.246149+00', '2026-06-19 02:30:52.246149+00', NULL, 'aal1', NULL, NULL, 'curl/8.18.0', '179.60.66.79', NULL, NULL, NULL, NULL, NULL),
	('727374d9-e8b9-482c-993b-a1441b7e4c7f', '5898288a-b920-4e1e-bde0-d505f00f9367', '2026-06-18 19:56:02.869247+00', '2026-06-18 21:53:52.827875+00', NULL, 'aal1', NULL, '2026-06-18 21:53:52.825198', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.162.82.229', NULL, NULL, NULL, NULL, NULL),
	('0a87ed34-eac3-41b8-9e41-778940b44343', '5898288a-b920-4e1e-bde0-d505f00f9367', '2026-06-18 22:36:50.184431+00', '2026-06-18 22:36:50.184431+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.162.82.229', NULL, NULL, NULL, NULL, NULL),
	('fcec6428-1a11-4c07-b63c-84cd39ee4753', '5898288a-b920-4e1e-bde0-d505f00f9367', '2026-06-18 22:38:54.378654+00', '2026-06-18 22:38:54.378654+00', NULL, 'aal1', NULL, NULL, 'curl/8.18.0', '190.162.82.229', NULL, NULL, NULL, NULL, NULL),
	('55e78314-8350-48d4-a5c7-4ffc9e66b958', '5898288a-b920-4e1e-bde0-d505f00f9367', '2026-06-18 22:39:13.625361+00', '2026-06-18 22:39:13.625361+00', NULL, 'aal1', NULL, NULL, 'curl/8.18.0', '190.162.82.229', NULL, NULL, NULL, NULL, NULL),
	('56016e08-eeb1-4604-9659-da3ce44ff7fd', '5898288a-b920-4e1e-bde0-d505f00f9367', '2026-06-19 02:29:54.661443+00', '2026-06-19 02:29:54.661443+00', NULL, 'aal1', NULL, NULL, 'curl/8.18.0', '179.60.66.79', NULL, NULL, NULL, NULL, NULL),
	('c61c12ce-6780-4951-88dd-c51052b92898', '5898288a-b920-4e1e-bde0-d505f00f9367', '2026-06-19 02:31:29.544798+00', '2026-06-19 02:31:29.544798+00', NULL, 'aal1', NULL, NULL, 'curl/8.18.0', '179.60.66.79', NULL, NULL, NULL, NULL, NULL),
	('30c1f3f9-e3a0-473b-bc03-c2d6a748be74', '5898288a-b920-4e1e-bde0-d505f00f9367', '2026-06-19 03:09:09.704475+00', '2026-06-19 03:09:09.704475+00', NULL, 'aal1', NULL, NULL, 'curl/8.18.0', '179.60.66.79', NULL, NULL, NULL, NULL, NULL),
	('c406ffc8-3c29-420c-b109-e9c9fc06c43e', '5898288a-b920-4e1e-bde0-d505f00f9367', '2026-06-19 02:42:07.386752+00', '2026-06-19 16:44:56.865096+00', NULL, 'aal1', NULL, '2026-06-19 16:44:56.864982', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '179.60.66.79', NULL, NULL, NULL, NULL, NULL),
	('a1150060-d71b-4865-9cc1-463d8b2ce652', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '2026-06-30 02:20:55.058268+00', '2026-06-30 02:20:55.058268+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '179.60.66.79', NULL, NULL, NULL, NULL, NULL),
	('a9d06cf0-12d8-4458-885d-a2ed95ab64c3', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '2026-07-02 02:40:59.878404+00', '2026-07-02 07:51:40.234889+00', NULL, 'aal1', NULL, '2026-07-02 07:51:40.23474', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.162.82.229', NULL, NULL, NULL, NULL, NULL),
	('6e2d1acf-090f-476c-8052-54c52431b9a1', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', '2026-07-02 18:04:59.475131+00', '2026-07-02 18:04:59.475131+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.162.82.229', NULL, NULL, NULL, NULL, NULL),
	('c49e7639-53e7-4224-9141-ff98a7f1c26f', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', '2026-06-24 00:22:53.325335+00', '2026-06-24 00:22:53.325335+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '186.175.64.139', NULL, NULL, NULL, NULL, NULL),
	('ef1821cd-9c70-41cd-86ab-9ea374a6c08f', '38450548-79d5-4fb4-9aab-77e4916032f2', '2026-07-02 19:19:34.626911+00', '2026-07-02 19:19:34.626911+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.162.82.229', NULL, NULL, NULL, NULL, NULL),
	('1babc177-ed6a-42c6-8ad5-d950b38bfadd', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', '2026-06-24 23:52:17.154881+00', '2026-06-24 23:52:17.154881+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '200.9.234.130', NULL, NULL, NULL, NULL, NULL),
	('48bbdea5-d0b8-4ca4-b96b-9e3a129b0cb4', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', '2026-06-30 02:37:54.597967+00', '2026-06-30 02:37:54.597967+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '179.60.66.79', NULL, NULL, NULL, NULL, NULL),
	('d5b37892-f10f-4afb-8b50-07b20d9b79bc', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', '2026-06-25 05:37:59.771756+00', '2026-06-25 07:37:31.225782+00', NULL, 'aal1', NULL, '2026-06-25 07:37:31.225672', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '179.60.66.79', NULL, NULL, NULL, NULL, NULL),
	('62d4f199-5bbc-4176-8e20-b218341c6726', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '2026-06-26 00:11:26.698126+00', '2026-06-26 00:11:26.698126+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '179.60.66.79', NULL, NULL, NULL, NULL, NULL),
	('df97b15f-7742-47d1-beb5-f33cb932a83e', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '2026-06-26 00:21:15.995366+00', '2026-06-26 00:21:15.995366+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36', '181.73.191.238', NULL, NULL, NULL, NULL, NULL),
	('fc21e6e3-d37b-420c-b49b-c624c1b1b799', 'dfec9fa3-c1c9-4678-8c72-9367cf355512', '2026-06-30 02:39:13.404379+00', '2026-06-30 02:39:13.404379+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', '190.114.34.187', NULL, NULL, NULL, NULL, NULL),
	('ba9525cc-fb05-4950-a819-0229dc218702', 'dfec9fa3-c1c9-4678-8c72-9367cf355512', '2026-06-30 02:42:32.496534+00', '2026-06-30 02:42:32.496534+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.114.34.187', NULL, NULL, NULL, NULL, NULL),
	('f67da8b7-6b87-4c61-8eec-815b742923e1', 'dfec9fa3-c1c9-4678-8c72-9367cf355512', '2026-06-30 02:45:04.264403+00', '2026-06-30 02:45:04.264403+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.114.34.187', NULL, NULL, NULL, NULL, NULL),
	('47ba0d5b-8e08-4ed0-80a8-41aa0e17dc6b', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '2026-07-01 01:52:19.427035+00', '2026-07-01 01:52:19.427035+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.162.82.229', NULL, NULL, NULL, NULL, NULL),
	('d6042ac6-0fcf-4e66-a79e-904822db9e48', 'eb935a55-6f06-4ed6-b1f0-b263766cf6ae', '2026-07-01 01:51:54.982389+00', '2026-07-01 02:49:31.332402+00', NULL, 'aal1', NULL, '2026-07-01 02:49:31.332289', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '190.162.82.229', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('af96d2be-182d-421f-a38a-3f99e7176909', '2026-05-28 17:17:22.247208+00', '2026-05-28 17:17:22.247208+00', 'otp', '9cae35c4-0d98-4502-b0e3-1ab44bb06868'),
	('a9d06cf0-12d8-4458-885d-a2ed95ab64c3', '2026-07-02 02:40:59.948162+00', '2026-07-02 02:40:59.948162+00', 'password', 'd254f829-ac3e-4a3b-a943-dc06ab53e511'),
	('990f9584-63aa-428c-b494-a4964c6aff50', '2026-07-02 02:44:29.923779+00', '2026-07-02 02:44:29.923779+00', 'password', 'e71e018e-e456-4c81-8f8c-c0c4bcd96d8f'),
	('6e2d1acf-090f-476c-8052-54c52431b9a1', '2026-07-02 18:04:59.496375+00', '2026-07-02 18:04:59.496375+00', 'password', 'd2812197-ba75-49ad-89eb-93284e6f67e3'),
	('7c2f7d5a-ec2c-431e-ae31-f58de8a5b3ba', '2026-07-02 18:07:49.006136+00', '2026-07-02 18:07:49.006136+00', 'password', '1bd7e4ff-ec3f-4638-b215-a60f4bfa12de'),
	('ef1821cd-9c70-41cd-86ab-9ea374a6c08f', '2026-07-02 19:19:34.647035+00', '2026-07-02 19:19:34.647035+00', 'password', '535c6db4-e4f8-44f4-9246-66188752a64a'),
	('ed6ad4a4-9bee-4921-8a9d-8685ece92b80', '2026-07-02 19:37:19.945178+00', '2026-07-02 19:37:19.945178+00', 'password', 'ff24f908-a5b4-4095-a05f-458b079b62e1'),
	('d5518df7-4e9c-4bf3-8009-e5bdac94bbe1', '2026-06-18 00:20:12.190244+00', '2026-06-18 00:20:12.190244+00', 'password', 'e374dfad-4244-451c-8bb8-1b5c9f27adf4'),
	('9a9c0a7c-f086-4500-ac7c-5d9f681caa87', '2026-06-18 00:22:41.625361+00', '2026-06-18 00:22:41.625361+00', 'password', '32bfd105-534d-4996-bf37-7b858ef337af'),
	('dfde3697-5214-4a3d-95c7-a1a3d7c2e2c3', '2026-06-18 00:23:45.737487+00', '2026-06-18 00:23:45.737487+00', 'password', 'a1764aad-83f1-46b6-af0a-32d44b56d88d'),
	('c49e7639-53e7-4224-9141-ff98a7f1c26f', '2026-06-24 00:22:53.332484+00', '2026-06-24 00:22:53.332484+00', 'password', 'c2ec13d5-5616-46bc-b1bb-b954faa8c07c'),
	('727374d9-e8b9-482c-993b-a1441b7e4c7f', '2026-06-18 19:56:02.904726+00', '2026-06-18 19:56:02.904726+00', 'password', '15ddaa81-bd0f-4fcf-9e35-ccef08df1d76'),
	('1babc177-ed6a-42c6-8ad5-d950b38bfadd', '2026-06-24 23:52:17.266137+00', '2026-06-24 23:52:17.266137+00', 'password', '4d9c0fd1-88ef-46f5-be21-c547873e64cc'),
	('d5b37892-f10f-4afb-8b50-07b20d9b79bc', '2026-06-25 05:37:59.838802+00', '2026-06-25 05:37:59.838802+00', 'password', 'c1ef8cc2-e7a8-4ef1-9b1c-f2dc6fc8a56e'),
	('0a87ed34-eac3-41b8-9e41-778940b44343', '2026-06-18 22:36:50.20205+00', '2026-06-18 22:36:50.20205+00', 'password', '805b09a3-5d5f-45da-9e0e-e2d5b998c401'),
	('fcec6428-1a11-4c07-b63c-84cd39ee4753', '2026-06-18 22:38:54.383363+00', '2026-06-18 22:38:54.383363+00', 'password', '5d9f992b-9fcd-4e1c-8393-44e53fde094a'),
	('55e78314-8350-48d4-a5c7-4ffc9e66b958', '2026-06-18 22:39:13.627739+00', '2026-06-18 22:39:13.627739+00', 'password', '0a52ce65-99e8-497b-9741-31730489fe42'),
	('56016e08-eeb1-4604-9659-da3ce44ff7fd', '2026-06-19 02:29:54.745593+00', '2026-06-19 02:29:54.745593+00', 'password', '9fe66f92-5a16-4a83-9c52-af0bcc459d3b'),
	('68c97881-c8f9-49ea-bf27-2e16c7bc63c2', '2026-06-19 02:30:14.144704+00', '2026-06-19 02:30:14.144704+00', 'password', 'c8d1d896-948e-4d59-959d-1f0d71bf178e'),
	('dcebf9e5-530a-4b5f-ab78-3b22cc88dca1', '2026-06-19 02:30:52.264377+00', '2026-06-19 02:30:52.264377+00', 'password', '6b3aa7e2-d8fe-42c6-b10c-4d834758a205'),
	('c61c12ce-6780-4951-88dd-c51052b92898', '2026-06-19 02:31:29.547429+00', '2026-06-19 02:31:29.547429+00', 'password', 'f39e07de-95a8-4b4c-8b11-3d3885744922'),
	('c406ffc8-3c29-420c-b109-e9c9fc06c43e', '2026-06-19 02:42:07.415958+00', '2026-06-19 02:42:07.415958+00', 'password', '172da5ac-82d7-4ac9-91b4-01500e7c6073'),
	('30c1f3f9-e3a0-473b-bc03-c2d6a748be74', '2026-06-19 03:09:09.744279+00', '2026-06-19 03:09:09.744279+00', 'password', '90734ef3-ad07-494d-a4af-d0ee85001bba'),
	('3070bc08-79ef-4dcf-a350-1d5a6b06d4c4', '2026-06-19 17:20:42.72913+00', '2026-06-19 17:20:42.72913+00', 'password', 'fb3f4b44-4854-4db5-8e4e-5a640d554c00'),
	('62d4f199-5bbc-4176-8e20-b218341c6726', '2026-06-26 00:11:26.72143+00', '2026-06-26 00:11:26.72143+00', 'password', '4a3da07e-8aa5-441d-812e-75c85cc3bdc8'),
	('df97b15f-7742-47d1-beb5-f33cb932a83e', '2026-06-26 00:21:16.017805+00', '2026-06-26 00:21:16.017805+00', 'password', '968dee4b-5413-4b02-a1c6-d90fbaa22f86'),
	('a1150060-d71b-4865-9cc1-463d8b2ce652', '2026-06-30 02:20:55.101468+00', '2026-06-30 02:20:55.101468+00', 'password', '02c69631-dc4d-4a71-b176-0da46920601c'),
	('48bbdea5-d0b8-4ca4-b96b-9e3a129b0cb4', '2026-06-30 02:37:54.600611+00', '2026-06-30 02:37:54.600611+00', 'password', 'f9b07367-2d20-4228-bd5b-73d01c170f07'),
	('fc21e6e3-d37b-420c-b49b-c624c1b1b799', '2026-06-30 02:39:13.424076+00', '2026-06-30 02:39:13.424076+00', 'password', 'bb157953-39e0-4ec9-a419-4888ba4e62ca'),
	('ba9525cc-fb05-4950-a819-0229dc218702', '2026-06-30 02:42:32.520372+00', '2026-06-30 02:42:32.520372+00', 'password', '8f9cf307-dd7c-42e8-b288-b174cc53212c'),
	('f67da8b7-6b87-4c61-8eec-815b742923e1', '2026-06-30 02:45:04.307038+00', '2026-06-30 02:45:04.307038+00', 'password', '062470cc-bbd4-4d02-8ebe-994682c64bfe'),
	('d6042ac6-0fcf-4e66-a79e-904822db9e48', '2026-07-01 01:51:55.021096+00', '2026-07-01 01:51:55.021096+00', 'password', '0ce406b2-9463-4603-931d-2114d192219f'),
	('47ba0d5b-8e08-4ed0-80a8-41aa0e17dc6b', '2026-07-01 01:52:19.429799+00', '2026-07-01 01:52:19.429799+00', 'password', '3100f329-afa7-4a71-bbc2-a2139e61423b');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('d425b827-62d7-45ef-948f-102c2f9b550d', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', 'recovery_token', 'ead0570e889ad5ea559d3c99490c423699b318db81918f1cb5aad4bf', 'maria.gonzalez@vcm.cl', '2026-06-04 19:20:46.47107', '2026-06-04 19:20:46.47107'),
	('0c9c182d-092f-45f4-bc14-858fddf65d34', '5db4a5d6-d967-42e8-9d00-25bbfde075e4', 'confirmation_token', '06411e482a2a1f809e3d1fc46e07a5c02d2a82c324979f018bb8ddb9', 'autoridaducmprueba@gmail.com', '2026-06-25 05:50:32.867493', '2026-06-25 05:50:32.867493'),
	('c73b7528-9fe4-4c7c-93b5-c1d2f96080c1', 'c3ac89ea-9e36-445a-9502-1a6c06e77975', 'confirmation_token', '812a57735620ec2759908fd08fe4b204d46eed7efce745598633d38c', 'autoridadprueba@gmail.com', '2026-06-25 05:51:59.475467', '2026-06-25 05:51:59.475467'),
	('d0054924-1885-43df-a0c3-66a2b6c61744', 'c3dc3fa1-b864-4c3f-ac1a-116183412417', 'confirmation_token', 'faa1fdf32b6dc969d300bc7c9f5538972501e2a66d8691e775a07575', 'correodepruebatesting@gmail.com', '2026-07-02 19:50:18.244788', '2026-07-02 19:50:18.244788');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'rwuifxrsxuup', '71350bdc-762a-4d27-9974-276ce996f1f2', false, '2026-05-28 17:17:22.237393+00', '2026-05-28 17:17:22.237393+00', NULL, 'af96d2be-182d-421f-a38a-3f99e7176909'),
	('00000000-0000-0000-0000-000000000000', 72, 'vk6slmgmswfs', '5898288a-b920-4e1e-bde0-d505f00f9367', false, '2026-06-19 02:29:54.69421+00', '2026-06-19 02:29:54.69421+00', NULL, '56016e08-eeb1-4604-9659-da3ce44ff7fd'),
	('00000000-0000-0000-0000-000000000000', 73, 'brvknx5rjjyo', '5898288a-b920-4e1e-bde0-d505f00f9367', false, '2026-06-19 02:30:14.136573+00', '2026-06-19 02:30:14.136573+00', NULL, '68c97881-c8f9-49ea-bf27-2e16c7bc63c2'),
	('00000000-0000-0000-0000-000000000000', 196, 'dgxke4w2aw55', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', false, '2026-06-26 00:11:26.715715+00', '2026-06-26 00:11:26.715715+00', NULL, '62d4f199-5bbc-4176-8e20-b218341c6726'),
	('00000000-0000-0000-0000-000000000000', 75, 'hdpaib2xvu6c', '5898288a-b920-4e1e-bde0-d505f00f9367', false, '2026-06-19 02:30:52.258979+00', '2026-06-19 02:30:52.258979+00', NULL, 'dcebf9e5-530a-4b5f-ab78-3b22cc88dca1'),
	('00000000-0000-0000-0000-000000000000', 229, 'rem2ltpazna6', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', true, '2026-07-02 05:22:26.797713+00', '2026-07-02 06:49:47.956862+00', 'lz6s3yvil4of', '990f9584-63aa-428c-b494-a4964c6aff50'),
	('00000000-0000-0000-0000-000000000000', 77, '43gqi5rfo5g7', '5898288a-b920-4e1e-bde0-d505f00f9367', false, '2026-06-19 02:31:29.545992+00', '2026-06-19 02:31:29.545992+00', NULL, 'c61c12ce-6780-4951-88dd-c51052b92898'),
	('00000000-0000-0000-0000-000000000000', 234, 'hrwpna764kcq', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', true, '2026-07-02 06:49:47.965798+00', '2026-07-02 07:51:40.787082+00', 'rem2ltpazna6', '990f9584-63aa-428c-b494-a4964c6aff50'),
	('00000000-0000-0000-0000-000000000000', 83, 'xeof3ijfbxqq', '5898288a-b920-4e1e-bde0-d505f00f9367', false, '2026-06-19 03:09:09.725193+00', '2026-06-19 03:09:09.725193+00', NULL, '30c1f3f9-e3a0-473b-bc03-c2d6a748be74'),
	('00000000-0000-0000-0000-000000000000', 81, '55a5qk4smvva', '5898288a-b920-4e1e-bde0-d505f00f9367', true, '2026-06-19 02:42:07.405749+00', '2026-06-19 16:44:56.823549+00', NULL, 'c406ffc8-3c29-420c-b109-e9c9fc06c43e'),
	('00000000-0000-0000-0000-000000000000', 85, 'ot6sn4fucair', '5898288a-b920-4e1e-bde0-d505f00f9367', false, '2026-06-19 16:44:56.839417+00', '2026-06-19 16:44:56.839417+00', '55a5qk4smvva', 'c406ffc8-3c29-420c-b109-e9c9fc06c43e'),
	('00000000-0000-0000-0000-000000000000', 205, 'qlxv5qwcq7ye', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', false, '2026-06-30 02:37:54.599169+00', '2026-06-30 02:37:54.599169+00', NULL, '48bbdea5-d0b8-4ca4-b96b-9e3a129b0cb4'),
	('00000000-0000-0000-0000-000000000000', 206, 'dyauyv4f74kw', 'dfec9fa3-c1c9-4678-8c72-9367cf355512', false, '2026-06-30 02:39:13.41909+00', '2026-06-30 02:39:13.41909+00', NULL, 'fc21e6e3-d37b-420c-b49b-c624c1b1b799'),
	('00000000-0000-0000-0000-000000000000', 208, 'gd6ffdeohx4z', 'dfec9fa3-c1c9-4678-8c72-9367cf355512', false, '2026-06-30 02:45:04.288187+00', '2026-06-30 02:45:04.288187+00', NULL, 'f67da8b7-6b87-4c61-8eec-815b742923e1'),
	('00000000-0000-0000-0000-000000000000', 211, '6immxx4uw3fn', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', false, '2026-07-01 01:52:19.428276+00', '2026-07-01 01:52:19.428276+00', NULL, '47ba0d5b-8e08-4ed0-80a8-41aa0e17dc6b'),
	('00000000-0000-0000-0000-000000000000', 210, 'lgxeusss4xhs', 'eb935a55-6f06-4ed6-b1f0-b263766cf6ae', true, '2026-07-01 01:51:55.00127+00', '2026-07-01 02:49:31.295635+00', NULL, 'd6042ac6-0fcf-4e66-a79e-904822db9e48'),
	('00000000-0000-0000-0000-000000000000', 213, 'bk7zh2dmfnwl', 'eb935a55-6f06-4ed6-b1f0-b263766cf6ae', false, '2026-07-01 02:49:31.308242+00', '2026-07-01 02:49:31.308242+00', 'lgxeusss4xhs', 'd6042ac6-0fcf-4e66-a79e-904822db9e48'),
	('00000000-0000-0000-0000-000000000000', 246, 'a3knjkrw6i4n', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', true, '2026-07-02 18:07:49.003457+00', '2026-07-02 19:06:24.548831+00', NULL, '7c2f7d5a-ec2c-431e-ae31-f58de8a5b3ba'),
	('00000000-0000-0000-0000-000000000000', 251, '456dq76mqzxq', '38450548-79d5-4fb4-9aab-77e4916032f2', false, '2026-07-02 19:19:34.644012+00', '2026-07-02 19:19:34.644012+00', NULL, 'ef1821cd-9c70-41cd-86ab-9ea374a6c08f'),
	('00000000-0000-0000-0000-000000000000', 91, 'hf3xjzmcmq6l', '5898288a-b920-4e1e-bde0-d505f00f9367', true, '2026-06-19 17:20:42.723683+00', '2026-06-19 18:22:59.269246+00', NULL, '3070bc08-79ef-4dcf-a350-1d5a6b06d4c4'),
	('00000000-0000-0000-0000-000000000000', 96, 'f5akgeoaqup3', '5898288a-b920-4e1e-bde0-d505f00f9367', false, '2026-06-19 18:22:59.284906+00', '2026-06-19 18:22:59.284906+00', 'hf3xjzmcmq6l', '3070bc08-79ef-4dcf-a350-1d5a6b06d4c4'),
	('00000000-0000-0000-0000-000000000000', 221, 'dapfukd7xtqk', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', true, '2026-07-02 02:44:29.915085+00', '2026-07-02 04:18:43.012928+00', NULL, '990f9584-63aa-428c-b494-a4964c6aff50'),
	('00000000-0000-0000-0000-000000000000', 227, 'lz6s3yvil4of', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', true, '2026-07-02 04:18:43.020994+00', '2026-07-02 05:22:26.782075+00', 'dapfukd7xtqk', '990f9584-63aa-428c-b494-a4964c6aff50'),
	('00000000-0000-0000-0000-000000000000', 36, 'f5mclnirx62m', 'a34fc050-1e5b-4f7a-a11c-edd2b1758bd5', false, '2026-06-18 00:20:12.185364+00', '2026-06-18 00:20:12.185364+00', NULL, 'd5518df7-4e9c-4bf3-8009-e5bdac94bbe1'),
	('00000000-0000-0000-0000-000000000000', 37, 'kbsla7irn44v', 'a34fc050-1e5b-4f7a-a11c-edd2b1758bd5', false, '2026-06-18 00:22:41.621883+00', '2026-06-18 00:22:41.621883+00', NULL, '9a9c0a7c-f086-4500-ac7c-5d9f681caa87'),
	('00000000-0000-0000-0000-000000000000', 38, 'j4ax7wvz6ggu', 'a34fc050-1e5b-4f7a-a11c-edd2b1758bd5', false, '2026-06-18 00:23:45.730903+00', '2026-06-18 00:23:45.730903+00', NULL, 'dfde3697-5214-4a3d-95c7-a1a3d7c2e2c3'),
	('00000000-0000-0000-0000-000000000000', 46, 'x4mwf5a7dwhv', '5898288a-b920-4e1e-bde0-d505f00f9367', true, '2026-06-18 19:56:02.888245+00', '2026-06-18 20:55:42.70633+00', NULL, '727374d9-e8b9-482c-993b-a1441b7e4c7f'),
	('00000000-0000-0000-0000-000000000000', 51, 'sltubom44dnv', '5898288a-b920-4e1e-bde0-d505f00f9367', true, '2026-06-18 20:55:42.720192+00', '2026-06-18 21:53:52.820568+00', 'x4mwf5a7dwhv', '727374d9-e8b9-482c-993b-a1441b7e4c7f'),
	('00000000-0000-0000-0000-000000000000', 55, 'rkl6hioozjxx', '5898288a-b920-4e1e-bde0-d505f00f9367', false, '2026-06-18 21:53:52.822013+00', '2026-06-18 21:53:52.822013+00', 'sltubom44dnv', '727374d9-e8b9-482c-993b-a1441b7e4c7f'),
	('00000000-0000-0000-0000-000000000000', 64, '22xdh6byomzi', '5898288a-b920-4e1e-bde0-d505f00f9367', false, '2026-06-18 22:36:50.197248+00', '2026-06-18 22:36:50.197248+00', NULL, '0a87ed34-eac3-41b8-9e41-778940b44343'),
	('00000000-0000-0000-0000-000000000000', 66, '7zdurm4mdue3', '5898288a-b920-4e1e-bde0-d505f00f9367', false, '2026-06-18 22:38:54.382005+00', '2026-06-18 22:38:54.382005+00', NULL, 'fcec6428-1a11-4c07-b63c-84cd39ee4753'),
	('00000000-0000-0000-0000-000000000000', 68, 'h45bjqqtdoyq', '5898288a-b920-4e1e-bde0-d505f00f9367', false, '2026-06-18 22:39:13.626422+00', '2026-06-18 22:39:13.626422+00', NULL, '55e78314-8350-48d4-a5c7-4ffc9e66b958'),
	('00000000-0000-0000-0000-000000000000', 231, 'hagbrxpi743b', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', true, '2026-07-02 05:25:46.675275+00', '2026-07-02 06:31:13.918787+00', '2kikfqjbuun7', 'a9d06cf0-12d8-4458-885d-a2ed95ab64c3'),
	('00000000-0000-0000-0000-000000000000', 233, 'owisai3lvbff', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', true, '2026-07-02 06:31:13.926944+00', '2026-07-02 07:51:40.196782+00', 'hagbrxpi743b', 'a9d06cf0-12d8-4458-885d-a2ed95ab64c3'),
	('00000000-0000-0000-0000-000000000000', 235, 'jqdeatfukzw4', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', false, '2026-07-02 07:51:40.209826+00', '2026-07-02 07:51:40.209826+00', 'owisai3lvbff', 'a9d06cf0-12d8-4458-885d-a2ed95ab64c3'),
	('00000000-0000-0000-0000-000000000000', 197, 'hgwqagbw2bnz', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', false, '2026-06-26 00:21:16.011498+00', '2026-06-26 00:21:16.011498+00', NULL, 'df97b15f-7742-47d1-beb5-f33cb932a83e'),
	('00000000-0000-0000-0000-000000000000', 200, 'b7d3bd6vwve6', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', false, '2026-06-30 02:20:55.082402+00', '2026-06-30 02:20:55.082402+00', NULL, 'a1150060-d71b-4865-9cc1-463d8b2ce652'),
	('00000000-0000-0000-0000-000000000000', 207, 'trfxq6lfyvk4', 'dfec9fa3-c1c9-4678-8c72-9367cf355512', false, '2026-06-30 02:42:32.516392+00', '2026-06-30 02:42:32.516392+00', NULL, 'ba9525cc-fb05-4950-a819-0229dc218702'),
	('00000000-0000-0000-0000-000000000000', 237, 'tbrdz53czdky', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', false, '2026-07-02 07:51:40.787468+00', '2026-07-02 07:51:40.787468+00', 'hrwpna764kcq', '990f9584-63aa-428c-b494-a4964c6aff50'),
	('00000000-0000-0000-0000-000000000000', 243, 'dyskysvrvszf', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', false, '2026-07-02 18:04:59.489857+00', '2026-07-02 18:04:59.489857+00', NULL, '6e2d1acf-090f-476c-8052-54c52431b9a1'),
	('00000000-0000-0000-0000-000000000000', 249, 'pzi4n5ks2npd', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', false, '2026-07-02 19:06:24.549445+00', '2026-07-02 19:06:24.549445+00', 'a3knjkrw6i4n', '7c2f7d5a-ec2c-431e-ae31-f58de8a5b3ba'),
	('00000000-0000-0000-0000-000000000000', 252, 'pqq4j67lp4rr', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', false, '2026-07-02 19:37:19.931761+00', '2026-07-02 19:37:19.931761+00', NULL, 'ed6ad4a4-9bee-4921-8a9d-8685ece92b80'),
	('00000000-0000-0000-0000-000000000000', 220, 'iv5xil7nmphj', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', true, '2026-07-02 02:40:59.911928+00', '2026-07-02 04:16:39.285385+00', NULL, 'a9d06cf0-12d8-4458-885d-a2ed95ab64c3'),
	('00000000-0000-0000-0000-000000000000', 161, 'ikoznj5kbdzp', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', false, '2026-06-24 23:52:17.207893+00', '2026-06-24 23:52:17.207893+00', NULL, '1babc177-ed6a-42c6-8ad5-d950b38bfadd'),
	('00000000-0000-0000-0000-000000000000', 148, 'qi7mjigqvkna', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', false, '2026-06-24 00:22:53.329764+00', '2026-06-24 00:22:53.329764+00', NULL, 'c49e7639-53e7-4224-9141-ff98a7f1c26f'),
	('00000000-0000-0000-0000-000000000000', 226, '2kikfqjbuun7', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', true, '2026-07-02 04:16:39.305466+00', '2026-07-02 05:25:46.67486+00', 'iv5xil7nmphj', 'a9d06cf0-12d8-4458-885d-a2ed95ab64c3'),
	('00000000-0000-0000-0000-000000000000', 170, '7ilili73g5qk', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', true, '2026-06-25 05:37:59.799803+00', '2026-06-25 06:37:06.628236+00', NULL, 'd5b37892-f10f-4afb-8b50-07b20d9b79bc'),
	('00000000-0000-0000-0000-000000000000', 175, 'ihihepc4srw4', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', true, '2026-06-25 06:37:06.648504+00', '2026-06-25 07:37:31.192832+00', '7ilili73g5qk', 'd5b37892-f10f-4afb-8b50-07b20d9b79bc'),
	('00000000-0000-0000-0000-000000000000', 180, 'c5w3krzgnexq', '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', false, '2026-06-25 07:37:31.203536+00', '2026-06-25 07:37:31.203536+00', 'ihihepc4srw4', 'd5b37892-f10f-4afb-8b50-07b20d9b79bc');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: facultad; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."facultad" ("id_facultad", "nombre_facultad", "etiqueta_facultad", "is_active") VALUES
	(1, 'Facultad de Medicina', 'FMED', true),
	(2, 'Facultad de Ciencias de la Educación', 'FCED', true),
	(3, 'Facultad de Ciencias de la Salud', 'FCS', true),
	(4, 'Facultad de Ciencias de la Ingeniería', 'FCI', true),
	(5, 'Facultad de Ciencias Sociales y Económicas', 'FCSE', true),
	(6, 'Facultad de Ciencias Agrarias y Forestales', 'FCAF', true),
	(7, 'Facultad de Ciencias Religiosas y Filosóficas', 'FCRF', true),
	(8, 'Facultad de Ciencias Básicas', 'FCB', true),
	(9, 'Facultad de prueba', 'FDP', false),
	(10, 'facultad de prueba 2', 'fdp2', false),
	(11, 'Facultad de Prueba 2', 'FDP2', true),
	(12, 'Facultad de prueba 5', 'FDP6', true);


--
-- Data for Name: carrera; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."carrera" ("id_carrera", "nombre_carrera", "etiqueta_carrera", "id_facultad", "is_active") VALUES
	(1, 'Medicina', 'MED', 1, true),
	(2, 'Química y Farmacia', 'QYF', 1, true),
	(3, 'Bioingeniería Médica', 'BIM', 1, true),
	(4, 'Bachillerato en Ciencias Biomédicas', 'BCB', 1, true),
	(5, 'Pedagogía en Educación Especial', 'PEE', 2, true),
	(6, 'Pedagogía en Educación Parvularia con Mención', 'PEP', 2, true),
	(7, 'Pedagogía en Educación Física', 'PEF', 2, true),
	(8, 'Pedagogía en Educación Básica con Mención', 'PEB', 2, true),
	(9, 'Pedagogía en Inglés', 'PIN', 2, true),
	(10, 'Pedagogía en Lengua Castellana y Comunicación', 'PLC', 2, true),
	(11, 'Enfermería', 'ENF', 3, true),
	(12, 'Kinesiología', 'KIN', 3, true),
	(13, 'Nutrición y Dietética', 'NYD', 3, true),
	(14, 'Psicología', 'PSI', 3, true),
	(15, 'Tecnología Médica', 'TME', 3, true),
	(16, 'Terapia Ocupacional', 'TOC', 3, true),
	(17, 'Arquitectura', 'ARQ', 4, true),
	(18, 'Construcción Civil', 'CCI', 4, true),
	(19, 'Ingeniería en Automatización y Control', 'IAC', 4, true),
	(20, 'Ingeniería Ejecución en Geomensura', 'IEG', 4, true),
	(21, 'Administración Pública', 'ADP', 5, true),
	(22, 'Contador Público y Auditor', 'CPA', 5, true),
	(23, 'Derecho', 'DER', 5, true),
	(24, 'Ingeniería Comercial', 'ICO', 5, true),
	(25, 'Sociología', 'SOC', 5, true),
	(26, 'Trabajo Social', 'TSO', 5, true),
	(27, 'Agronomía', 'AGR', 6, true),
	(28, 'Ingeniería en Biotecnología', 'IBT', 6, true),
	(29, 'Ingeniería en Recursos Naturales', 'IRN', 6, true),
	(30, 'Medicina Veterinaria', 'MVE', 6, true),
	(31, 'Pedagogía en Religión y Filosofía', 'PRF', 7, true),
	(32, 'Geología', 'GEO', 8, true),
	(33, 'Ingeniería en Estadística', 'IES', 8, true),
	(34, 'Ingeniería Matemática', 'IMA', 8, true),
	(35, 'Pedagogía en Ciencias', 'PCI', 8, true),
	(36, 'Pedagogía en Matemáticas y Computación', 'PMC', 8, true),
	(38, 'Carrera de Prueba 3', 'CDP3', 11, true),
	(37, 'carrera de prueba', 'cdp', 10, true),
	(39, 'Ingeniería Civil', 'IC', 4, true),
	(40, 'Ingeniería en Construcción', 'IEC', 4, true),
	(41, 'Ingeniería Civil Informática', 'ICINF', 4, true),
	(42, 'Auditoría', 'AUD', 5, true),
	(43, 'Ingeniería Civil Electrónica', 'ICE', 4, true),
	(44, 'Ingeniería Ejecución en Computación e Informática', 'IECI', 4, true),
	(45, 'Ingeniería Civil Industrial', 'ICI', 4, true),
	(46, 'carrea de prueba para nueva facultad', 'CDPPNF', 12, true);


--
-- Data for Name: alumno_voluntario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."alumno_voluntario" ("id_alumno", "rut_alumno", "nombres_alumno", "apellidos_alumno", "correo_alumno", "telefono_alumno", "id_carrera", "is_active") VALUES
	(1, '221234561', 'Catalina Fernanda', 'Muñoz Araya', 'catalina.munoz@alu.ucm.cl', '+56961110001', 24, true),
	(2, '221234562', 'Sebastián Ignacio', 'Fuentes Parra', 'sebastian.fuentes@alu.ucm.cl', '+56961110002', 24, true),
	(3, '221234563', 'Javiera Constanza', 'Reyes Navarro', 'javiera.reyes@alu.ucm.cl', '+56961110003', 23, true),
	(4, '221234564', 'Tomás Alejandro', 'Bravo Castillo', 'tomas.bravo@alu.ucm.cl', '+56961110004', 23, true),
	(5, '221234565', 'Isidora Valentina', 'Saavedra Riquelme', 'isidora.saavedra@alu.ucm.cl', '+56961110005', 14, true),
	(6, '221234566', 'Matías Nicolás', 'Espinoza Cárdenas', 'matias.espinoza@alu.ucm.cl', '+56961110006', 14, true),
	(7, '221234567', 'Antonia Belén', 'Vargas Gutiérrez', 'antonia.vargas@alu.ucm.cl', '+56961110007', 11, true),
	(8, '221234568', 'Benjamín Andrés', 'Herrera Sandoval', 'benjamin.herrera@alu.ucm.cl', '+56961110008', 11, true),
	(9, '221234569', 'Florencia Paz', 'Olivares Zambrano', 'florencia.olivares@alu.ucm.cl', '+56961110009', 17, true),
	(10, '22123456K', 'Martín Esteban', 'Cifuentes Lagos', 'martin.cifuentes@alu.ucm.cl', '+56961110010', 17, true),
	(11, '214294086', 'Alumno ', 'De prueba', 'alumnosprueba@gmail.com', '569 99887766', 1, true),
	(12, '208825240', 'Javier Jorge', 'Cáceres Torres', 'alumnojavier@ucm.cl', '+56912123434', 23, true),
	(13, '137825066', 'Benjamin Javier', 'Oviedo Torres', 'alumno2@ucm.cl', '+56912123456', 23, true),
	(14, '127636311', 'prueba', '10', 'alumno10@ucm.cl', '+56912343456', 46, true);


--
-- Data for Name: ciudad; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."ciudad" ("id_ciudad", "nombre_ciudad", "is_active") VALUES
	(1, 'Talca', true),
	(2, 'Constitución', true),
	(3, 'Curepto', true),
	(4, 'Empedrado', true),
	(5, 'Maule', true),
	(6, 'Pelarco', true),
	(7, 'Pencahue', true),
	(8, 'Río Claro', true),
	(9, 'San Clemente', true),
	(10, 'San Rafael', true),
	(11, 'Curicó', true),
	(12, 'Hualañé', true),
	(13, 'Licantén', true),
	(14, 'Molina', true),
	(15, 'Rauco', true),
	(16, 'Romeral', true),
	(17, 'Sagrada Familia', true),
	(18, 'Teno', true),
	(19, 'Vichuquén', true),
	(20, 'Linares', true),
	(21, 'Colbún', true),
	(22, 'Longaví', true),
	(23, 'Parral', true),
	(24, 'Retiro', true),
	(25, 'San Javier', true),
	(26, 'Villa Alegre', true),
	(27, 'Yerbas Buenas', true),
	(28, 'Cauquenes', true),
	(29, 'Chanco', true),
	(30, 'Pelluhue', true);


--
-- Data for Name: estado_planteamiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."estado_planteamiento" ("id_estado", "nombre_estado", "descripcion_estado", "is_active") VALUES
	(1, 'Pendiente', 'El planteamiento está en espera de aprobación', true),
	(2, 'Aprobado', 'El planteamiento fue aprobado para convertirse en proyecto', true),
	(3, 'Rechazado', 'El planteamiento fue rechazado', true),
	(4, 'Cancelado', 'Planteamiento cancelado por cancelación del proyecto asociado', true),
	(5, 'Finalizado', 'Planteamiento completado exitosamente', true);


--
-- Data for Name: estado_proyecto; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."estado_proyecto" ("id_estado", "nombre_estado", "descripcion_estado", "is_active") VALUES
	(1, 'En Proceso', 'El proyecto está en ejecución activa', true),
	(2, 'Pausado', 'El proyecto fue pausado temporalmente', true),
	(3, 'Cancelado', 'El proyecto fue cancelado', true),
	(4, 'Finalizado', 'El proyecto finalizó exitosamente', true),
	(7, 'Atrasado', 'El proyecto excedió su plazo estimado de ejecución', true),
	(5, 'Disponible', 'Proyecto registrado, aún no iniciado', true);


--
-- Data for Name: estado_solicitud; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."estado_solicitud" ("id_estado", "nombre_estado", "descripcion_estado", "is_active") VALUES
	(1, 'Pendiente', 'La solicitud fue creada y está esperando revisión', true),
	(2, 'Aprobada', 'La solicitud fue aprobada por el gestor de vinculación', true),
	(3, 'Rechazada', 'La solicitud fue rechazada', true),
	(4, 'En Proceso', 'La solicitud está siendo trabajada', true),
	(5, 'Cerrada', 'La solicitud fue cerrada definitivamente', true);


--
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."rol" ("id_rol", "nombre_rol", "descripcion_rol", "is_active") VALUES
	(1, 'cliente', 'Usuario externo que crea solicitudes de vinculación', true),
	(3, 'admin', 'Administrador del sistema con acceso total', true),
	(4, 'profesor', 'Docente que participa en proyectos de vinculación', true),
	(5, 'autoridad', 'Autoridad universitaria con acceso de solo lectura', true),
	(2, 'encargado', 'Gestiona solicitudes y proyectos de su carrera asignada', true);


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."usuario" ("id_usuario", "auth_uid", "rut_usuario", "nombres_usuario", "apellidos_usuario", "telefono_usuario", "is_active", "fecha_creacion", "id_rol") VALUES
	(2, '714bbba3-32b8-43cb-9084-dabc371a3118', '176543219', 'Carlos Andrés', 'Muñoz Sepúlveda', '+56912345602', true, '2026-04-01', 2),
	(3, '86beb092-b6d2-4127-be5b-6fbd5bdb967c', '192345678', 'Patricia Andrea', 'Rojas Valenzuela', '+56912345603', true, '2026-04-02', 2),
	(4, 'bc8b6769-36fb-4503-8fed-a2fda8502528', '168765432', 'Roberto Alejandro', 'Silva Morales', '+56912345604', true, '2026-04-02', 2),
	(5, '5898288a-b920-4e1e-bde0-d505f00f9367', '201234567', 'Andrea Carolina', 'Pérez Bustamante', '+56912345605', true, '2026-04-03', 4),
	(6, '47cbe9d5-3135-4f7a-b0c0-e1686de7ec65', '157654321', 'Francisco Javier', 'López Aravena', '+56912345606', true, '2026-04-03', 4),
	(8, 'eb935a55-6f06-4ed6-b1f0-b263766cf6ae', '198765432', 'Valentina Paz', 'Torres Figueroa', '+56912345608', true, '2026-04-07', 1),
	(9, '88b9eae0-3dde-43b4-93ff-2ed952f2f469', '187654329', 'Diego Alejandro', 'Ramírez Soto', '+56912345609', true, '2026-04-10', 1),
	(10, '6b23dfd4-5052-4853-937e-d32b3801c10f', '173456781', 'Isabel Cristina', 'Contreras Vergara', '+56912345610', true, '2026-04-01', 5),
	(1, '1e3eecb5-14cd-40a7-91c6-f75966d9dfa6', '183456782', 'María Isabel Tucaman', 'González Fuentes', '+56912345601', true, '2026-04-01', 3),
	(12, '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '214294087', 'Benjamín', 'Oviedo', '+56912345609', true, '2026-06-16', 4),
	(13, 'c3ac89ea-9e36-445a-9502-1a6c06e77975', '123456789', 'Autoridad', 'de prueba', '+56988776655', true, '2026-06-25', 5),
	(14, '4605c97b-42ff-4058-b157-122fbb47d569', '214294086', 'Usuario', 'Prueba', '+56964121881', true, '2026-06-25', 1),
	(15, '595ea6a1-c27f-43be-93bf-a83af60d3043', '212492949', 'Carlos Ignacio', 'Cabello Troncoso', '+56945701201', true, '2026-06-25', 1),
	(16, 'dfec9fa3-c1c9-4678-8c72-9367cf355512', '213259776', 'pedro ariel', 'carvajal lagos', '+56968954314', true, '2026-06-30', 1),
	(7, 'a34fc050-1e5b-4f7a-a11c-edd2b1758bd5', '214567890', 'Juan Pablo', 'Hernández Cáceres', '+56912345607', true, '2026-04-05', 1),
	(17, '5559aabb-f80d-460e-b6ab-06fef4a8d5fd', '195745501', 'Nicolas', 'Oviedo', '+56912121212', true, '2026-07-01', 1),
	(18, '38450548-79d5-4fb4-9aab-77e4916032f2', '192266033', 'Benjamin Alejandro', 'Oviedo Mena', '+56964121888', true, '2026-07-02', 1),
	(19, 'c3dc3fa1-b864-4c3f-ac1a-116183412417', '196822364', 'Usuario 12345', 'de prueba 4', '+56912345678', true, '2026-07-02', 4);


--
-- Data for Name: solicitud; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."solicitud" ("id_solicitud", "titulo_solicitud", "descripcion_solicitud", "fecha_creacion_solicitud", "id_estado", "id_usuario", "id_carrera", "id_ciudad", "is_active", "fecha_actualizacion") VALUES
	(2, 'Taller de emprendimiento rural', 'Cooperativa agrícola necesita capacitación en gestión y marketing', '2026-04-10', 2, 7, 24, 9, true, NULL),
	(3, 'Evaluación psicológica infantil', 'Escuela rural solicita evaluación de estudiantes con dificultades de aprendizaje', '2026-04-12', 2, 8, 14, 3, true, NULL),
	(4, 'Campaña de salud preventiva', 'Centro comunitario requiere jornada de control de signos vitales y educación en salud', '2026-04-15', 4, 8, 11, 2, true, NULL),
	(5, 'Diseño de plaza comunitaria', 'Municipalidad necesita diseño participativo para nueva plaza del sector poniente', '2026-04-18', 1, 9, 17, 11, true, NULL),
	(6, 'Plan de negocios para feria libre', 'Agrupación de feriantes necesita apoyo para formalización y plan financiero', '2026-04-22', 1, 9, 24, 20, true, NULL),
	(7, 'Apoyo legal a migrantes', 'ONG solicita talleres de derechos laborales para comunidad migrante', '2026-05-02', 2, 7, 23, 1, true, NULL),
	(8, 'Intervención psicosocial adolescente', 'Liceo municipal requiere talleres de habilidades socioemocionales', '2026-05-05', 3, 8, 14, 14, true, NULL),
	(9, 'Capacitación contable microempresas', 'Asociación de microempresarios necesita apoyo tributario y contable', '2026-05-10', 1, 9, 24, 28, true, NULL),
	(10, 'Rehabilitación espacio público', 'Comunidad solicita propuesta de recuperación de parque deteriorado', '2026-05-15', 4, 7, 17, 7, true, NULL),
	(11, 'Proyecto de prueba', 'Testeo si esta bien mentalmente 😊', '2026-06-16', 1, 7, 12, 5, true, NULL),
	(12, 'De prueba', 'Pendiente', '2026-06-18', 1, 8, 12, 11, true, NULL),
	(13, 'Para probrar', 'hola', '2026-06-18', 1, 8, 14, 14, true, NULL),
	(14, 'Para probar 2', 'hola', '2026-06-18', 1, 8, 14, 14, true, NULL),
	(15, 'Para probar 3', 'hola', '2026-06-18', 1, 8, 14, 15, true, NULL),
	(16, 'Para probar 4', 'hola', '2026-06-18', 1, 8, 10, 8, true, NULL),
	(17, 'Proyecto de prueba 5', 'se', '2026-06-18', 2, 8, 17, 2, true, NULL),
	(19, 'Para derecho', 'derevho', '2026-06-19', 2, 8, 23, 5, true, NULL),
	(21, 'Para los logs2', 'asjdasj', '2026-06-21', 2, 8, 23, 1, true, NULL),
	(22, 'para los 4', 'asjdsja', '2026-06-21', 2, 8, 23, 1, true, '2026-06-21 03:35:43.533+00'),
	(20, 'Prueba para logs Canki', '1234', '2026-06-21', 2, 8, 23, 8, true, '2026-06-22 22:13:23.209+00'),
	(35, 'para rechazar', 'rechazar', '2026-07-02', 3, 17, 23, 1, true, '2026-07-02 18:32:10.93+00'),
	(1, 'Asesoría legal comunitaria', 'Junta de vecinos requiere orientación legal sobre terrenos comunitarios', '2026-04-08', 5, 7, 23, 1, true, '2026-06-25 04:03:23.524563+00'),
	(27, 'hola', 'gola', '2026-06-30', 3, 16, 23, 15, true, '2026-06-30 02:34:21.995+00'),
	(24, 'Solicitud de prueba con archivo', 'hola', '2026-06-24', 5, 8, 23, 1, true, '2026-06-30 02:34:22.206402+00'),
	(25, 'hola', 'sadsadsa', '2026-06-30', 5, 16, 23, 29, true, '2026-06-30 02:34:24.779714+00'),
	(26, 'hola 2', 'hola 2', '2026-06-30', 5, 16, 23, 15, true, '2026-06-30 02:34:26.405488+00'),
	(30, 'prcesos', 'proeso', '2026-07-01', 2, 8, 23, 1, true, '2026-07-01 02:23:50.538+00'),
	(29, 'de prueba para proceso', 'hola', '2026-07-01', 5, 8, 23, 1, true, '2026-07-02 02:45:03.43667+00'),
	(28, 'hola3', '1212', '2026-06-30', 3, 16, 23, 15, true, '2026-07-02 18:10:22.331+00'),
	(36, 'para aprobar', 'para aprobar', '2026-07-02', 2, 17, 23, 18, true, '2026-07-02 18:32:23.286+00'),
	(33, 'Proyecto de vinculación comunitaria Maule', 'Asesoria legal', '2026-07-02', 2, 18, 23, 20, true, '2026-07-02 18:35:43.246+00'),
	(31, 'De prueba', 'hola', '2026-07-02', 5, 17, 23, 1, true, '2026-07-02 19:15:04.065233+00'),
	(34, 'Solicitud de prueba', 'Asesoria legal', '2026-07-02', 5, 17, 23, 1, true, '2026-07-02 19:27:27.859766+00');


--
-- Data for Name: planteamiento_proyecto; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."planteamiento_proyecto" ("id_planteamiento", "titulo_planteamiento", "descripcion_planteamiento", "tiempo_estimado_planteamiento", "id_carrera", "id_solicitud", "id_usuario", "id_estado", "is_active", "fecha_creacion", "fecha_actualizacion") VALUES
	(2, 'Programa de emprendimiento agrícola', 'Talleres semanales de gestión, costos y comercialización', '4 meses', 24, 2, 3, 2, true, NULL, NULL),
	(3, 'Evaluación y apoyo psicopedagógico', 'Screening inicial y derivación de casos prioritarios', '2 meses', 14, 3, 4, 2, true, NULL, NULL),
	(4, 'Jornada de salud comunitaria', 'Control de presión, glicemia y educación en autocuidado', '1 mes', 11, 4, 1, 1, true, NULL, NULL),
	(6, 'Diagnóstico participativo plaza poniente', 'Levantamiento de necesidades con la comunidad para diseño de plaza', '2 meses', 17, 10, 1, 1, true, NULL, NULL),
	(7, 'Clínica jurídica migrantes fase 2', 'Extensión del programa con atención de casos individuales', '3 meses', 23, 7, 2, 3, true, NULL, NULL),
	(8, 'Capacitación comercial cooperativa', 'Plan de negocios y estrategia de ventas para cooperativa', '3 meses', 24, 2, 3, 1, true, NULL, NULL),
	(9, 'Evaluación psicológica fase extendida', 'Segunda fase de evaluación con instrumentos estandarizados', '3 meses', 14, 3, 4, 1, true, NULL, NULL),
	(1, 'Clínica jurídica vecinal', 'Estudiantes de Derecho atenderán consultas legales sobre terrenos', '3 meses', 23, 1, 2, 3, true, NULL, '2026-06-22 04:02:24.83+00'),
	(10, 'Asesoría legal terrenos fase 2', 'Tramitación de regularización de títulos de dominio', '6 meses', 23, 1, 2, 2, true, NULL, '2026-06-22 04:05:47.511+00'),
	(11, 'De prueba', 'ejejejejej', '3 meses', 23, 19, 12, 3, true, NULL, '2026-06-22 04:15:47.942+00'),
	(14, 'Planteamiento Canki', 'Descripción del proyecto.', '3 meses', 23, 20, 12, 3, true, '2026-06-22 22:16:37.814+00', '2026-06-22 22:23:11.285+00'),
	(12, 'jola', 'asdjasjd', '3 meses', 23, 21, 12, 4, true, '2026-06-21 04:24:08.956+00', '2026-06-22 23:40:30.71+00'),
	(5, 'Taller de derechos laborales migrantes', 'Ciclo de 6 sesiones sobre legislación laboral chilena', '2 meses', 23, 7, 2, 4, true, NULL, '2026-06-22 23:48:32.853+00'),
	(13, 'asjdja', 'hola', '3 meses', 23, 7, 12, 4, true, '2026-06-22 04:05:35.212+00', '2026-06-22 23:49:49.219467+00'),
	(15, 'asd', 'asdasd', '3 meses', 23, 1, 12, 4, true, '2026-06-23 23:36:45.398+00', '2026-06-23 23:37:41.672+00'),
	(16, 'asdjaj', 'asdjasjdaj', '3 meses', 23, 1, 12, 5, true, '2026-06-24 00:17:15.024+00', '2026-06-25 04:03:23.524563+00'),
	(17, 'Hola', 'hola', '3 meses', 23, 24, 12, 4, true, '2026-06-24 04:15:36.572+00', '2026-06-25 05:32:51.98+00'),
	(18, 'Para probar', 'hola', '1 días', 23, 24, 12, 4, true, '2026-06-25 05:33:12.977+00', '2026-06-25 05:34:00.496+00'),
	(19, '3', 'qweqwe', '1 días', 23, 24, 12, 5, true, '2026-06-25 05:34:14.202+00', '2026-06-30 02:34:22.206402+00'),
	(20, 'Para pedrito', 'pedrito muchas por la ayuda amigo', '1 días', 23, 25, 12, 5, true, '2026-06-30 02:28:51.565+00', '2026-06-30 02:34:24.779714+00'),
	(21, 'pedrito', 'pedro 2', '1 semanas', 23, 26, 12, 5, true, '2026-06-30 02:31:00.373+00', '2026-06-30 02:34:26.405488+00'),
	(22, 'proceso', 'proceso', '2 días', 23, 29, 12, 4, true, '2026-07-01 01:54:53.355+00', '2026-07-01 02:02:32.099+00'),
	(24, 'proces', 'proces', '1 semanas', 23, 30, 12, 4, true, '2026-07-01 02:24:51.952+00', '2026-07-01 02:26:48.866+00'),
	(23, 'proceso', 'proceso', '1 días', 23, 29, 12, 4, true, '2026-07-01 02:03:11.548+00', '2026-07-01 02:26:49.933+00'),
	(25, 'aaa', 'aaa', '1 semanas', 23, 29, 12, 5, true, '2026-07-01 02:27:36.916+00', '2026-07-02 02:45:03.43667+00'),
	(30, 'Planteamiento para rechazar', 'rechzarar', '1 semanas', 23, 36, 12, 3, true, '2026-07-02 18:42:10.283+00', '2026-07-02 18:43:35.13+00'),
	(31, 'rechazaree', 'rechazar', '2 días', 23, 36, 12, 3, true, '2026-07-02 18:46:26.443+00', '2026-07-02 19:09:31.722+00'),
	(26, 'hola', 'hola', '1 semanas', 23, 31, 12, 5, true, '2026-07-02 02:48:31.39+00', '2026-07-02 19:15:04.065233+00'),
	(29, 'Asesoria legal', 'Asesoria legal para cliente en conjunto a 1 alumno', '2 días', 23, 34, 12, 5, true, '2026-07-02 18:40:13.55+00', '2026-07-02 19:27:27.859766+00');


--
-- Data for Name: proyecto; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."proyecto" ("id_proyecto", "id_planteamiento", "id_estado", "fecha_inicio", "fecha_fin", "is_active") VALUES
	(2, 2, 1, '2026-04-25', NULL, true),
	(3, 3, 4, '2026-04-22', '2026-05-20', true),
	(6, 11, 3, '2026-06-19', '2026-06-19', true),
	(7, 11, 3, '2026-06-21', '2026-06-21', true),
	(8, 11, 3, '2026-06-20', '2026-06-28', true),
	(1, 1, 3, '2026-04-20', NULL, true),
	(9, 13, 3, '2026-06-22', '2026-06-24', true),
	(10, 13, 3, '2026-06-22', '2026-06-29', true),
	(11, 11, 3, '2026-07-01', '2026-12-01', true),
	(12, 14, 3, '2026-06-23', '2026-06-24', true),
	(13, 12, 3, '2026-07-01', '2026-12-01', true),
	(4, 5, 3, '2026-05-12', NULL, true),
	(14, 15, 3, '2026-06-18', '2026-07-12', true),
	(15, 16, 4, '2026-06-23', '2026-06-23', true),
	(16, 17, 3, '2026-06-24', '2026-06-25', true),
	(17, 18, 3, '2026-06-25', '2026-06-26', true),
	(18, 19, 4, '2026-06-26', '2026-06-27', true),
	(19, 20, 4, '2026-06-29', '2026-06-30', true),
	(20, 21, 4, '2026-06-28', '2026-07-05', true),
	(21, 22, 3, '2026-07-02', '2026-07-04', true),
	(23, 24, 3, '2026-06-30', '2026-07-07', true),
	(22, 23, 3, '2026-06-30', '2026-07-01', true),
	(24, 25, 4, '2026-06-30', '2026-07-07', true),
	(25, 26, 4, '2026-07-02', '2026-07-09', true),
	(26, 29, 4, '2026-07-02', '2026-07-04', true);


--
-- Data for Name: archivo; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."archivo" ("id_archivo", "nombre_archivo", "ruta_archivo", "tipo_archivo", "id_solicitud", "id_planteamiento", "id_proyecto", "is_active") VALUES
	(1, 'carta_solicitud_jv.pdf', '/archivos/solicitudes/1/', 'pdf', 1, NULL, NULL, true),
	(2, 'acta_reunion_cooperativa.pdf', '/archivos/solicitudes/2/', 'pdf', 2, NULL, NULL, true),
	(3, 'informe_escuela_curepto.docx', '/archivos/solicitudes/3/', 'docx', 3, NULL, NULL, true),
	(4, 'plan_clinica_juridica.pdf', '/archivos/planteamientos/1/', 'pdf', NULL, 1, NULL, true),
	(5, 'cronograma_emprendimiento.xlsx', '/archivos/planteamientos/2/', 'xlsx', NULL, 2, NULL, true),
	(6, 'protocolo_evaluacion_psi.pdf', '/archivos/planteamientos/3/', 'pdf', NULL, 3, NULL, true),
	(7, 'acta_inicio_proyecto1.pdf', '/archivos/proyectos/1/', 'pdf', NULL, NULL, 1, true),
	(8, 'registro_asistencia_p2.xlsx', '/archivos/proyectos/2/', 'xlsx', NULL, NULL, 2, true),
	(9, 'informe_final_psi.pdf', '/archivos/proyectos/3/', 'pdf', NULL, NULL, 3, true),
	(10, 'programa_taller_migrantes.pdf', '/archivos/planteamientos/5/', 'pdf', NULL, 5, NULL, true),
	(11, 'UCM.png', 'solicitudes/24/1782265518999_UCM.png', 'png', 24, NULL, NULL, true),
	(12, 'UCM.png', 'planteamientos/17/1782274536840_UCM.png', 'png', NULL, 17, NULL, true),
	(13, 'ucmito.png', 'planteamientos/17/1782274647876_ucmito.png', 'png', NULL, 17, NULL, true),
	(14, 'Jira Backlog Vinculacion.png', 'proyectos/16/1782274764407_Jira_Backlog_Vinculacion.png', 'png', NULL, NULL, 16, true),
	(15, '8690746043_15077423713_1750580382024.png', 'solicitudes/25/1782785712132_8690746043_15077423713_1750580382024.png', 'png', 25, NULL, NULL, true),
	(17, 'ucmlogo (1).png', 'solicitudes/33/1783014008261_ucmlogo__1_.png', 'png', 33, NULL, NULL, true),
	(18, 'ucmlogo (1).png', 'solicitudes/34/1783015603798_ucmlogo__1_.png', 'png', 34, NULL, NULL, true);


--
-- Data for Name: autoridad; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."autoridad" ("id_usuario", "cargo", "is_active") VALUES
	(10, 'Vicerrectora de Vinculación con el Medio', true);


--
-- Data for Name: detalle_planteamiento_alumno; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."detalle_planteamiento_alumno" ("id_planteamiento", "id_alumno", "is_active") VALUES
	(1, 3, true),
	(1, 4, true),
	(2, 1, true),
	(2, 2, true),
	(3, 5, true),
	(3, 6, true),
	(5, 3, true),
	(5, 4, true),
	(6, 9, true),
	(6, 10, true),
	(11, 9, true),
	(13, 10, true),
	(13, 9, true),
	(14, 6, true),
	(14, 8, true),
	(14, 9, true),
	(15, 10, true),
	(16, 3, true),
	(17, 3, true),
	(18, 3, true),
	(19, 3, true),
	(20, 3, true),
	(21, 4, true),
	(22, 3, true),
	(23, 3, true),
	(24, 4, true),
	(24, 3, true),
	(25, 3, true),
	(26, 3, true),
	(26, 4, true),
	(29, 3, true);


--
-- Data for Name: gestor_vinculacion_carrera; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."gestor_vinculacion_carrera" ("id_usuario", "id_carrera", "is_active") VALUES
	(2, 23, true),
	(3, 24, true),
	(4, 14, true);


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."logs" ("id_log", "id_usuario", "accion", "tabla_afectada", "descripcion", "fecha") VALUES
	(1, 1, 'INSERT', 'usuario', 'Admin creó usuarios iniciales del sistema', '2026-04-01 13:00:00+00'),
	(2, 2, 'UPDATE', 'solicitud', 'Gestor Carlos aprobó solicitud #1 - Asesoría legal', '2026-04-09 14:30:00+00'),
	(3, 3, 'UPDATE', 'solicitud', 'Gestora Patricia aprobó solicitud #2 - Emprendimiento', '2026-04-11 15:15:00+00'),
	(4, 4, 'UPDATE', 'solicitud', 'Gestor Roberto aprobó solicitud #3 - Eval. psicológica', '2026-04-13 13:45:00+00'),
	(5, 2, 'INSERT', 'planteamiento_proyecto', 'Gestor Carlos creó planteamiento para solicitud #1', '2026-04-14 18:20:00+00'),
	(6, 3, 'INSERT', 'planteamiento_proyecto', 'Gestora Patricia creó planteamiento para solicitud #2', '2026-04-15 14:00:00+00'),
	(7, 2, 'INSERT', 'proyecto', 'Gestor Carlos creó proyecto desde planteamiento #1', '2026-04-20 12:30:00+00'),
	(8, 3, 'INSERT', 'proyecto', 'Gestora Patricia creó proyecto desde planteamiento #2', '2026-04-25 13:00:00+00'),
	(9, 4, 'UPDATE', 'solicitud', 'Gestor Roberto rechazó solicitud #8 - Intervención psicosocial', '2026-05-06 20:00:00+00'),
	(10, 4, 'UPDATE', 'proyecto', 'Gestor Roberto marcó proyecto #3 como Finalizado', '2026-05-20 21:30:00+00'),
	(11, 8, 'CREAR_SOLICITUD', 'solicitud', 'Tu solicitud "Prueba para logs" fue enviada y está pendiente de revisión', '2026-06-21 03:14:48.383+00'),
	(12, 8, 'CREAR_SOLICITUD', 'solicitud', 'Tu solicitud "Para los logs2" fue enviada y está pendiente de revisión', '2026-06-21 03:16:57.115+00');


--
-- Data for Name: observacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."observacion" ("id_observacion", "id_proyecto", "detalle_observacion", "fecha_observacion", "is_active") VALUES
	(1, 1, 'Primera sesión de atención realizada con éxito. 12 personas atendidas.', '2026-04-25', true),
	(2, 1, 'Se detectó alta demanda; se propone agregar una sesión semanal adicional.', '2026-05-02', true),
	(3, 1, 'Reunión con dirigentes vecinales para coordinar próximas sesiones.', '2026-05-10', true),
	(4, 2, 'Primer taller completado. Asistieron 18 de 25 inscritos.', '2026-04-28', true),
	(5, 2, 'Se entregó material de apoyo sobre costos de producción.', '2026-05-05', true),
	(6, 2, 'Taller práctico de plan de negocios. Muy buena recepción.', '2026-05-15', true),
	(7, 3, 'Evaluación inicial completada. 8 de 15 estudiantes requieren seguimiento.', '2026-04-28', true),
	(8, 3, 'Informes individuales entregados a la dirección del establecimiento.', '2026-05-12', true),
	(9, 3, 'Proyecto finalizado. Se realizó reunión de cierre con apoderados.', '2026-05-20', true),
	(10, 4, 'Primera sesión del taller de derechos laborales. 22 asistentes.', '2026-05-18', true),
	(11, 26, 'El cliente recibió asesoría legal', '2026-07-02', true);


--
-- Data for Name: profesor; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profesor" ("id_usuario", "id_carrera", "is_active") VALUES
	(5, 24, true),
	(6, 14, true),
	(12, 23, true),
	(19, 1, true);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('vcm-archivos', 'vcm-archivos', NULL, '2026-06-24 01:25:01.15783+00', '2026-06-24 01:25:01.15783+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('17c653a3-1179-49d6-90ad-1820e6eb23cf', 'vcm-archivos', 'solicitudes/24/1782265518999_UCM.png', 'eb935a55-6f06-4ed6-b1f0-b263766cf6ae', '2026-06-24 01:44:57.653637+00', '2026-06-24 01:44:57.653637+00', '2026-06-24 01:44:57.653637+00', '{"eTag": "\"3b052c25bf793e48437151a7e6abedd8\"", "size": 7862, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-24T01:44:58.000Z", "contentLength": 7862, "httpStatusCode": 200}', 'b676cd70-4223-46e7-87d5-76833a651a5d', 'eb935a55-6f06-4ed6-b1f0-b263766cf6ae', '{}'),
	('d4c52c73-a308-4fe1-afcb-6566fe5b5fe9', 'vcm-archivos', 'planteamientos/17/1782274536840_UCM.png', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '2026-06-24 04:15:15.442465+00', '2026-06-24 04:15:15.442465+00', '2026-06-24 04:15:15.442465+00', '{"eTag": "\"3b052c25bf793e48437151a7e6abedd8\"", "size": 7862, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-24T04:15:16.000Z", "contentLength": 7862, "httpStatusCode": 200}', '46746488-1fe3-4085-a630-26d7a0c40381', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '{}'),
	('f0843f15-e42a-4a89-a5d0-e6dcf09cd6f5', 'vcm-archivos', 'planteamientos/17/1782274647876_ucmito.png', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '2026-06-24 04:17:06.786582+00', '2026-06-24 04:17:06.786582+00', '2026-06-24 04:17:06.786582+00', '{"eTag": "\"f519448857dcbab5001042badea1dee6\"", "size": 27623, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-24T04:17:07.000Z", "contentLength": 27623, "httpStatusCode": 200}', '10a602a0-7256-4219-8685-8352cb69e688', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '{}'),
	('a4e3ae00-9686-4f9d-836b-2e24c57d1841', 'vcm-archivos', 'proyectos/16/1782274764407_Jira_Backlog_Vinculacion.png', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '2026-06-24 04:19:03.629921+00', '2026-06-24 04:19:03.629921+00', '2026-06-24 04:19:03.629921+00', '{"eTag": "\"5154e3d780c706795c018a2c4a52774e\"", "size": 283410, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-24T04:19:04.000Z", "contentLength": 283410, "httpStatusCode": 200}', 'e9457bd4-a679-4862-bb2e-2b8888fcbbb0', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '{}'),
	('af2cc42a-9149-44d9-9835-fbff0013146c', 'vcm-archivos', 'solicitudes/25/1782785712132_8690746043_15077423713_1750580382024.png', 'dfec9fa3-c1c9-4678-8c72-9367cf355512', '2026-06-30 02:16:25.615199+00', '2026-06-30 02:16:25.615199+00', '2026-06-30 02:16:25.615199+00', '{"eTag": "\"c725effc7fd2f98ee84565a6142f561c\"", "size": 1310494, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-06-30T02:16:26.000Z", "contentLength": 1310494, "httpStatusCode": 200}', '1df28d67-6e1b-4480-bba9-ef26e48940d8', 'dfec9fa3-c1c9-4678-8c72-9367cf355512', '{}'),
	('4c5b591e-861c-4856-8c45-a01cd067ed93', 'vcm-archivos', 'solicitudes/33/1783014008261_ucmlogo__1_.png', '38450548-79d5-4fb4-9aab-77e4916032f2', '2026-07-02 17:40:11.766863+00', '2026-07-02 17:40:11.766863+00', '2026-07-02 17:40:11.766863+00', '{"eTag": "\"6fd12d7aeccee3ab125155d9522510ee\"", "size": 58905, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-02T17:40:12.000Z", "contentLength": 58905, "httpStatusCode": 200}', 'ea754997-e5a1-4420-8e70-4a654c14fca2', '38450548-79d5-4fb4-9aab-77e4916032f2', '{}'),
	('3713484c-ec27-4c04-b672-026088a9121d', 'vcm-archivos', 'solicitudes/34/1783015603798_ucmlogo__1_.png', '5559aabb-f80d-460e-b6ab-06fef4a8d5fd', '2026-07-02 18:06:47.440219+00', '2026-07-02 18:06:47.440219+00', '2026-07-02 18:06:47.440219+00', '{"eTag": "\"6fd12d7aeccee3ab125155d9522510ee\"", "size": 58905, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-02T18:06:48.000Z", "contentLength": 58905, "httpStatusCode": 200}', '8190a29e-f469-4cfa-a2bc-fbf5c01e234f', '5559aabb-f80d-460e-b6ab-06fef4a8d5fd', '{}'),
	('12030e8a-e346-4763-9922-5753245e11e9', 'vcm-archivos', 'planteamientos/27/1783016053113_ucmlogo__1_.png', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '2026-07-02 18:14:16.955047+00', '2026-07-02 18:14:16.955047+00', '2026-07-02 18:14:16.955047+00', '{"eTag": "\"6fd12d7aeccee3ab125155d9522510ee\"", "size": 58905, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-07-02T18:14:17.000Z", "contentLength": 58905, "httpStatusCode": 200}', '016fb52b-c51b-4325-92a2-6c90160f61c2', '0ab3d15d-db3c-4b41-bf8c-62f7ad42a1eb', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 255, true);


--
-- Name: alumno_voluntario_id_alumno_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."alumno_voluntario_id_alumno_seq"', 14, true);


--
-- Name: archivo_id_archivo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."archivo_id_archivo_seq"', 19, true);


--
-- Name: carrera_id_carrera_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."carrera_id_carrera_seq"', 46, true);


--
-- Name: ciudad_id_ciudad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ciudad_id_ciudad_seq"', 30, true);


--
-- Name: estado_planteamiento_id_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."estado_planteamiento_id_estado_seq"', 6, true);


--
-- Name: estado_proyecto_id_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."estado_proyecto_id_estado_seq"', 9, true);


--
-- Name: estado_solicitud_id_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."estado_solicitud_id_estado_seq"', 7, true);


--
-- Name: facultad_id_facultad_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."facultad_id_facultad_seq"', 12, true);


--
-- Name: logs_id_log_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."logs_id_log_seq"', 12, true);


--
-- Name: observacion_id_observacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."observacion_id_observacion_seq"', 11, true);


--
-- Name: planteamiento_proyecto_id_planteamiento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."planteamiento_proyecto_id_planteamiento_seq"', 31, true);


--
-- Name: proyecto_id_proyecto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."proyecto_id_proyecto_seq"', 26, true);


--
-- Name: rol_id_rol_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."rol_id_rol_seq"', 5, true);


--
-- Name: solicitud_id_solicitud_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."solicitud_id_solicitud_seq"', 36, true);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."usuario_id_usuario_seq"', 19, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict bk3jDwkrdQzZ8Qvl702o6CEU1fcyd79rXO3y1fvbKFmowiGX5oD05xaHJMpXObr

RESET ALL;
