
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

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."confirm_user_email"("user_auth_uid" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  caller_rol TEXT;
BEGIN
  SELECT r.nombre_rol INTO caller_rol
  FROM usuario u
  JOIN rol r ON u.id_rol = r.id_rol
  WHERE u.auth_uid = auth.uid();

  IF caller_rol != 'admin' THEN
    RAISE EXCEPTION 'Solo administradores pueden confirmar emails';
  END IF;

  UPDATE auth.users
  SET email_confirmed_at = NOW()
  WHERE id = user_auth_uid;
END;
$$;

ALTER FUNCTION "public"."confirm_user_email"("user_auth_uid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."desactivar_mi_cuenta"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  update usuario set is_active = false where auth_uid = auth.uid();
end;
$$;

ALTER FUNCTION "public"."desactivar_mi_cuenta"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."eliminar_mi_planteamiento"("p_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  -- Solo el profesor dueno y solo si el planteamiento esta Pendiente
  if not exists (
    select 1
    from planteamiento_proyecto pp
    join estado_planteamiento ep on ep.id_estado = pp.id_estado
    where pp.id_planteamiento = p_id
      and pp.id_usuario = get_current_user_id()
      and pp.is_active = true
      and ep.nombre_estado = 'Pendiente'
  ) then
    raise exception 'No se puede eliminar: el planteamiento no existe, no es tuyo o no esta pendiente.';
  end if;

  -- Borrado fisico: primero las filas hijas, luego el planteamiento
  delete from archivo where id_planteamiento = p_id;
  delete from detalle_planteamiento_alumno where id_planteamiento = p_id;
  delete from planteamiento_proyecto where id_planteamiento = p_id;
end;
$$;

ALTER FUNCTION "public"."eliminar_mi_planteamiento"("p_id" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."finalizar_proyecto"("p_id_proyecto" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_id_planteamiento int;
  v_id_solicitud     int;
  v_id_est_proyecto  int;
  v_id_est_plan      int;
  v_id_est_sol       int;
BEGIN
  SELECT id_planteamiento INTO v_id_planteamiento
    FROM proyecto WHERE id_proyecto = p_id_proyecto;

  SELECT id_solicitud INTO v_id_solicitud
    FROM planteamiento_proyecto WHERE id_planteamiento = v_id_planteamiento;

  SELECT id_estado INTO v_id_est_proyecto
    FROM estado_proyecto WHERE nombre_estado = 'Finalizado';

  SELECT id_estado INTO v_id_est_plan
    FROM estado_planteamiento WHERE nombre_estado = 'Finalizado';

  SELECT id_estado INTO v_id_est_sol
    FROM estado_solicitud WHERE nombre_estado = 'Cerrada';

  UPDATE proyecto
    SET id_estado = v_id_est_proyecto
    WHERE id_proyecto = p_id_proyecto;

  UPDATE planteamiento_proyecto
    SET id_estado = v_id_est_plan, fecha_actualizacion = NOW()
    WHERE id_planteamiento = v_id_planteamiento;

  UPDATE solicitud
    SET id_estado = v_id_est_sol, fecha_actualizacion = NOW()
    WHERE id_solicitud = v_id_solicitud;
END;
$$;

ALTER FUNCTION "public"."finalizar_proyecto"("p_id_proyecto" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."fn_insert_log"("p_accion" character varying, "p_tabla" character varying, "p_descripcion" character varying DEFAULT NULL::character varying) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO logs (id_usuario, accion, tabla_afectada, descripcion)
    VALUES (get_current_user_id(), p_accion, p_tabla, p_descripcion);
END;
$$;

ALTER FUNCTION "public"."fn_insert_log"("p_accion" character varying, "p_tabla" character varying, "p_descripcion" character varying) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_current_user_id"() RETURNS integer
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
    SELECT id_usuario FROM usuario WHERE auth_uid = auth.uid() AND is_active = TRUE;
$$;

ALTER FUNCTION "public"."get_current_user_id"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_current_user_role"() RETURNS "text"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
    SELECT r.nombre_rol
    FROM usuario u
    JOIN rol r ON u.id_rol = r.id_rol
    WHERE u.auth_uid = auth.uid() AND u.is_active = TRUE;
$$;

ALTER FUNCTION "public"."get_current_user_role"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_gestor_carrera"() RETURNS integer
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
    SELECT gvc.id_carrera
    FROM gestor_vinculacion_carrera gvc
    JOIN usuario u ON gvc.id_usuario = u.id_usuario
    WHERE u.auth_uid = auth.uid()
      AND gvc.is_active = TRUE
      AND u.is_active = TRUE;
$$;

ALTER FUNCTION "public"."get_gestor_carrera"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_profesor_carrera"() RETURNS integer
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
    SELECT p.id_carrera
    FROM profesor p
    JOIN usuario u ON p.id_usuario = u.id_usuario
    WHERE u.auth_uid = auth.uid()
      AND p.is_active = TRUE
      AND u.is_active = TRUE;
$$;

ALTER FUNCTION "public"."get_profesor_carrera"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_id_rol int;
begin
  if new.raw_user_meta_data ->> 'rut' is null then
    return new;
  end if;

  select id_rol into v_id_rol
  from public.rol where nombre_rol = 'cliente' limit 1;

  insert into public.usuario (
    auth_uid, rut_usuario, nombres_usuario, apellidos_usuario,
    telefono_usuario, id_rol, is_active, fecha_creacion
  ) values (
    new.id,
    new.raw_user_meta_data ->> 'rut',
    new.raw_user_meta_data ->> 'nombres',
    new.raw_user_meta_data ->> 'apellidos',
    coalesce(new.raw_user_meta_data ->> 'telefono', ''),
    v_id_rol, true, now()
  )
  on conflict (auth_uid) do nothing;

  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."iniciar_proyecto"("p_id_proyecto" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_id_solicitud  bigint;
  v_id_en_proceso int;
begin
  select pp.id_solicitud
    into v_id_solicitud
  from proyecto p
  join planteamiento_proyecto pp on pp.id_planteamiento = p.id_planteamiento
  where p.id_proyecto = p_id_proyecto;

  select id_estado
    into v_id_en_proceso
  from estado_solicitud
  where lower(trim(nombre_estado)) = 'en proceso'   --
  limit 1;

  if v_id_solicitud is not null and v_id_en_proceso is not null then
    update solicitud
       set id_estado           = v_id_en_proceso,
           fecha_actualizacion = now()
     where id_solicitud = v_id_solicitud;
  end if;
end;
$$;

ALTER FUNCTION "public"."iniciar_proyecto"("p_id_proyecto" bigint) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."reactivar_mi_cuenta"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  update usuario set is_active = true where auth_uid = auth.uid();
end;
$$;

ALTER FUNCTION "public"."reactivar_mi_cuenta"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."soft_delete"("p_tabla" "text", "p_columna_pk" "text", "p_id" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
    EXECUTE format('UPDATE %I SET is_active = FALSE WHERE %I = $1', p_tabla, p_columna_pk)
    USING p_id;

    INSERT INTO logs (id_usuario, accion, tabla_afectada, descripcion)
    VALUES (get_current_user_id(), 'SOFT_DELETE', p_tabla,
            format('Desactivado registro %s = %s', p_columna_pk, p_id));
END;
$_$;

ALTER FUNCTION "public"."soft_delete"("p_tabla" "text", "p_columna_pk" "text", "p_id" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."soft_delete_solicitud"("p_id_solicitud" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    UPDATE archivo SET is_active = FALSE WHERE id_solicitud = p_id_solicitud;

    UPDATE archivo SET is_active = FALSE
    WHERE id_planteamiento IN (
        SELECT id_planteamiento FROM planteamiento_proyecto WHERE id_solicitud = p_id_solicitud
    );

    UPDATE detalle_planteamiento_alumno SET is_active = FALSE
    WHERE id_planteamiento IN (
        SELECT id_planteamiento FROM planteamiento_proyecto WHERE id_solicitud = p_id_solicitud
    );

    UPDATE observacion SET is_active = FALSE
    WHERE id_proyecto IN (
        SELECT pr.id_proyecto FROM proyecto pr
        JOIN planteamiento_proyecto pp ON pr.id_planteamiento = pp.id_planteamiento
        WHERE pp.id_solicitud = p_id_solicitud
    );

    UPDATE archivo SET is_active = FALSE
    WHERE id_proyecto IN (
        SELECT pr.id_proyecto FROM proyecto pr
        JOIN planteamiento_proyecto pp ON pr.id_planteamiento = pp.id_planteamiento
        WHERE pp.id_solicitud = p_id_solicitud
    );

    UPDATE proyecto SET is_active = FALSE
    WHERE id_planteamiento IN (
        SELECT id_planteamiento FROM planteamiento_proyecto WHERE id_solicitud = p_id_solicitud
    );

    UPDATE planteamiento_proyecto SET is_active = FALSE WHERE id_solicitud = p_id_solicitud;
    UPDATE solicitud SET is_active = FALSE WHERE id_solicitud = p_id_solicitud;

    INSERT INTO logs (id_usuario, accion, tabla_afectada, descripcion)
    VALUES (get_current_user_id(), 'SOFT_DELETE_CASCADE', 'solicitud',
            format('Desactivada solicitud %s y dependencias', p_id_solicitud));
END;
$$;

ALTER FUNCTION "public"."soft_delete_solicitud"("p_id_solicitud" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."soft_delete_usuario"("p_id_usuario" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_solicitud RECORD;
BEGIN
    UPDATE gestor_vinculacion_carrera SET is_active = FALSE WHERE id_usuario = p_id_usuario;
    UPDATE profesor SET is_active = FALSE WHERE id_usuario = p_id_usuario;
    UPDATE autoridad SET is_active = FALSE WHERE id_usuario = p_id_usuario;

    FOR v_solicitud IN
        SELECT id_solicitud FROM solicitud WHERE id_usuario = p_id_usuario AND is_active = TRUE
    LOOP
        PERFORM soft_delete_solicitud(v_solicitud.id_solicitud);
    END LOOP;

    UPDATE planteamiento_proyecto SET is_active = FALSE
    WHERE id_usuario = p_id_usuario AND is_active = TRUE;

    UPDATE usuario SET is_active = FALSE WHERE id_usuario = p_id_usuario;

    INSERT INTO logs (id_usuario, accion, tabla_afectada, descripcion)
    VALUES (get_current_user_id(), 'SOFT_DELETE_CASCADE', 'usuario',
            format('Desactivado usuario %s y dependencias', p_id_usuario));
END;
$$;

ALTER FUNCTION "public"."soft_delete_usuario"("p_id_usuario" integer) OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."soft_restore"("p_tabla" "text", "p_columna_pk" "text", "p_id" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
    EXECUTE format('UPDATE %I SET is_active = TRUE WHERE %I = $1', p_tabla, p_columna_pk)
    USING p_id;

    INSERT INTO logs (id_usuario, accion, tabla_afectada, descripcion)
    VALUES (get_current_user_id(), 'SOFT_RESTORE', p_tabla,
            format('Restaurado registro %s = %s', p_columna_pk, p_id));
END;
$_$;

ALTER FUNCTION "public"."soft_restore"("p_tabla" "text", "p_columna_pk" "text", "p_id" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."alumno_voluntario" (
    "id_alumno" integer NOT NULL,
    "rut_alumno" character varying(11) NOT NULL,
    "nombres_alumno" character varying(100) NOT NULL,
    "apellidos_alumno" character varying(100) NOT NULL,
    "correo_alumno" character varying(50),
    "telefono_alumno" character varying(12),
    "id_carrera" integer NOT NULL,
    "is_active" boolean DEFAULT true,
    CONSTRAINT "chk_rut_alumno_formato" CHECK ((("rut_alumno")::"text" ~ '^[0-9]{7,8}[0-9kK]$'::"text"))
);

ALTER TABLE "public"."alumno_voluntario" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."alumno_voluntario_id_alumno_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."alumno_voluntario_id_alumno_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."alumno_voluntario_id_alumno_seq" OWNED BY "public"."alumno_voluntario"."id_alumno";

CREATE TABLE IF NOT EXISTS "public"."archivo" (
    "id_archivo" integer NOT NULL,
    "nombre_archivo" character varying(100) NOT NULL,
    "ruta_archivo" character varying(100) NOT NULL,
    "tipo_archivo" character varying(10),
    "id_solicitud" integer,
    "id_planteamiento" integer,
    "id_proyecto" integer,
    "is_active" boolean DEFAULT true,
    CONSTRAINT "chk_archivo_pertenencia" CHECK ((("id_solicitud" IS NOT NULL) OR ("id_planteamiento" IS NOT NULL) OR ("id_proyecto" IS NOT NULL)))
);

ALTER TABLE "public"."archivo" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."archivo_id_archivo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."archivo_id_archivo_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."archivo_id_archivo_seq" OWNED BY "public"."archivo"."id_archivo";

CREATE TABLE IF NOT EXISTS "public"."autoridad" (
    "id_usuario" integer NOT NULL,
    "cargo" character varying(50),
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."autoridad" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."carrera" (
    "id_carrera" integer NOT NULL,
    "nombre_carrera" character varying(100) NOT NULL,
    "etiqueta_carrera" character varying(10) NOT NULL,
    "id_facultad" integer NOT NULL,
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."carrera" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."carrera_id_carrera_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."carrera_id_carrera_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."carrera_id_carrera_seq" OWNED BY "public"."carrera"."id_carrera";

CREATE TABLE IF NOT EXISTS "public"."ciudad" (
    "id_ciudad" integer NOT NULL,
    "nombre_ciudad" character varying(50) NOT NULL,
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."ciudad" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."ciudad_id_ciudad_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."ciudad_id_ciudad_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."ciudad_id_ciudad_seq" OWNED BY "public"."ciudad"."id_ciudad";

CREATE TABLE IF NOT EXISTS "public"."detalle_planteamiento_alumno" (
    "id_planteamiento" integer NOT NULL,
    "id_alumno" integer NOT NULL,
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."detalle_planteamiento_alumno" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."estado_planteamiento" (
    "id_estado" integer NOT NULL,
    "nombre_estado" character varying(30) NOT NULL,
    "descripcion_estado" character varying(100),
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."estado_planteamiento" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."estado_planteamiento_id_estado_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."estado_planteamiento_id_estado_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."estado_planteamiento_id_estado_seq" OWNED BY "public"."estado_planteamiento"."id_estado";

CREATE TABLE IF NOT EXISTS "public"."estado_proyecto" (
    "id_estado" integer NOT NULL,
    "nombre_estado" character varying(30) NOT NULL,
    "descripcion_estado" character varying(100),
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."estado_proyecto" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."estado_proyecto_id_estado_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."estado_proyecto_id_estado_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."estado_proyecto_id_estado_seq" OWNED BY "public"."estado_proyecto"."id_estado";

CREATE TABLE IF NOT EXISTS "public"."estado_solicitud" (
    "id_estado" integer NOT NULL,
    "nombre_estado" character varying(30) NOT NULL,
    "descripcion_estado" character varying(100),
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."estado_solicitud" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."estado_solicitud_id_estado_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."estado_solicitud_id_estado_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."estado_solicitud_id_estado_seq" OWNED BY "public"."estado_solicitud"."id_estado";

CREATE TABLE IF NOT EXISTS "public"."facultad" (
    "id_facultad" integer NOT NULL,
    "nombre_facultad" character varying(100) NOT NULL,
    "etiqueta_facultad" character varying(10) NOT NULL,
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."facultad" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."facultad_id_facultad_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."facultad_id_facultad_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."facultad_id_facultad_seq" OWNED BY "public"."facultad"."id_facultad";

CREATE TABLE IF NOT EXISTS "public"."gestor_vinculacion_carrera" (
    "id_usuario" integer NOT NULL,
    "id_carrera" integer NOT NULL,
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."gestor_vinculacion_carrera" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."logs" (
    "id_log" integer NOT NULL,
    "id_usuario" integer,
    "accion" character varying(50) NOT NULL,
    "tabla_afectada" character varying(50),
    "descripcion" character varying(500),
    "fecha" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."logs" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."logs_id_log_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."logs_id_log_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."logs_id_log_seq" OWNED BY "public"."logs"."id_log";

CREATE TABLE IF NOT EXISTS "public"."observacion" (
    "id_observacion" integer NOT NULL,
    "id_proyecto" integer NOT NULL,
    "detalle_observacion" character varying(200) NOT NULL,
    "fecha_observacion" "date" DEFAULT CURRENT_DATE,
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."observacion" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."observacion_id_observacion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."observacion_id_observacion_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."observacion_id_observacion_seq" OWNED BY "public"."observacion"."id_observacion";

CREATE TABLE IF NOT EXISTS "public"."planteamiento_proyecto" (
    "id_planteamiento" integer NOT NULL,
    "titulo_planteamiento" character varying(50) NOT NULL,
    "descripcion_planteamiento" character varying(200),
    "tiempo_estimado_planteamiento" character varying(50),
    "id_carrera" integer NOT NULL,
    "id_solicitud" integer NOT NULL,
    "id_usuario" integer NOT NULL,
    "id_estado" integer NOT NULL,
    "is_active" boolean DEFAULT true,
    "fecha_creacion" timestamp with time zone,
    "fecha_actualizacion" timestamp with time zone
);

ALTER TABLE "public"."planteamiento_proyecto" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."planteamiento_proyecto_id_planteamiento_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."planteamiento_proyecto_id_planteamiento_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."planteamiento_proyecto_id_planteamiento_seq" OWNED BY "public"."planteamiento_proyecto"."id_planteamiento";

CREATE TABLE IF NOT EXISTS "public"."profesor" (
    "id_usuario" integer NOT NULL,
    "id_carrera" integer NOT NULL,
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."profesor" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."proyecto" (
    "id_proyecto" integer NOT NULL,
    "id_planteamiento" integer NOT NULL,
    "id_estado" integer NOT NULL,
    "fecha_inicio" "date",
    "fecha_fin" "date",
    "is_active" boolean DEFAULT true,
    CONSTRAINT "chk_fechas_proyecto" CHECK ((("fecha_fin" IS NULL) OR ("fecha_fin" >= "fecha_inicio")))
);

ALTER TABLE "public"."proyecto" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."proyecto_id_proyecto_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."proyecto_id_proyecto_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."proyecto_id_proyecto_seq" OWNED BY "public"."proyecto"."id_proyecto";

CREATE TABLE IF NOT EXISTS "public"."rol" (
    "id_rol" integer NOT NULL,
    "nombre_rol" character varying(50) NOT NULL,
    "descripcion_rol" character varying(100),
    "is_active" boolean DEFAULT true
);

ALTER TABLE "public"."rol" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."rol_id_rol_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."rol_id_rol_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."rol_id_rol_seq" OWNED BY "public"."rol"."id_rol";

CREATE TABLE IF NOT EXISTS "public"."solicitud" (
    "id_solicitud" integer NOT NULL,
    "titulo_solicitud" character varying(50) NOT NULL,
    "descripcion_solicitud" character varying(200),
    "fecha_creacion_solicitud" "date" DEFAULT CURRENT_DATE,
    "id_estado" integer NOT NULL,
    "id_usuario" integer NOT NULL,
    "id_carrera" integer NOT NULL,
    "id_ciudad" integer,
    "is_active" boolean DEFAULT true,
    "fecha_actualizacion" timestamp with time zone
);

ALTER TABLE "public"."solicitud" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."solicitud_id_solicitud_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."solicitud_id_solicitud_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."solicitud_id_solicitud_seq" OWNED BY "public"."solicitud"."id_solicitud";

CREATE TABLE IF NOT EXISTS "public"."usuario" (
    "id_usuario" integer NOT NULL,
    "auth_uid" "uuid",
    "rut_usuario" character varying(11) NOT NULL,
    "nombres_usuario" character varying(100) NOT NULL,
    "apellidos_usuario" character varying(100) NOT NULL,
    "telefono_usuario" character varying(12),
    "is_active" boolean DEFAULT true,
    "fecha_creacion" "date" DEFAULT CURRENT_DATE,
    "id_rol" integer NOT NULL,
    CONSTRAINT "chk_rut_formato" CHECK ((("rut_usuario")::"text" ~ '^[0-9]{7,8}[0-9kK]$'::"text"))
);

ALTER TABLE "public"."usuario" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."usuario_id_usuario_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."usuario_id_usuario_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."usuario_id_usuario_seq" OWNED BY "public"."usuario"."id_usuario";

CREATE OR REPLACE VIEW "public"."v_proyecto" AS
 SELECT "pr"."id_proyecto",
    "pp"."titulo_planteamiento",
    "ep"."nombre_estado" AS "estado_proyecto",
    "c"."nombre_carrera",
    "pr"."fecha_inicio",
    "pr"."fecha_fin",
    "pp"."id_solicitud",
    "pr"."is_active"
   FROM ((("public"."proyecto" "pr"
     JOIN "public"."planteamiento_proyecto" "pp" ON (("pr"."id_planteamiento" = "pp"."id_planteamiento")))
     JOIN "public"."estado_proyecto" "ep" ON (("pr"."id_estado" = "ep"."id_estado")))
     JOIN "public"."carrera" "c" ON (("pp"."id_carrera" = "c"."id_carrera")))
  WHERE ("pr"."is_active" = true);

ALTER VIEW "public"."v_proyecto" OWNER TO "postgres";

CREATE OR REPLACE VIEW "public"."v_solicitud" AS
 SELECT "s"."id_solicitud",
    "s"."titulo_solicitud",
    "s"."descripcion_solicitud",
    "s"."fecha_creacion_solicitud",
    "es"."nombre_estado" AS "estado",
    ((("u"."nombres_usuario")::"text" || ' '::"text") || ("u"."apellidos_usuario")::"text") AS "solicitante",
    "u"."rut_usuario",
    "c"."nombre_carrera",
    "ci"."nombre_ciudad",
    "s"."id_usuario",
    "s"."id_carrera",
    "s"."id_estado",
    "s"."id_ciudad",
    "s"."is_active"
   FROM (((("public"."solicitud" "s"
     JOIN "public"."estado_solicitud" "es" ON (("s"."id_estado" = "es"."id_estado")))
     JOIN "public"."usuario" "u" ON (("s"."id_usuario" = "u"."id_usuario")))
     JOIN "public"."carrera" "c" ON (("s"."id_carrera" = "c"."id_carrera")))
     LEFT JOIN "public"."ciudad" "ci" ON (("s"."id_ciudad" = "ci"."id_ciudad")))
  WHERE ("s"."is_active" = true);

ALTER VIEW "public"."v_solicitud" OWNER TO "postgres";

ALTER TABLE ONLY "public"."alumno_voluntario" ALTER COLUMN "id_alumno" SET DEFAULT "nextval"('"public"."alumno_voluntario_id_alumno_seq"'::"regclass");

ALTER TABLE ONLY "public"."archivo" ALTER COLUMN "id_archivo" SET DEFAULT "nextval"('"public"."archivo_id_archivo_seq"'::"regclass");

ALTER TABLE ONLY "public"."carrera" ALTER COLUMN "id_carrera" SET DEFAULT "nextval"('"public"."carrera_id_carrera_seq"'::"regclass");

ALTER TABLE ONLY "public"."ciudad" ALTER COLUMN "id_ciudad" SET DEFAULT "nextval"('"public"."ciudad_id_ciudad_seq"'::"regclass");

ALTER TABLE ONLY "public"."estado_planteamiento" ALTER COLUMN "id_estado" SET DEFAULT "nextval"('"public"."estado_planteamiento_id_estado_seq"'::"regclass");

ALTER TABLE ONLY "public"."estado_proyecto" ALTER COLUMN "id_estado" SET DEFAULT "nextval"('"public"."estado_proyecto_id_estado_seq"'::"regclass");

ALTER TABLE ONLY "public"."estado_solicitud" ALTER COLUMN "id_estado" SET DEFAULT "nextval"('"public"."estado_solicitud_id_estado_seq"'::"regclass");

ALTER TABLE ONLY "public"."facultad" ALTER COLUMN "id_facultad" SET DEFAULT "nextval"('"public"."facultad_id_facultad_seq"'::"regclass");

ALTER TABLE ONLY "public"."logs" ALTER COLUMN "id_log" SET DEFAULT "nextval"('"public"."logs_id_log_seq"'::"regclass");

ALTER TABLE ONLY "public"."observacion" ALTER COLUMN "id_observacion" SET DEFAULT "nextval"('"public"."observacion_id_observacion_seq"'::"regclass");

ALTER TABLE ONLY "public"."planteamiento_proyecto" ALTER COLUMN "id_planteamiento" SET DEFAULT "nextval"('"public"."planteamiento_proyecto_id_planteamiento_seq"'::"regclass");

ALTER TABLE ONLY "public"."proyecto" ALTER COLUMN "id_proyecto" SET DEFAULT "nextval"('"public"."proyecto_id_proyecto_seq"'::"regclass");

ALTER TABLE ONLY "public"."rol" ALTER COLUMN "id_rol" SET DEFAULT "nextval"('"public"."rol_id_rol_seq"'::"regclass");

ALTER TABLE ONLY "public"."solicitud" ALTER COLUMN "id_solicitud" SET DEFAULT "nextval"('"public"."solicitud_id_solicitud_seq"'::"regclass");

ALTER TABLE ONLY "public"."usuario" ALTER COLUMN "id_usuario" SET DEFAULT "nextval"('"public"."usuario_id_usuario_seq"'::"regclass");

ALTER TABLE ONLY "public"."alumno_voluntario"
    ADD CONSTRAINT "alumno_voluntario_pkey" PRIMARY KEY ("id_alumno");

ALTER TABLE ONLY "public"."alumno_voluntario"
    ADD CONSTRAINT "alumno_voluntario_rut_alumno_key" UNIQUE ("rut_alumno");

ALTER TABLE ONLY "public"."archivo"
    ADD CONSTRAINT "archivo_pkey" PRIMARY KEY ("id_archivo");

ALTER TABLE ONLY "public"."autoridad"
    ADD CONSTRAINT "autoridad_pkey" PRIMARY KEY ("id_usuario");

ALTER TABLE ONLY "public"."carrera"
    ADD CONSTRAINT "carrera_pkey" PRIMARY KEY ("id_carrera");

ALTER TABLE ONLY "public"."ciudad"
    ADD CONSTRAINT "ciudad_pkey" PRIMARY KEY ("id_ciudad");

ALTER TABLE ONLY "public"."detalle_planteamiento_alumno"
    ADD CONSTRAINT "detalle_planteamiento_alumno_pkey" PRIMARY KEY ("id_planteamiento", "id_alumno");

ALTER TABLE ONLY "public"."estado_planteamiento"
    ADD CONSTRAINT "estado_planteamiento_nombre_estado_key" UNIQUE ("nombre_estado");

ALTER TABLE ONLY "public"."estado_planteamiento"
    ADD CONSTRAINT "estado_planteamiento_pkey" PRIMARY KEY ("id_estado");

ALTER TABLE ONLY "public"."estado_proyecto"
    ADD CONSTRAINT "estado_proyecto_nombre_estado_key" UNIQUE ("nombre_estado");

ALTER TABLE ONLY "public"."estado_proyecto"
    ADD CONSTRAINT "estado_proyecto_pkey" PRIMARY KEY ("id_estado");

ALTER TABLE ONLY "public"."estado_solicitud"
    ADD CONSTRAINT "estado_solicitud_nombre_estado_key" UNIQUE ("nombre_estado");

ALTER TABLE ONLY "public"."estado_solicitud"
    ADD CONSTRAINT "estado_solicitud_pkey" PRIMARY KEY ("id_estado");

ALTER TABLE ONLY "public"."facultad"
    ADD CONSTRAINT "facultad_etiqueta_facultad_key" UNIQUE ("etiqueta_facultad");

ALTER TABLE ONLY "public"."facultad"
    ADD CONSTRAINT "facultad_pkey" PRIMARY KEY ("id_facultad");

ALTER TABLE ONLY "public"."gestor_vinculacion_carrera"
    ADD CONSTRAINT "gestor_vinculacion_carrera_pkey" PRIMARY KEY ("id_usuario");

ALTER TABLE ONLY "public"."logs"
    ADD CONSTRAINT "logs_pkey" PRIMARY KEY ("id_log");

ALTER TABLE ONLY "public"."observacion"
    ADD CONSTRAINT "observacion_pkey" PRIMARY KEY ("id_observacion");

ALTER TABLE ONLY "public"."planteamiento_proyecto"
    ADD CONSTRAINT "planteamiento_proyecto_pkey" PRIMARY KEY ("id_planteamiento");

ALTER TABLE ONLY "public"."profesor"
    ADD CONSTRAINT "profesor_pkey" PRIMARY KEY ("id_usuario");

ALTER TABLE ONLY "public"."proyecto"
    ADD CONSTRAINT "proyecto_pkey" PRIMARY KEY ("id_proyecto");

ALTER TABLE ONLY "public"."rol"
    ADD CONSTRAINT "rol_nombre_rol_key" UNIQUE ("nombre_rol");

ALTER TABLE ONLY "public"."rol"
    ADD CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol");

ALTER TABLE ONLY "public"."solicitud"
    ADD CONSTRAINT "solicitud_pkey" PRIMARY KEY ("id_solicitud");

ALTER TABLE ONLY "public"."usuario"
    ADD CONSTRAINT "usuario_auth_uid_key" UNIQUE ("auth_uid");

ALTER TABLE ONLY "public"."usuario"
    ADD CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario");

ALTER TABLE ONLY "public"."usuario"
    ADD CONSTRAINT "usuario_rut_usuario_key" UNIQUE ("rut_usuario");

CREATE INDEX "idx_archivo_planteamiento" ON "public"."archivo" USING "btree" ("id_planteamiento");

CREATE INDEX "idx_archivo_proyecto" ON "public"."archivo" USING "btree" ("id_proyecto");

CREATE INDEX "idx_archivo_solicitud" ON "public"."archivo" USING "btree" ("id_solicitud");

CREATE INDEX "idx_carrera_facultad" ON "public"."carrera" USING "btree" ("id_facultad");

CREATE INDEX "idx_gestor_vc_carrera" ON "public"."gestor_vinculacion_carrera" USING "btree" ("id_carrera");

CREATE INDEX "idx_logs_fecha" ON "public"."logs" USING "btree" ("fecha");

CREATE INDEX "idx_logs_usuario" ON "public"."logs" USING "btree" ("id_usuario");

CREATE INDEX "idx_planteamiento_active" ON "public"."planteamiento_proyecto" USING "btree" ("is_active");

CREATE INDEX "idx_planteamiento_estado" ON "public"."planteamiento_proyecto" USING "btree" ("id_estado");

CREATE INDEX "idx_planteamiento_solicitud" ON "public"."planteamiento_proyecto" USING "btree" ("id_solicitud");

CREATE INDEX "idx_proyecto_active" ON "public"."proyecto" USING "btree" ("is_active");

CREATE INDEX "idx_proyecto_estado" ON "public"."proyecto" USING "btree" ("id_estado");

CREATE INDEX "idx_proyecto_planteamiento" ON "public"."proyecto" USING "btree" ("id_planteamiento");

CREATE INDEX "idx_solicitud_active" ON "public"."solicitud" USING "btree" ("is_active");

CREATE INDEX "idx_solicitud_carrera" ON "public"."solicitud" USING "btree" ("id_carrera");

CREATE INDEX "idx_solicitud_estado" ON "public"."solicitud" USING "btree" ("id_estado");

CREATE INDEX "idx_solicitud_usuario" ON "public"."solicitud" USING "btree" ("id_usuario");

CREATE INDEX "idx_usuario_active" ON "public"."usuario" USING "btree" ("is_active");

CREATE INDEX "idx_usuario_auth_uid" ON "public"."usuario" USING "btree" ("auth_uid");

CREATE INDEX "idx_usuario_rol" ON "public"."usuario" USING "btree" ("id_rol");

CREATE UNIQUE INDEX "usuario_rut_activo_unique" ON "public"."usuario" USING "btree" ("rut_usuario") WHERE ("is_active" = true);

ALTER TABLE ONLY "public"."alumno_voluntario"
    ADD CONSTRAINT "alumno_voluntario_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "public"."carrera"("id_carrera") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."archivo"
    ADD CONSTRAINT "archivo_id_planteamiento_fkey" FOREIGN KEY ("id_planteamiento") REFERENCES "public"."planteamiento_proyecto"("id_planteamiento") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."archivo"
    ADD CONSTRAINT "archivo_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "public"."proyecto"("id_proyecto") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."archivo"
    ADD CONSTRAINT "archivo_id_solicitud_fkey" FOREIGN KEY ("id_solicitud") REFERENCES "public"."solicitud"("id_solicitud") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."autoridad"
    ADD CONSTRAINT "autoridad_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."carrera"
    ADD CONSTRAINT "carrera_id_facultad_fkey" FOREIGN KEY ("id_facultad") REFERENCES "public"."facultad"("id_facultad") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."detalle_planteamiento_alumno"
    ADD CONSTRAINT "detalle_planteamiento_alumno_id_alumno_fkey" FOREIGN KEY ("id_alumno") REFERENCES "public"."alumno_voluntario"("id_alumno") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."detalle_planteamiento_alumno"
    ADD CONSTRAINT "detalle_planteamiento_alumno_id_planteamiento_fkey" FOREIGN KEY ("id_planteamiento") REFERENCES "public"."planteamiento_proyecto"("id_planteamiento") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."gestor_vinculacion_carrera"
    ADD CONSTRAINT "gestor_vinculacion_carrera_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "public"."carrera"("id_carrera") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."gestor_vinculacion_carrera"
    ADD CONSTRAINT "gestor_vinculacion_carrera_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."logs"
    ADD CONSTRAINT "logs_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."observacion"
    ADD CONSTRAINT "observacion_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "public"."proyecto"("id_proyecto") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."planteamiento_proyecto"
    ADD CONSTRAINT "planteamiento_proyecto_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "public"."carrera"("id_carrera") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."planteamiento_proyecto"
    ADD CONSTRAINT "planteamiento_proyecto_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "public"."estado_planteamiento"("id_estado") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."planteamiento_proyecto"
    ADD CONSTRAINT "planteamiento_proyecto_id_solicitud_fkey" FOREIGN KEY ("id_solicitud") REFERENCES "public"."solicitud"("id_solicitud") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."planteamiento_proyecto"
    ADD CONSTRAINT "planteamiento_proyecto_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."profesor"
    ADD CONSTRAINT "profesor_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "public"."carrera"("id_carrera") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."profesor"
    ADD CONSTRAINT "profesor_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."proyecto"
    ADD CONSTRAINT "proyecto_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "public"."estado_proyecto"("id_estado") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."proyecto"
    ADD CONSTRAINT "proyecto_id_planteamiento_fkey" FOREIGN KEY ("id_planteamiento") REFERENCES "public"."planteamiento_proyecto"("id_planteamiento") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."solicitud"
    ADD CONSTRAINT "solicitud_id_carrera_fkey" FOREIGN KEY ("id_carrera") REFERENCES "public"."carrera"("id_carrera") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."solicitud"
    ADD CONSTRAINT "solicitud_id_ciudad_fkey" FOREIGN KEY ("id_ciudad") REFERENCES "public"."ciudad"("id_ciudad") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."solicitud"
    ADD CONSTRAINT "solicitud_id_estado_fkey" FOREIGN KEY ("id_estado") REFERENCES "public"."estado_solicitud"("id_estado") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."solicitud"
    ADD CONSTRAINT "solicitud_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."usuario"
    ADD CONSTRAINT "usuario_auth_uid_fkey" FOREIGN KEY ("auth_uid") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."usuario"
    ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."rol"("id_rol") ON DELETE RESTRICT;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."confirm_user_email"("user_auth_uid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."confirm_user_email"("user_auth_uid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."confirm_user_email"("user_auth_uid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."desactivar_mi_cuenta"() TO "anon";
GRANT ALL ON FUNCTION "public"."desactivar_mi_cuenta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."desactivar_mi_cuenta"() TO "service_role";

GRANT ALL ON FUNCTION "public"."eliminar_mi_planteamiento"("p_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."eliminar_mi_planteamiento"("p_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."eliminar_mi_planteamiento"("p_id" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."finalizar_proyecto"("p_id_proyecto" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."finalizar_proyecto"("p_id_proyecto" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."finalizar_proyecto"("p_id_proyecto" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."fn_insert_log"("p_accion" character varying, "p_tabla" character varying, "p_descripcion" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."fn_insert_log"("p_accion" character varying, "p_tabla" character varying, "p_descripcion" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_insert_log"("p_accion" character varying, "p_tabla" character varying, "p_descripcion" character varying) TO "service_role";

GRANT ALL ON FUNCTION "public"."get_current_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_user_id"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_current_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_current_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_current_user_role"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_gestor_carrera"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_gestor_carrera"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_gestor_carrera"() TO "service_role";

GRANT ALL ON FUNCTION "public"."get_profesor_carrera"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_profesor_carrera"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_profesor_carrera"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."iniciar_proyecto"("p_id_proyecto" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."iniciar_proyecto"("p_id_proyecto" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."iniciar_proyecto"("p_id_proyecto" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."reactivar_mi_cuenta"() TO "anon";
GRANT ALL ON FUNCTION "public"."reactivar_mi_cuenta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reactivar_mi_cuenta"() TO "service_role";

GRANT ALL ON FUNCTION "public"."soft_delete"("p_tabla" "text", "p_columna_pk" "text", "p_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."soft_delete"("p_tabla" "text", "p_columna_pk" "text", "p_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."soft_delete"("p_tabla" "text", "p_columna_pk" "text", "p_id" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."soft_delete_solicitud"("p_id_solicitud" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."soft_delete_solicitud"("p_id_solicitud" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."soft_delete_solicitud"("p_id_solicitud" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."soft_delete_usuario"("p_id_usuario" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."soft_delete_usuario"("p_id_usuario" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."soft_delete_usuario"("p_id_usuario" integer) TO "service_role";

GRANT ALL ON FUNCTION "public"."soft_restore"("p_tabla" "text", "p_columna_pk" "text", "p_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."soft_restore"("p_tabla" "text", "p_columna_pk" "text", "p_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."soft_restore"("p_tabla" "text", "p_columna_pk" "text", "p_id" integer) TO "service_role";

GRANT ALL ON TABLE "public"."alumno_voluntario" TO "anon";
GRANT ALL ON TABLE "public"."alumno_voluntario" TO "authenticated";
GRANT ALL ON TABLE "public"."alumno_voluntario" TO "service_role";

GRANT ALL ON SEQUENCE "public"."alumno_voluntario_id_alumno_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."alumno_voluntario_id_alumno_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."alumno_voluntario_id_alumno_seq" TO "service_role";

GRANT ALL ON TABLE "public"."archivo" TO "anon";
GRANT ALL ON TABLE "public"."archivo" TO "authenticated";
GRANT ALL ON TABLE "public"."archivo" TO "service_role";

GRANT ALL ON SEQUENCE "public"."archivo_id_archivo_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."archivo_id_archivo_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."archivo_id_archivo_seq" TO "service_role";

GRANT ALL ON TABLE "public"."autoridad" TO "anon";
GRANT ALL ON TABLE "public"."autoridad" TO "authenticated";
GRANT ALL ON TABLE "public"."autoridad" TO "service_role";

GRANT ALL ON TABLE "public"."carrera" TO "anon";
GRANT ALL ON TABLE "public"."carrera" TO "authenticated";
GRANT ALL ON TABLE "public"."carrera" TO "service_role";

GRANT ALL ON SEQUENCE "public"."carrera_id_carrera_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."carrera_id_carrera_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."carrera_id_carrera_seq" TO "service_role";

GRANT ALL ON TABLE "public"."ciudad" TO "anon";
GRANT ALL ON TABLE "public"."ciudad" TO "authenticated";
GRANT ALL ON TABLE "public"."ciudad" TO "service_role";

GRANT ALL ON SEQUENCE "public"."ciudad_id_ciudad_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ciudad_id_ciudad_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ciudad_id_ciudad_seq" TO "service_role";

GRANT ALL ON TABLE "public"."detalle_planteamiento_alumno" TO "anon";
GRANT ALL ON TABLE "public"."detalle_planteamiento_alumno" TO "authenticated";
GRANT ALL ON TABLE "public"."detalle_planteamiento_alumno" TO "service_role";

GRANT ALL ON TABLE "public"."estado_planteamiento" TO "anon";
GRANT ALL ON TABLE "public"."estado_planteamiento" TO "authenticated";
GRANT ALL ON TABLE "public"."estado_planteamiento" TO "service_role";

GRANT ALL ON SEQUENCE "public"."estado_planteamiento_id_estado_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."estado_planteamiento_id_estado_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."estado_planteamiento_id_estado_seq" TO "service_role";

GRANT ALL ON TABLE "public"."estado_proyecto" TO "anon";
GRANT ALL ON TABLE "public"."estado_proyecto" TO "authenticated";
GRANT ALL ON TABLE "public"."estado_proyecto" TO "service_role";

GRANT ALL ON SEQUENCE "public"."estado_proyecto_id_estado_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."estado_proyecto_id_estado_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."estado_proyecto_id_estado_seq" TO "service_role";

GRANT ALL ON TABLE "public"."estado_solicitud" TO "anon";
GRANT ALL ON TABLE "public"."estado_solicitud" TO "authenticated";
GRANT ALL ON TABLE "public"."estado_solicitud" TO "service_role";

GRANT ALL ON SEQUENCE "public"."estado_solicitud_id_estado_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."estado_solicitud_id_estado_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."estado_solicitud_id_estado_seq" TO "service_role";

GRANT ALL ON TABLE "public"."facultad" TO "anon";
GRANT ALL ON TABLE "public"."facultad" TO "authenticated";
GRANT ALL ON TABLE "public"."facultad" TO "service_role";

GRANT ALL ON SEQUENCE "public"."facultad_id_facultad_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."facultad_id_facultad_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."facultad_id_facultad_seq" TO "service_role";

GRANT ALL ON TABLE "public"."gestor_vinculacion_carrera" TO "anon";
GRANT ALL ON TABLE "public"."gestor_vinculacion_carrera" TO "authenticated";
GRANT ALL ON TABLE "public"."gestor_vinculacion_carrera" TO "service_role";

GRANT ALL ON TABLE "public"."logs" TO "anon";
GRANT ALL ON TABLE "public"."logs" TO "authenticated";
GRANT ALL ON TABLE "public"."logs" TO "service_role";

GRANT ALL ON SEQUENCE "public"."logs_id_log_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."logs_id_log_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."logs_id_log_seq" TO "service_role";

GRANT ALL ON TABLE "public"."observacion" TO "anon";
GRANT ALL ON TABLE "public"."observacion" TO "authenticated";
GRANT ALL ON TABLE "public"."observacion" TO "service_role";

GRANT ALL ON SEQUENCE "public"."observacion_id_observacion_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."observacion_id_observacion_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."observacion_id_observacion_seq" TO "service_role";

GRANT ALL ON TABLE "public"."planteamiento_proyecto" TO "anon";
GRANT ALL ON TABLE "public"."planteamiento_proyecto" TO "authenticated";
GRANT ALL ON TABLE "public"."planteamiento_proyecto" TO "service_role";

GRANT ALL ON SEQUENCE "public"."planteamiento_proyecto_id_planteamiento_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."planteamiento_proyecto_id_planteamiento_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."planteamiento_proyecto_id_planteamiento_seq" TO "service_role";

GRANT ALL ON TABLE "public"."profesor" TO "anon";
GRANT ALL ON TABLE "public"."profesor" TO "authenticated";
GRANT ALL ON TABLE "public"."profesor" TO "service_role";

GRANT ALL ON TABLE "public"."proyecto" TO "anon";
GRANT ALL ON TABLE "public"."proyecto" TO "authenticated";
GRANT ALL ON TABLE "public"."proyecto" TO "service_role";

GRANT ALL ON SEQUENCE "public"."proyecto_id_proyecto_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."proyecto_id_proyecto_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."proyecto_id_proyecto_seq" TO "service_role";

GRANT ALL ON TABLE "public"."rol" TO "anon";
GRANT ALL ON TABLE "public"."rol" TO "authenticated";
GRANT ALL ON TABLE "public"."rol" TO "service_role";

GRANT ALL ON SEQUENCE "public"."rol_id_rol_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rol_id_rol_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rol_id_rol_seq" TO "service_role";

GRANT ALL ON TABLE "public"."solicitud" TO "anon";
GRANT ALL ON TABLE "public"."solicitud" TO "authenticated";
GRANT ALL ON TABLE "public"."solicitud" TO "service_role";

GRANT ALL ON SEQUENCE "public"."solicitud_id_solicitud_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."solicitud_id_solicitud_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."solicitud_id_solicitud_seq" TO "service_role";

GRANT ALL ON TABLE "public"."usuario" TO "anon";
GRANT ALL ON TABLE "public"."usuario" TO "authenticated";
GRANT ALL ON TABLE "public"."usuario" TO "service_role";

GRANT ALL ON SEQUENCE "public"."usuario_id_usuario_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."usuario_id_usuario_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."usuario_id_usuario_seq" TO "service_role";

GRANT ALL ON TABLE "public"."v_proyecto" TO "anon";
GRANT ALL ON TABLE "public"."v_proyecto" TO "authenticated";
GRANT ALL ON TABLE "public"."v_proyecto" TO "service_role";

GRANT ALL ON TABLE "public"."v_solicitud" TO "anon";
GRANT ALL ON TABLE "public"."v_solicitud" TO "authenticated";
GRANT ALL ON TABLE "public"."v_solicitud" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
