# Cuadro de mando · cómo se monta

> **Estado (30 jul 2026): montado y funcionando.**
> - Hoja: [Pipilacha · Cuadro de mando](https://docs.google.com/spreadsheets/d/1cCxMow4fbCVPlCMB4kr76dSYDIaGdFvhAdkb-HwLB00/edit) · pestaña `mensual`
> - Informe: [Looker Studio](https://lookerstudio.google.com/reporting/c9cf9f97-7fbc-4a4e-baaf-943a9c12359a) · 4 páginas, 3 fuentes (hoja + GA4 + Search Console)
>
> **Dos trampas que costaron tiempo, apuntadas para la próxima:**
> 1. Looker deduce las columnas de las **filas con datos**, no de la cabecera. Por eso la fila
>    de agosto va rellena de ceros. **Sustituye los ceros por los números reales; no los borres**,
>    o el informe pierde campos.
> 2. La hoja está en **configuración española**: las fórmulas usan `;`, no `,`.
>    `=IFERROR(D2/C2,0)` da `#ERROR!`; lo correcto es `=IFERROR(D2/C2;0)`.
>
> Pendiente menor: las cuatro páginas se llaman «Página sin título» (Looker no dejó
> renombrarlas por automatización). Renómbralas a *Este mes · Sala · Captación ·
> Descubrimiento* desde el panel de páginas.

Dos piezas:

1. **`cuadro-mando.csv`** — la plantilla de la hoja de Google. Una fila por mes.
   Guarda lo que **ningún conector puede traer**: TheFork, TPV, Instagram, Brevo.
2. **El informe de Looker Studio** — lee tres fuentes a la vez:
   - **GA4** (conector nativo, automático)
   - **Search Console** (conector nativo, automático)
   - **esta hoja** (lo manual)

> **Término técnico:** *conector nativo* = Looker se conecta él solo al servicio y
> lee los datos en vivo, sin que toques nada. TheFork y tu TPV no tienen conector,
> por eso existe la hoja. No hay atajo: quien te diga que eso se automatiza entero,
> no ha mirado si TheFork tiene API abierta (no la tiene para restaurantes).

---

## Paso 1 · Crear la hoja

1. Ve a [sheets.new](https://sheets.new) y nómbrala **`Pipilacha · Cuadro de mando`**.
2. `Archivo → Importar → Subir` → sube `cuadro-mando.csv`.
3. En «Ubicación de importación» elige **Reemplazar hoja de cálculo** y en
   «Tipo de separador» **Coma**. Deja activado *Convertir texto en números y fechas*.
4. Renombra la pestaña a **`mensual`** (Looker la busca por ese nombre).
5. Formatea: columna `mes` como texto, las `*_pct` como **porcentaje**,
   `facturacion_eur` / `ticket_medio` / `comision_thefork_eur` como **moneda €**.

Las columnas con `=` son **fórmulas**: se calculan solas, no las toques. Cada mes
nuevo, copia la fila anterior hacia abajo para que las fórmulas se arrastren y
borra solo los números.

Si un mes no tienes un dato, **déjalo vacío**. La hoja no se rompe y Looker lo ignora.

---

## Paso 2 · De dónde sale cada dato

**★ = las seis que mandan.** El resto es contexto: si un mes vas con prisa, rellena
solo las estrelladas.

### TPV — el dinero (10 min)
| Columna | Qué es | Dónde |
|---|---|---|
| `servicios` | nº de servicios abiertos en el mes (jue–dom × comida y cena) | tu calendario |
| `comensales` ★ | personas que comieron | informe de cierre mensual |
| `facturacion_eur` | facturación de sala del mes | informe de cierre |
| `comensales_maridaje` ★ | cuántos cogieron el maridaje (+60 €) | por producto/artículo |
| `plazas_ofertadas`, `ocupacion_pct` ★, `ticket_medio` ★, `pct_maridaje` ★ | *fórmulas* | se calculan solas |

### TheFork — las reservas (10 min)
| Columna | Qué es |
|---|---|
| `reservas_totales` | reservas del mes |
| `res_web` ★ | las que entraron por **tu widget** (comisión 0 €) |
| `res_marketplace` ★ | las que entraron por el **portal de TheFork** (pagas comisión por cubierto) |
| `res_telefono` | las que apuntasteis a mano |
| `no_shows` | quien no se presentó |
| `comision_thefork_eur` | lo que te ha costado TheFork ese mes |
| `pct_no_show` | *fórmula* |

> `res_web` vs `res_marketplace` es **la comparación más rentable de toda la hoja**:
> te dice cuánto te cuesta cada canal y si merece la pena empujar el tuyo.

### GA4 — la web (5 min, o automático en Looker)
`ga_usuarios`, `ga_reserva_click`, `ga_reserva_view`, `ga_reserva_widget`,
`ga_telefono_click`. Salen de `Informes → Interacción → Eventos`.
`pct_intencion` es fórmula (clics en «Reservar» ÷ usuarios).

> Estos cinco **también entran solos** por el conector de GA4. Se copian a la hoja
> igualmente para tener el histórico congelado junto al resto: GA4 conserva los
> datos, pero si algún día cambias la propiedad o el consentimiento, la serie se parte.

### Google Business Profile — el descubrimiento (5 min)
`gbp_vistas`, `gbp_clics_web`, `gbp_llamadas`, `gbp_como_llegar`,
`google_resenas_total` ★, `google_nota`.
En el panel del perfil: *Rendimiento*. **`google_resenas_total` es la métrica que
más mueve el negocio local** — es la que sube o baja según funcione el flujo
post-visita.

### Search Console
`gsc_impresiones`, `gsc_clics`, `pct_no_marca` ★.
El último se saca filtrando las consultas que **no** contienen «pipilacha».
Hoy está en ~0,2 %: cualquier subida ahí es gente nueva descubriéndote.

### Instagram (2 min) — **anótalo sí o sí, IG lo borra a los 90 días**
`ig_seguidores`, `ig_alcance`, `ig_guardados`, `ig_clics_enlace`.

### Brevo (1 min)
`brevo_contactos` ★, `brevo_altas`, `brevo_apertura_pct`.
Mientras no exista la lista, van a 0. Verlas a 0 cada mes es el mejor recordatorio
de por qué hay que montarla.

---

## Paso 3 · El informe de Looker Studio

Se puede montar a mano en ~40 min, o pedírselo a Claude en Chrome con el prompt de
abajo (él tiene tu sesión de Google abierta y puede hacer los clics).

**Qué debe salir — 4 páginas:**

1. **Portada / mes en curso** — seis tarjetas grandes: ocupación %, ticket medio,
   % maridaje, reservas web vs marketplace, reseñas de Google, contactos en Brevo.
   Cada una con comparativa contra el mes anterior.
2. **Sala** — evolución mensual de ocupación, comensales, ticket medio, % maridaje, no-shows.
3. **Captación** — de dónde vienen las reservas (web / marketplace / teléfono),
   coste de comisión, y el embudo de GA4: usuarios → `reserva_click` → `reserva_view`
   → `reserva_widget`.
4. **Descubrimiento** — Search Console (impresiones, clics, % no-marca),
   Google Business y la evolución de reseñas + Instagram.

### Prompt para Claude en Chrome

```
Necesito que me montes un informe en Google Looker Studio para un restaurante
(Pipilacha, Madrid — menú degustación, 16 plazas, jueves a domingo).

FUENTES DE DATOS — conecta las tres:
1. Google Analytics 4, propiedad "Pipilacha S.L." (ID de medición G-N137XN3B2V).
2. Google Search Console, propiedad pipilacha.es (tipo: dominio o URL, la que exista).
3. La hoja de cálculo de Google llamada "Pipilacha · Cuadro de mando", pestaña "mensual".
   Es una fila por mes; la columna "mes" tiene formato 2026-08.

Si alguna fuente pide autorizar permisos, PARA y avísame antes de aceptar nada.
Si una fuente no aparece o da error, dímelo y sigue con las demás — no te inventes
datos ni crees campos de ejemplo.

NOMBRE DEL INFORME: "Pipilacha · Cuadro de mando"

ESTILO: fondo crema #F4EFE6, texto y gráficos en verde oscuro #31331F, acento
#645D3B. Tipografía limpia, sin bordes ni sombras, mucho aire. Sobrio, nada de
colores chillones ni gradientes.

PÁGINA 1 · "Este mes" — seis tarjetas de puntuación (scorecard) desde la hoja,
cada una con comparación respecto al periodo anterior:
- ocupacion_pct (porcentaje)
- ticket_medio (moneda €)
- pct_maridaje (porcentaje)
- res_web frente a res_marketplace (gráfico de barras, no tarjeta)
- google_resenas_total (número)
- brevo_contactos (número)

PÁGINA 2 · "Sala" — todo desde la hoja, dimensión = mes:
- gráfico de líneas: ocupacion_pct y pct_maridaje
- gráfico de barras: comensales por mes
- gráfico de líneas: ticket_medio
- tabla: mes, comensales, facturacion_eur, ticket_medio, pct_no_show

PÁGINA 3 · "Captación":
- de la hoja: barras apiladas por mes con res_web, res_marketplace, res_telefono
- de la hoja: línea con comision_thefork_eur
- de GA4: gráfico de embudo o barras con los eventos reserva_click, reserva_view,
  reserva_widget y telefono_click
- de GA4: tabla de usuarios por canal predeterminado (default channel group)

PÁGINA 4 · "Descubrimiento":
- de Search Console: impresiones y clics por mes, y tabla de las 20 consultas
  principales
- de la hoja: línea con pct_no_marca
- de la hoja: línea con google_resenas_total y barras con gbp_clics_web,
  gbp_llamadas, gbp_como_llegar
- de la hoja: línea con ig_alcance y ig_guardados

CONTROLES: en todas las páginas, un selector de rango de fechas arriba a la derecha.

NO compartas el informe con nadie ni cambies permisos de acceso. Déjalo en privado
y pásame el enlace cuando esté.
```

---

## Paso 4 · Antes de que el informe sirva de algo

En GA4, `Administrar → Eventos`, marca como **evento clave** los cuatro:
`reserva_click`, `reserva_view`, `reserva_widget`, `telefono_click`.
Ya se envían desde la web (`src/scripts/conversions.js`), pero hasta que no se
marcan, GA no los cuenta como conversión y la página 3 sale medio vacía.
