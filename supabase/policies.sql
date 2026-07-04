-- =====================================================================
-- POLICIES (Row Level Security) del esquema public
-- Separadas de schema.sql. Ejecutar DESPUÉS de schema.sql e inserts.sql.
-- Contiene: ENABLE ROW LEVEL SECURITY + CREATE POLICY.
-- =====================================================================

CREATE POLICY "alumno_insert_admin_gestor" ON "public"."alumno_voluntario" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text"])));

CREATE POLICY "alumno_select_admin" ON "public"."alumno_voluntario" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "alumno_select_admin_gestor" ON "public"."alumno_voluntario" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text"])));

CREATE POLICY "alumno_select_encargado" ON "public"."alumno_voluntario" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = 'encargado'::"text"));

CREATE POLICY "alumno_select_readonly" ON "public"."alumno_voluntario" FOR SELECT TO "authenticated" USING ((("is_active" = true) AND ("public"."get_current_user_role"() = ANY (ARRAY['autoridad'::"text", 'profesor'::"text"]))));

CREATE POLICY "alumno_update_admin_gestor" ON "public"."alumno_voluntario" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text"]))) WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text"])));

ALTER TABLE "public"."alumno_voluntario" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."archivo" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "archivo_delete_cliente" ON "public"."archivo" FOR DELETE TO "authenticated" USING ((("public"."get_current_user_role"() = 'cliente'::"text") AND ("id_solicitud" IN ( SELECT "solicitud"."id_solicitud"
   FROM "public"."solicitud"
  WHERE (("solicitud"."id_usuario" = "public"."get_current_user_id"()) AND ("solicitud"."is_active" = true) AND ("solicitud"."id_estado" = ( SELECT "estado_solicitud"."id_estado"
           FROM "public"."estado_solicitud"
          WHERE (("estado_solicitud"."nombre_estado")::"text" = 'Pendiente'::"text"))))))));

CREATE POLICY "archivo_insert_admin_gestor_profesor" ON "public"."archivo" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text", 'profesor'::"text"])));

CREATE POLICY "archivo_insert_cliente" ON "public"."archivo" FOR INSERT TO "authenticated" WITH CHECK ((("public"."get_current_user_role"() = 'cliente'::"text") AND ("id_solicitud" IS NOT NULL) AND ("id_solicitud" IN ( SELECT "s"."id_solicitud"
   FROM "public"."solicitud" "s"
  WHERE (("s"."id_usuario" = "public"."get_current_user_id"()) AND ("s"."is_active" = true) AND ("s"."id_estado" = ( SELECT "estado_solicitud"."id_estado"
           FROM "public"."estado_solicitud"
          WHERE (("estado_solicitud"."nombre_estado")::"text" = 'Pendiente'::"text"))))))));

CREATE POLICY "archivo_insert_profesor" ON "public"."archivo" FOR INSERT TO "authenticated" WITH CHECK ((("public"."get_current_user_role"() = 'profesor'::"text") AND (("id_planteamiento" IN ( SELECT "planteamiento_proyecto"."id_planteamiento"
   FROM "public"."planteamiento_proyecto"
  WHERE ("planteamiento_proyecto"."id_usuario" = "public"."get_current_user_id"()))) OR ("id_proyecto" IN ( SELECT "p"."id_proyecto"
   FROM ("public"."proyecto" "p"
     JOIN "public"."planteamiento_proyecto" "pp" ON (("pp"."id_planteamiento" = "p"."id_planteamiento")))
  WHERE ("pp"."id_usuario" = "public"."get_current_user_id"()))))));

CREATE POLICY "archivo_select" ON "public"."archivo" FOR SELECT TO "authenticated" USING (("is_active" = true));

CREATE POLICY "archivo_update_admin_gestor" ON "public"."archivo" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text"]))) WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text"])));

ALTER TABLE "public"."autoridad" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "autoridad_insert_admin" ON "public"."autoridad" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "autoridad_select" ON "public"."autoridad" FOR SELECT TO "authenticated" USING (("is_active" = true));

CREATE POLICY "autoridad_update_admin" ON "public"."autoridad" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

