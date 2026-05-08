create extension if not exists "pgjwt" with schema "extensions";


create type "public"."case_status" as enum ('pending', 'active', 'closed');

create type "public"."user_role" as enum ('public', 'agent', 'admin');

create table "public"."case_number_tracker" (
    "category" character varying(3) not null,
    "left_number" integer default 0,
    "right_part" character varying(2) default '00'::character varying
);


create table "public"."missing_persons" (
    "case_number" character varying(13) not null,
    "legal_first_name" character varying(100) not null,
    "legal_last_name" character varying(100) not null,
    "date_of_birth" date,
    "age" integer,
    "gender" character varying(10),
    "town_location" character varying(100),
    "date_of_last_contact" date,
    "reporter_name" character varying(100),
    "reporter_contact" character varying(50),
    "physical_description" text,
    "last_seen_wearing" text,
    "medical_conditions" text,
    "emergency_contacts" text,
    "possible_locations" text,
    "circumstances" text,
    "tracking_number" character varying(4),
    "reporter_id" uuid,
    "officer_id" uuid,
    "status" case_status default 'pending'::case_status,
    "photo_url" text
);


create table "public"."profiles" (
    "id" uuid not null,
    "username" text not null,
    "email" text not null,
    "role" user_role default 'public'::user_role,
    "created_at" timestamp without time zone default now()
);


create table "public"."unclaimed_persons" (
    "case_number" character varying(13) not null,
    "tracking_number" character varying(4),
    "legal_first_name" character varying(100),
    "legal_last_name" character varying(100),
    "date_of_birth" date,
    "age" integer,
    "gender" character varying(10),
    "town_location" character varying(100),
    "date_of_last_contact" date,
    "physical_description" text,
    "last_seen_wearing" text,
    "medical_conditions" text,
    "found_location" character varying(100),
    "date_of_death" date,
    "cause_of_death" text,
    "current_status" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);


create table "public"."unidentified_persons" (
    "case_number" character varying(13) not null,
    "tracking_number" character varying(4),
    "description" text,
    "found_location" character varying(100),
    "date_found" date,
    "date_of_death" date,
    "cause_of_death" text,
    "medical_conditions" text,
    "current_status" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "gender" character varying(10)
);


CREATE UNIQUE INDEX case_number_tracker_pkey ON public.case_number_tracker USING btree (category);

CREATE UNIQUE INDEX missing_persons_pkey ON public.missing_persons USING btree (case_number);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX unclaimed_persons_pkey ON public.unclaimed_persons USING btree (case_number);

CREATE UNIQUE INDEX unclaimed_persons_tracking_number_key ON public.unclaimed_persons USING btree (tracking_number);

CREATE UNIQUE INDEX unidentified_persons_pkey ON public.unidentified_persons USING btree (case_number);

CREATE UNIQUE INDEX unidentified_persons_tracking_number_key ON public.unidentified_persons USING btree (tracking_number);

alter table "public"."case_number_tracker" add constraint "case_number_tracker_pkey" PRIMARY KEY using index "case_number_tracker_pkey";

alter table "public"."missing_persons" add constraint "missing_persons_pkey" PRIMARY KEY using index "missing_persons_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."unclaimed_persons" add constraint "unclaimed_persons_pkey" PRIMARY KEY using index "unclaimed_persons_pkey";

alter table "public"."unidentified_persons" add constraint "unidentified_persons_pkey" PRIMARY KEY using index "unidentified_persons_pkey";

alter table "public"."missing_persons" add constraint "missing_persons_officer_id_fkey" FOREIGN KEY (officer_id) REFERENCES profiles(id) ON DELETE SET NULL not valid;

alter table "public"."missing_persons" validate constraint "missing_persons_officer_id_fkey";

alter table "public"."missing_persons" add constraint "missing_persons_reporter_id_fkey" FOREIGN KEY (reporter_id) REFERENCES profiles(id) ON DELETE SET NULL not valid;

