<img width="1920" height="1440" alt="776shots_so" src="https://github.com/user-attachments/assets/ac74862f-332e-4022-bfdb-222711ef7a94" />EcoNest – Investissement durable et rentable
Présentation

EcoNest est une plateforme d’investissement durable qui transforme les déchets en valeur économique.

Origine : Inde, lancé en septembre 2024 au Moyen-Orient

Expansion Afrique de l’Ouest : 12 avril 2025 – 12 avril 2026!
[Uploading 776shots_so.png…]()


Mission : Créer des opportunités financières accessibles à tous tout en protégeant l’environnement.

Objectif : Impacter 500 000 foyers et créer 2 000 emplois locaux.

Vision

Allier investissement rentable et écologie.
Slogan : “Investissez intelligemment, gagnez durablement. Transformons les déchets, donnons-leur de la valeur, bâtissons un avenir responsable.”

Technologies utilisées

Frontend : Nuxt.js

Backend & Base de données : Supabase

Graphiques : Canvas / Charts pour visualiser les gains

Déploiement : [Préciser si Vercel, Netlify ou autre]

Fonctionnement

Collecte de déchets recyclables (plastique, aluminium, fer…) par les équipes locales.

Vente à des industries partenaires (ex. Nestlé).

Les investisseurs gagnent automatiquement des revenus journaliers selon leur investissement.

Investissement accessible dès 10 000 FCFA jusqu’à 300 000 FCFA.

Boîtes de collecte et rendements
Boîte	Investissement	Gain/jour	Retrait minimum	Retrait après 30 jours	Bénéfice après 30 jours
1	10 000	600	6 000	6 000	8 000
2	20 000	1 200	12 000	12 000	16 000
3	50 000	3 000	30 000	30 000	40 000
4	100 000	7 000	70 000	70 000	110 000
5	150 000	11 000	110 000	110 000	180 000
6	300 000	22 000	220 000	…	…
Installation (Local)
# Cloner le projet
git clone https://github.com/votre-utilisateur/econest.git
cd econest

# Installer les dépendances
npm install

# Lancer le projet en développement
npm run dev

Contribution
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.asset (
  id bigint NOT NULL DEFAULT nextval('asset_id_seq'::regclass),
  image text NOT NULL,
  description text,
  CONSTRAINT asset_pkey PRIMARY KEY (id)
);
CREATE TABLE public.assigne_avatar_user (
  id bigint NOT NULL DEFAULT nextval('assigne_avatar_user_id_seq'::regclass),
  idavatar bigint NOT NULL,
  id_user uuid NOT NULL,
  CONSTRAINT assigne_avatar_user_pkey PRIMARY KEY (id),
  CONSTRAINT assigne_avatar_user_idavatar_fkey FOREIGN KEY (idavatar) REFERENCES public.avatar(id),
  CONSTRAINT assigne_avatar_user_id_user_fkey FOREIGN KEY (id_user) REFERENCES auth.users(id)
);
CREATE TABLE public.assigne_user_grade (
  id bigint NOT NULL DEFAULT nextval('assigne_user_grade_id_seq'::regclass),
  id_user uuid NOT NULL,
  id_grade bigint NOT NULL,
  date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT assigne_user_grade_pkey PRIMARY KEY (id),
  CONSTRAINT assigne_user_grade_id_grade_fkey FOREIGN KEY (id_grade) REFERENCES public.grades(id),
  CONSTRAINT assigne_user_grade_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(auth_id)
);
CREATE TABLE public.avatar (
  id bigint NOT NULL DEFAULT nextval('avatar_id_seq'::regclass),
  image text NOT NULL,
  CONSTRAINT avatar_pkey PRIMARY KEY (id)
);
CREATE TABLE public.grades (
  id bigint NOT NULL DEFAULT nextval('grades_id_seq'::regclass),
  grade_name character varying NOT NULL,
  description text,
  daily_income numeric DEFAULT 600,
  amounts numeric DEFAULT 0,
  minimum_withdrawal numeric,
  CONSTRAINT grades_pkey PRIMARY KEY (id)
);
CREATE TABLE public.message (
  id bigint NOT NULL DEFAULT nextval('message_id_seq'::regclass),
  id_ticket bigint NOT NULL,
  message text NOT NULL,
  CONSTRAINT message_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notification (
  id bigint NOT NULL DEFAULT nextval('notification_id_seq'::regclass),
  texte text NOT NULL,
  type character varying DEFAULT 'unread'::character varying,
  CONSTRAINT notification_pkey PRIMARY KEY (id)
);
CREATE TABLE public.recharges (
  id bigint NOT NULL DEFAULT nextval('recharges_new_id_seq'::regclass),
  id_user uuid,
  amount numeric NOT NULL,
  phone character varying NOT NULL,
  methode character varying,
  reference character varying,
  identifier character varying,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT recharges_pkey PRIMARY KEY (id),
  CONSTRAINT recharges_new_id_user_fkey FOREIGN KEY (id_user) REFERENCES auth.users(id)
);
CREATE TABLE public.referral_rewards (
  id bigint NOT NULL DEFAULT nextval('referral_rewards_id_seq'::regclass),
  user_auth_id uuid NOT NULL,
  parent_auth_id uuid NOT NULL,
  reward_amount integer NOT NULL,
  rewarded_at timestamp with time zone DEFAULT now(),
  CONSTRAINT referral_rewards_pkey PRIMARY KEY (id),
  CONSTRAINT fk_user FOREIGN KEY (user_auth_id) REFERENCES public.users(auth_id),
  CONSTRAINT fk_parent FOREIGN KEY (parent_auth_id) REFERENCES public.users(auth_id)
);
CREATE TABLE public.roles (
  id bigint NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
  role_name character varying NOT NULL UNIQUE,
  description text,
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ticket_feedback (
  id_ticket bigint NOT NULL DEFAULT nextval('ticket_feedback_id_ticket_seq'::regclass),
  id_user uuid NOT NULL,
  CONSTRAINT ticket_feedback_pkey PRIMARY KEY (id_ticket),
  CONSTRAINT ticket_feedback_id_user_fkey FOREIGN KEY (id_user) REFERENCES auth.users(id)
);
CREATE TABLE public.users (
  id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  phone character varying NOT NULL UNIQUE,
  invitecode character varying,
  is_active boolean DEFAULT true,
  id_role bigint DEFAULT '1'::bigint,
  parent_invitecode text,
  user_name text UNIQUE,
  auth_id uuid UNIQUE,
  fake boolean DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_role_fkey FOREIGN KEY (id_role) REFERENCES public.roles(id)
);
CREATE TABLE public.wallets (
  id bigint NOT NULL DEFAULT nextval('wallets_id_seq'::regclass),
  id_user uuid NOT NULL UNIQUE,
  password text NOT NULL,
  telephone_withdrawls character varying,
  methode_withdrawls character varying,
  CONSTRAINT wallets_pkey PRIMARY KEY (id),
  CONSTRAINT wallets_id_user_fkey FOREIGN KEY (id_user) REFERENCES auth.users(id)
);
CREATE TABLE public.withdrawls (
  id bigint NOT NULL DEFAULT nextval('withdrawls_id_seq'::regclass),
  id_user uuid NOT NULL,
  amount numeric NOT NULL,
  status character varying DEFAULT 'En cours...'::character varying,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT withdrawls_pkey PRIMARY KEY (id),
  CONSTRAINT withdrawls_id_user_fkey FOREIGN KEY (id_user) REFERENCES auth.users(id)
);
Les contributions sont les bienvenues ! Pour proposer des améliorations ou corriger des bugs, veuillez créer une pull request.