ALTER TABLE "public"."carrera" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "carrera_insert_admin" ON "public"."carrera" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "carrera_select" ON "public"."carrera" FOR SELECT TO "authenticated" USING (("is_active" = true));

CREATE POLICY "carrera_select_admin" ON "public"."carrera" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "carrera_update_admin" ON "public"."carrera" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

ALTER TABLE "public"."ciudad" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ciudad_manage_admin" ON "public"."ciudad" TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "ciudad_select" ON "public"."ciudad" FOR SELECT TO "authenticated" USING (("is_active" = true));

CREATE POLICY "detalle_pa_insert" ON "public"."detalle_planteamiento_alumno" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text", 'profesor'::"text"])));

CREATE POLICY "detalle_pa_select" ON "public"."detalle_planteamiento_alumno" FOR SELECT TO "authenticated" USING ((("is_active" = true) AND ("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text", 'profesor'::"text", 'autoridad'::"text"]))));

CREATE POLICY "detalle_pa_update" ON "public"."detalle_planteamiento_alumno" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text", 'profesor'::"text"]))) WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text", 'profesor'::"text"])));

ALTER TABLE "public"."detalle_planteamiento_alumno" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."estado_planteamiento" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "estado_planteamiento_manage_admin" ON "public"."estado_planteamiento" TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "estado_planteamiento_select" ON "public"."estado_planteamiento" FOR SELECT TO "authenticated" USING (("is_active" = true));

ALTER TABLE "public"."estado_proyecto" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "estado_proyecto_manage_admin" ON "public"."estado_proyecto" TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "estado_proyecto_select" ON "public"."estado_proyecto" FOR SELECT TO "authenticated" USING (("is_active" = true));

ALTER TABLE "public"."estado_solicitud" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "estado_solicitud_manage_admin" ON "public"."estado_solicitud" TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "estado_solicitud_select" ON "public"."estado_solicitud" FOR SELECT TO "authenticated" USING (("is_active" = true));

ALTER TABLE "public"."facultad" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "facultad_insert_admin" ON "public"."facultad" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "facultad_select" ON "public"."facultad" FOR SELECT TO "authenticated" USING (("is_active" = true));

CREATE POLICY "facultad_select_admin" ON "public"."facultad" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "facultad_update_admin" ON "public"."facultad" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "gestor_vc_insert_admin" ON "public"."gestor_vinculacion_carrera" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "gestor_vc_select" ON "public"."gestor_vinculacion_carrera" FOR SELECT TO "authenticated" USING (("is_active" = true));

CREATE POLICY "gestor_vc_update_admin" ON "public"."gestor_vinculacion_carrera" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

ALTER TABLE "public"."gestor_vinculacion_carrera" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."logs" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "logs_insert_system" ON "public"."logs" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "logs_select_admin" ON "public"."logs" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "no_delete_alumno" ON "public"."alumno_voluntario" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_archivo" ON "public"."archivo" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_autoridad" ON "public"."autoridad" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_carrera" ON "public"."carrera" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_ciudad" ON "public"."ciudad" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_detalle_pa" ON "public"."detalle_planteamiento_alumno" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_estado_planteamiento" ON "public"."estado_planteamiento" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_estado_proyecto" ON "public"."estado_proyecto" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_estado_solicitud" ON "public"."estado_solicitud" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_facultad" ON "public"."facultad" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_gestor_vc" ON "public"."gestor_vinculacion_carrera" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_logs" ON "public"."logs" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_observacion" ON "public"."observacion" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_planteamiento" ON "public"."planteamiento_proyecto" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_profesor" ON "public"."profesor" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_proyecto" ON "public"."proyecto" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_rol" ON "public"."rol" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_solicitud" ON "public"."solicitud" FOR DELETE TO "authenticated" USING (false);

CREATE POLICY "no_delete_usuario" ON "public"."usuario" FOR DELETE TO "authenticated" USING (false);

ALTER TABLE "public"."observacion" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "observacion_insert" ON "public"."observacion" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text", 'profesor'::"text"])));

CREATE POLICY "observacion_select" ON "public"."observacion" FOR SELECT TO "authenticated" USING (("is_active" = true));

