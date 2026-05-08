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


