SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
00000000-0000-0000-0000-000000000000	202dddec-9e7e-4e6c-a81c-7e656db1aab7	{"action":"user_confirmation_requested","actor_id":"f642043e-069c-4717-8cdf-e73b5363833b","actor_username":"vitaliy.p@halo-lab.team","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-04-24 10:07:44.442619+00	
00000000-0000-0000-0000-000000000000	fc554d90-dce8-4e6b-82db-91be95910879	{"action":"user_signedup","actor_id":"f642043e-069c-4717-8cdf-e73b5363833b","actor_username":"vitaliy.p@halo-lab.team","actor_via_sso":false,"log_type":"team"}	2025-04-24 10:08:34.065815+00	
00000000-0000-0000-0000-000000000000	eebdf89b-2129-4118-85c8-c3a3a4da25f5	{"action":"login","actor_id":"f642043e-069c-4717-8cdf-e73b5363833b","actor_username":"vitaliy.p@halo-lab.team","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}	2025-04-24 10:08:34.791282+00	
00000000-0000-0000-0000-000000000000	9258d4f4-5e29-449b-8e2d-27bc6c379ac9	{"action":"user_repeated_signup","actor_id":"f642043e-069c-4717-8cdf-e73b5363833b","actor_username":"vitaliy.p@halo-lab.team","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-04-24 10:12:29.45544+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	f642043e-069c-4717-8cdf-e73b5363833b	authenticated	authenticated	vitaliy.p@halo-lab.team	$2a$10$QYYsZGUEPQUGlsh/wg0cEepKD5GEQJT3HFGZ6xrIdkQAe49D.DqZ6	2025-04-24 10:08:34.066401+00	\N		2025-04-24 10:07:44.45189+00		\N			\N	2025-04-24 10:08:34.79254+00	{"provider": "email", "providers": ["email"]}	{"sub": "f642043e-069c-4717-8cdf-e73b5363833b", "email": "vitaliy.p@halo-lab.team", "email_verified": true, "phone_verified": false}	\N	2025-04-24 10:07:44.400559+00	2025-04-24 10:08:34.806704+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
f642043e-069c-4717-8cdf-e73b5363833b	f642043e-069c-4717-8cdf-e73b5363833b	{"sub": "f642043e-069c-4717-8cdf-e73b5363833b", "email": "vitaliy.p@halo-lab.team", "email_verified": true, "phone_verified": false}	email	2025-04-24 10:07:44.430544+00	2025-04-24 10:07:44.431136+00	2025-04-24 10:07:44.431136+00	4829932f-6a43-452d-9e6c-777875dc0f29
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") FROM stdin;
add18161-7193-44af-9cd5-f13fb6a1098c	f642043e-069c-4717-8cdf-e73b5363833b	2025-04-24 10:08:34.7951+00	2025-04-24 10:08:34.7951+00	\N	aal1	\N	\N	node	92.253.236.148	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
add18161-7193-44af-9cd5-f13fb6a1098c	2025-04-24 10:08:34.807269+00	2025-04-24 10:08:34.807269+00	email/signup	eb87756f-de54-4a2d-a2f4-54eaceeb26cc
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	1	qbfkby32qsf4	f642043e-069c-4717-8cdf-e73b5363833b	f	2025-04-24 10:08:34.799629+00	2025-04-24 10:08:34.799629+00	\N	add18161-7193-44af-9cd5-f13fb6a1098c
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."teams" ("id", "created_at", "updated_at", "name", "slug", "description", "logo_url", "metadata") FROM stdin;
\.


--
-- Data for Name: podcasts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."podcasts" ("id", "created_at", "updated_at", "title", "description", "audio_url", "user_id", "status", "metadata", "team_id") FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."posts" ("id", "created_at", "updated_at", "title", "content", "user_id", "status", "metadata", "team_id", "merged_contents", "tags", "templates", "transcript", "tweet_thread_content", "refinement_instructions", "merge_instructions", "template_ids") FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."profiles" ("id", "created_at", "updated_at", "full_name", "avatar_url", "website", "bio", "email", "metadata") FROM stdin;
\.


--
-- Data for Name: team_invites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."team_invites" ("id", "created_at", "updated_at", "team_id", "email", "role", "token", "expires_at") FROM stdin;
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."team_members" ("id", "created_at", "updated_at", "team_id", "user_id", "role") FROM stdin;
\.


--
-- Data for Name: templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."templates" ("id", "created_at", "updated_at", "title", "content", "user_id", "metadata", "team_id") FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") FROM stdin;
posts	posts	\N	2025-04-24 10:49:25.846337+00	2025-04-24 10:49:25.846337+00	t	f	\N	\N	\N
avatars	avatars	\N	2025-04-24 10:49:25.846337+00	2025-04-24 10:49:25.846337+00	t	f	\N	\N	\N
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