CREATE POLICY "observacion_update" ON "public"."observacion" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text", 'profesor'::"text"]))) WITH CHECK (("public"."get_current_user_role"() = ANY (ARRAY['admin'::"text", 'encargado'::"text", 'profesor'::"text"])));

CREATE POLICY "planteamiento_cancelar_proyecto_profesor" ON "public"."planteamiento_proyecto" FOR UPDATE TO "authenticated" USING ((("public"."get_current_user_role"() = 'profesor'::"text") AND ("is_active" = true) AND ("id_usuario" = "public"."get_current_user_id"()) AND ("id_estado" = ( SELECT "estado_planteamiento"."id_estado"
   FROM "public"."estado_planteamiento"
  WHERE (("estado_planteamiento"."nombre_estado")::"text" = 'Aprobado'::"text"))))) WITH CHECK ((("public"."get_current_user_role"() = 'profesor'::"text") AND ("id_usuario" = "public"."get_current_user_id"())));

CREATE POLICY "planteamiento_insert_admin" ON "public"."planteamiento_proyecto" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "planteamiento_insert_profesor" ON "public"."planteamiento_proyecto" FOR INSERT TO "authenticated" WITH CHECK ((("public"."get_current_user_role"() = 'profesor'::"text") AND ("id_usuario" = "public"."get_current_user_id"()) AND ("id_carrera" = "public"."get_profesor_carrera"()) AND ("id_solicitud" IN ( SELECT "s"."id_solicitud"
   FROM "public"."solicitud" "s"
  WHERE (("s"."is_active" = true) AND ("s"."id_carrera" = "public"."get_profesor_carrera"()) AND ("s"."id_estado" = ( SELECT "estado_solicitud"."id_estado"
           FROM "public"."estado_solicitud"
          WHERE (("estado_solicitud"."nombre_estado")::"text" = 'Aprobada'::"text"))))))));

ALTER TABLE "public"."planteamiento_proyecto" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "planteamiento_select_admin" ON "public"."planteamiento_proyecto" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "planteamiento_select_autoridad" ON "public"."planteamiento_proyecto" FOR SELECT TO "authenticated" USING ((("public"."get_current_user_role"() = 'autoridad'::"text") AND ("is_active" = true)));

CREATE POLICY "planteamiento_select_gestor" ON "public"."planteamiento_proyecto" FOR SELECT TO "authenticated" USING ((("public"."get_current_user_role"() = 'encargado'::"text") AND ("is_active" = true) AND ("id_carrera" = "public"."get_gestor_carrera"())));

CREATE POLICY "planteamiento_select_profesor" ON "public"."planteamiento_proyecto" FOR SELECT TO "authenticated" USING ((("public"."get_current_user_role"() = 'profesor'::"text") AND ("is_active" = true) AND ("id_usuario" = "public"."get_current_user_id"())));

CREATE POLICY "planteamiento_update_admin" ON "public"."planteamiento_proyecto" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "planteamiento_update_gestor" ON "public"."planteamiento_proyecto" FOR UPDATE TO "authenticated" USING ((("public"."get_current_user_role"() = 'encargado'::"text") AND ("is_active" = true) AND ("id_carrera" = "public"."get_gestor_carrera"()))) WITH CHECK ((("public"."get_current_user_role"() = 'encargado'::"text") AND ("id_carrera" = "public"."get_gestor_carrera"())));

CREATE POLICY "planteamiento_update_profesor" ON "public"."planteamiento_proyecto" FOR UPDATE TO "authenticated" USING ((("public"."get_current_user_role"() = 'profesor'::"text") AND ("is_active" = true) AND ("id_usuario" = "public"."get_current_user_id"()))) WITH CHECK ((("public"."get_current_user_role"() = 'profesor'::"text") AND ("id_usuario" = "public"."get_current_user_id"())));

ALTER TABLE "public"."profesor" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profesor_insert_admin" ON "public"."profesor" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "profesor_select" ON "public"."profesor" FOR SELECT TO "authenticated" USING (("is_active" = true));

CREATE POLICY "profesor_update_admin" ON "public"."profesor" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