alter table "public"."missing_persons" validate constraint "missing_persons_reporter_id_fkey";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."unclaimed_persons" add constraint "unclaimed_persons_tracking_number_key" UNIQUE using index "unclaimed_persons_tracking_number_key";

alter table "public"."unidentified_persons" add constraint "unidentified_persons_gender_check" CHECK (((gender)::text = ANY (ARRAY[('Male'::character varying)::text, ('Female'::character varying)::text, ('Other'::character varying)::text]))) not valid;

alter table "public"."unidentified_persons" validate constraint "unidentified_persons_gender_check";

alter table "public"."unidentified_persons" add constraint "unidentified_persons_tracking_number_key" UNIQUE using index "unidentified_persons_tracking_number_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_case_number(input_category character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    left_num INT;
    right_part VARCHAR(2);
    new_right_part VARCHAR(2);
    base36_chars TEXT := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    index1 INT;
    index2 INT;
BEGIN
    -- Lock the row for the specified category
    SELECT case_number_tracker.left_number, case_number_tracker.right_part
    INTO left_num, right_part
    FROM case_number_tracker
    WHERE case_number_tracker.category = input_category
    FOR UPDATE;

    -- Generate the next right part
    index1 := POSITION(SUBSTRING(right_part, 1, 1) IN base36_chars) - 1;
    index2 := POSITION(SUBSTRING(right_part, 2, 1) IN base36_chars) - 1;

    index2 := index2 + 1;  -- Increment the rightmost character

    IF index2 = 36 THEN
        index2 := 0;
        index1 := index1 + 1;  -- Carry over to the left character
    END IF;

    IF index1 = 36 THEN
        index1 := 0;
        left_num := left_num + 1;  -- Increment the left number if 'ZZ' is reached
    END IF;

    new_right_part := SUBSTRING(base36_chars FROM index1 + 1 FOR 1) ||
                      SUBSTRING(base36_chars FROM index2 + 1 FOR 1);

    -- Update the tracker table
    UPDATE case_number_tracker
    SET left_number = left_num,
        right_part = new_right_part
    WHERE case_number_tracker.category = input_category;

    -- Return the new case number
    RETURN input_category || '-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(left_num::TEXT, 2, '0') || new_right_part;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_tracking_number()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INT;
BEGIN
    FOR i IN 1..4 LOOP
        result := result || SUBSTRING(characters FROM floor(random() * 36 + 1)::int FOR 1);
    END LOOP;
    RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_case_and_tracking()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  prefix TEXT;
BEGIN
  -- Determine the prefix based on the table being inserted into
  IF TG_TABLE_NAME = 'missing_persons' THEN
    prefix := 'MSP';
  ELSIF TG_TABLE_NAME = 'unidentified_persons' THEN
    prefix := 'UNP';
  ELSIF TG_TABLE_NAME = 'unclaimed_persons' THEN
    prefix := 'UNC';
  ELSE
    RAISE EXCEPTION 'Unknown table: %', TG_TABLE_NAME;
  END IF;

  -- Set case_number if NULL
  IF NEW.case_number IS NULL THEN
    NEW.case_number := generate_case_number(prefix);
  END IF;

  -- Set tracking_number if NULL
  IF NEW.tracking_number IS NULL THEN
    NEW.tracking_number := generate_tracking_number();
  END IF;

  RETURN NEW;
END;
$function$
;

create policy "Allow public inserts"
on "public"."missing_persons"
as permissive
for insert
to public
with check (true);


CREATE TRIGGER trigger_set_case_and_tracking_msp BEFORE INSERT ON public.missing_persons FOR EACH ROW EXECUTE FUNCTION set_case_and_tracking();

CREATE TRIGGER trigger_set_case_and_tracking_unc BEFORE INSERT ON public.unclaimed_persons FOR EACH ROW EXECUTE FUNCTION set_case_and_tracking();

CREATE TRIGGER trigger_set_case_and_tracking_unp BEFORE INSERT ON public.unidentified_persons FOR EACH ROW EXECUTE FUNCTION set_case_and_tracking();