ALTER TABLE "public"."proyecto" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proyecto_insert_admin" ON "public"."proyecto" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "proyecto_insert_profesor" ON "public"."proyecto" FOR INSERT TO "authenticated" WITH CHECK ((("public"."get_current_user_role"() = 'profesor'::"text") AND ("id_planteamiento" IN ( SELECT "pp"."id_planteamiento"
   FROM "public"."planteamiento_proyecto" "pp"
  WHERE (("pp"."id_usuario" = "public"."get_current_user_id"()) AND ("pp"."is_active" = true) AND ("pp"."id_estado" = ( SELECT "estado_planteamiento"."id_estado"
           FROM "public"."estado_planteamiento"
          WHERE (("estado_planteamiento"."nombre_estado")::"text" = 'Aprobado'::"text"))))))));

CREATE POLICY "proyecto_select_admin" ON "public"."proyecto" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "proyecto_select_autoridad" ON "public"."proyecto" FOR SELECT TO "authenticated" USING ((("public"."get_current_user_role"() = 'autoridad'::"text") AND ("is_active" = true)));

CREATE POLICY "proyecto_select_gestor" ON "public"."proyecto" FOR SELECT TO "authenticated" USING ((("public"."get_current_user_role"() = 'encargado'::"text") AND ("is_active" = true) AND ("id_planteamiento" IN ( SELECT "pp"."id_planteamiento"
   FROM "public"."planteamiento_proyecto" "pp"
  WHERE (("pp"."id_carrera" = "public"."get_gestor_carrera"()) AND ("pp"."is_active" = true))))));

CREATE POLICY "proyecto_select_profesor" ON "public"."proyecto" FOR SELECT TO "authenticated" USING ((("public"."get_current_user_role"() = 'profesor'::"text") AND ("is_active" = true) AND ("id_planteamiento" IN ( SELECT "pp"."id_planteamiento"
   FROM "public"."planteamiento_proyecto" "pp"
  WHERE (("pp"."id_usuario" = "public"."get_current_user_id"()) AND ("pp"."is_active" = true))))));

CREATE POLICY "proyecto_update_admin" ON "public"."proyecto" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "proyecto_update_gestor" ON "public"."proyecto" FOR UPDATE TO "authenticated" USING ((("public"."get_current_user_role"() = 'encargado'::"text") AND ("is_active" = true) AND ("id_planteamiento" IN ( SELECT "pp"."id_planteamiento"
   FROM "public"."planteamiento_proyecto" "pp"
  WHERE (("pp"."id_carrera" = "public"."get_gestor_carrera"()) AND ("pp"."is_active" = true)))))) WITH CHECK (("public"."get_current_user_role"() = 'encargado'::"text"));

CREATE POLICY "proyecto_update_profesor" ON "public"."proyecto" FOR UPDATE TO "authenticated" USING ((("public"."get_current_user_role"() = 'profesor'::"text") AND ("is_active" = true) AND ("id_planteamiento" IN ( SELECT "pp"."id_planteamiento"
   FROM "public"."planteamiento_proyecto" "pp"
  WHERE (("pp"."id_usuario" = "public"."get_current_user_id"()) AND ("pp"."is_active" = true)))))) WITH CHECK (("public"."get_current_user_role"() = 'profesor'::"text"));

ALTER TABLE "public"."rol" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rol_manage_admin" ON "public"."rol" TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "rol_select" ON "public"."rol" FOR SELECT TO "authenticated" USING (("is_active" = true));

ALTER TABLE "public"."solicitud" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "solicitud_delete_cliente" ON "public"."solicitud" FOR DELETE TO "authenticated" USING ((("public"."get_current_user_role"() = 'cliente'::"text") AND ("id_usuario" = "public"."get_current_user_id"()) AND ("is_active" = true) AND ("id_estado" = ( SELECT "estado_solicitud"."id_estado"
   FROM "public"."estado_solicitud"
  WHERE (("estado_solicitud"."nombre_estado")::"text" = 'Pendiente'::"text")))));

CREATE POLICY "solicitud_insert_cliente" ON "public"."solicitud" FOR INSERT TO "authenticated" WITH CHECK ((("public"."get_current_user_role"() = 'cliente'::"text") AND ("id_usuario" = "public"."get_current_user_id"())));

CREATE POLICY "solicitud_select_admin" ON "public"."solicitud" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "solicitud_select_autoridad" ON "public"."solicitud" FOR SELECT USING ((("public"."get_current_user_role"() = 'autoridad'::"text") AND ("is_active" = true)));

CREATE POLICY "solicitud_select_cliente" ON "public"."solicitud" FOR SELECT TO "authenticated" USING ((("public"."get_current_user_role"() = 'cliente'::"text") AND ("id_usuario" = "public"."get_current_user_id"()) AND ("is_active" = true)));

CREATE POLICY "solicitud_select_gestor" ON "public"."solicitud" FOR SELECT TO "authenticated" USING ((("public"."get_current_user_role"() = 'encargado'::"text") AND ("is_active" = true) AND ("id_carrera" = "public"."get_gestor_carrera"())));

CREATE POLICY "solicitud_select_profesor" ON "public"."solicitud" FOR SELECT TO "authenticated" USING ((("public"."get_current_user_role"() = 'profesor'::"text") AND ("is_active" = true) AND ((("id_estado" = ( SELECT "estado_solicitud"."id_estado"
   FROM "public"."estado_solicitud"
  WHERE (("estado_solicitud"."nombre_estado")::"text" = 'Aprobada'::"text"))) AND ("id_carrera" = "public"."get_profesor_carrera"())) OR (EXISTS ( SELECT 1
   FROM "public"."planteamiento_proyecto" "pp"
  WHERE (("pp"."id_solicitud" = "solicitud"."id_solicitud") AND ("pp"."id_usuario" = "public"."get_current_user_id"())))))));

CREATE POLICY "solicitud_update_admin" ON "public"."solicitud" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "solicitud_update_cliente" ON "public"."solicitud" FOR UPDATE TO "authenticated" USING ((("public"."get_current_user_role"() = 'cliente'::"text") AND ("id_usuario" = "public"."get_current_user_id"()) AND ("is_active" = true) AND ("id_estado" = ( SELECT "estado_solicitud"."id_estado"
   FROM "public"."estado_solicitud"
  WHERE (("estado_solicitud"."nombre_estado")::"text" = 'Pendiente'::"text"))))) WITH CHECK ((("public"."get_current_user_role"() = 'cliente'::"text") AND ("id_usuario" = "public"."get_current_user_id"())));

CREATE POLICY "solicitud_update_gestor" ON "public"."solicitud" FOR UPDATE TO "authenticated" USING ((("public"."get_current_user_role"() = 'encargado'::"text") AND ("is_active" = true) AND ("id_carrera" = "public"."get_gestor_carrera"()))) WITH CHECK ((("public"."get_current_user_role"() = 'encargado'::"text") AND ("id_carrera" = "public"."get_gestor_carrera"())));

ALTER TABLE "public"."usuario" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuario_insert_admin" ON "public"."usuario" FOR INSERT TO "authenticated" WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "usuario_insert_self" ON "public"."usuario" FOR INSERT TO "authenticated" WITH CHECK (("auth_uid" = "auth"."uid"()));

CREATE POLICY "usuario_select_admin" ON "public"."usuario" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "usuario_select_autoridad" ON "public"."usuario" FOR SELECT USING ((("public"."get_current_user_role"() = 'autoridad'::"text") AND ("is_active" = true)));

CREATE POLICY "usuario_select_encargado_profesor" ON "public"."usuario" FOR SELECT TO "authenticated" USING (("public"."get_current_user_role"() = ANY (ARRAY['encargado'::"text", 'profesor'::"text"])));

CREATE POLICY "usuario_select_own" ON "public"."usuario" FOR SELECT TO "authenticated" USING ((("auth_uid" = "auth"."uid"()) AND ("is_active" = true)));

CREATE POLICY "usuario_update_admin" ON "public"."usuario" FOR UPDATE TO "authenticated" USING (("public"."get_current_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_current_user_role"() = 'admin'::"text"));

CREATE POLICY "usuario_update_own" ON "public"."usuario" FOR UPDATE TO "authenticated" USING ((("auth_uid" = "auth"."uid"()) AND ("is_active" = true))) WITH CHECK (("auth_uid" = "auth"."uid"()));
