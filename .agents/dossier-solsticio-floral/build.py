#!/usr/bin/env python3
"""Dossier de prensa Pipilacha v4 — capa gráfica de vanguardia.
Textura de papel, flores acuarela con sombra, marcos desplazados, raíl lateral.
La libélula SIEMPRE recta. Email oficial: info@pipilacha.es."""
import json

scratch = "/private/tmp/claude-501/-Volumes-Pipilacha-Pipilacha--Archivos-web-new-version/4ed51617-ac60-49ad-8f10-0c20e82a277d/scratchpad"

with open(scratch + "/assets_b64.json") as f:
    F = json.load(f)
with open(scratch + "/images_b64.json") as f:
    IMG = json.load(f)
with open(scratch + "/flowers_b64.json") as f:
    FL = json.load(f)

ICON = F["icon"]
GRAIN = FL["_grain"]

CSS = """
@font-face {
  font-family:"Marcellus"; font-style:normal; font-weight:400; font-display:swap;
  src:url(%MARCELLUS_LATIN%) format("woff2");
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F,U+20AC,U+2122;
}
@font-face {
  font-family:"Marcellus"; font-style:normal; font-weight:400; font-display:swap;
  src:url(%MARCELLUS_EXT%) format("woff2");
  unicode-range:U+0100-024F,U+1E00-1EFF;
}
@font-face {
  font-family:"Hanken Grotesk"; font-style:normal; font-weight:300 600; font-display:swap;
  src:url(%HANKEN_LATIN%) format("woff2");
  unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F,U+20AC,U+2122;
}
@font-face {
  font-family:"Hanken Grotesk"; font-style:normal; font-weight:300 600; font-display:swap;
  src:url(%HANKEN_EXT%) format("woff2");
  unicode-range:U+0100-024F,U+1E00-1EFF;
}

* { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
html { background:#e8e4da; }
body { background:#e8e4da; display:flex; flex-direction:column; align-items:center; gap:8mm; padding:8mm 0; }

.page { position:relative; width:210mm; height:297mm; background:#F4EFE6 url(%GRAIN%) repeat; overflow:hidden; }

.kicker { font-family:"Hanken Grotesk",sans-serif; font-weight:500; font-size:7pt; letter-spacing:2.4pt; text-transform:uppercase; color:#645D3B; }
.display { font-family:"Marcellus",serif; font-weight:400; font-size:42pt; line-height:1.05; letter-spacing:-0.3pt; color:#2A2A22; }
.heading { font-family:"Marcellus",serif; font-weight:400; font-size:26pt; line-height:1.14; letter-spacing:-0.1pt; color:#2A2A22; }
.subheading { font-family:"Marcellus",serif; font-weight:400; font-size:15pt; line-height:1.32; color:#31331F; }
.body { font-family:"Hanken Grotesk",sans-serif; font-weight:300; font-size:9.5pt; line-height:1.64; color:#2A2A22; }
.body strong { font-weight:500; color:#31331F; }
.quote { font-family:"Marcellus",serif; font-weight:400; font-size:19pt; line-height:1.34; color:#31331F; letter-spacing:0.1pt; }
.attrib { font-family:"Hanken Grotesk",sans-serif; font-weight:500; font-size:7.5pt; letter-spacing:0.8pt; color:#645D3B; text-transform:uppercase; }
.caption { font-family:"Hanken Grotesk",sans-serif; font-weight:300; font-size:7pt; letter-spacing:0.4pt; line-height:1.45; color:#645D3B; }
.folio { font-family:"Hanken Grotesk",sans-serif; font-weight:500; font-size:6.5pt; letter-spacing:1.6pt; text-transform:uppercase; color:#8A8067; display:flex; align-items:center; gap:2.2mm; }
.folio-mark { width:3mm; height:3mm; object-fit:contain; filter:invert(1) brightness(0.62) sepia(1) saturate(0.4) hue-rotate(20deg); opacity:0.85; }
.num { font-family:"Marcellus",serif; font-weight:400; font-size:18pt; color:#645D3B; line-height:1; }
.rule { background:rgba(49,51,31,0.16); height:0.35mm; }
.rule-olive { background:#645D3B; height:0.7mm; }
.imgfill { width:100%; height:100%; object-fit:cover; display:block; }
.mark { position:absolute; pointer-events:none; }
.mark--ink { filter:invert(1) brightness(0.55) sepia(1) saturate(0.35) hue-rotate(20deg); }

/* ── capa de vanguardia ── */
.flower { position:absolute; pointer-events:none; filter:drop-shadow(1.6mm 2.4mm 2.2mm rgba(49,51,31,0.30)); }
.rail {
  position:absolute; left:7mm; bottom:34mm;
  writing-mode:vertical-rl; transform:rotate(180deg);
  font-family:"Hanken Grotesk",sans-serif; font-weight:500;
  font-size:5.5pt; letter-spacing:2.8pt; text-transform:uppercase;
  color:rgba(49,51,31,0.30); white-space:nowrap;
}
.offset { position:absolute; border:0.4mm solid rgba(100,93,59,0.55); background:none; }

@media print {
  html, body { background:#F4EFE6; padding:0; gap:0; }
  .page { page-break-after:always; break-after:page; box-shadow:none; }
  .page:last-child { page-break-after:auto; }
}
@page { size:210mm 297mm; margin:0; }
"""
CSS = (CSS.replace("%MARCELLUS_LATIN%", F["marcellus_latin"])
          .replace("%MARCELLUS_EXT%", F["marcellus_ext"])
          .replace("%HANKEN_LATIN%", F["hanken_latin"])
          .replace("%HANKEN_EXT%", F["hanken_ext"])
          .replace("%GRAIN%", GRAIN))

RAIL = '<div class="rail">Pipilacha · Solsticio Floral · Madrid MMXXVI</div>'


def folio(section, num):
    return (f'<div class="folio" style="position:absolute; left:18mm; bottom:12mm;">'
            f'<img class="folio-mark" src="{ICON}" alt="">PIPILACHA · DOSSIER DE PRENSA</div>'
            f'<div class="folio" style="position:absolute; right:18mm; bottom:12mm;">{section} · {num:02d}</div>')


def framed(left, top, w, h, src, alt):
    """Foto con marco desplazado (hairline oliva detrás, +3mm)."""
    return (f'<div class="offset" style="left:{left+3}mm; top:{top+3}mm; width:{w}mm; height:{h}mm;"></div>'
            f'<div style="position:absolute; left:{left}mm; top:{top}mm; width:{w}mm; height:{h}mm; overflow:hidden;">'
            f'<img class="imgfill" src="{src}" alt="{alt}"></div>')


def flower(name, left=None, top=None, right=None, bottom=None, w=22):
    pos = ""
    if left is not None:   pos += f"left:{left}mm; "
    if right is not None:  pos += f"right:{right}mm; "
    if top is not None:    pos += f"top:{top}mm; "
    if bottom is not None: pos += f"bottom:{bottom}mm; "
    return f'<img class="flower" src="{FL[name]}" alt="" style="{pos}width:{w}mm;">'


pages = []

# ── 01 · Portada ──────────────────────────────────────────────
pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  <div style="position:absolute; left:0; top:0; width:210mm; height:132mm; overflow:hidden;">
    <img class="imgfill" src="{IMG['cover']}" alt="Arán Rodrigo y Noé David en la barra de Pipilacha">
  </div>
  {flower('hinojo', right=9, top=112, w=34)}
  <div style="position:absolute; left:18mm; top:146mm; width:174mm;">
    <img src="{IMG['_logo']}" alt="Pipilacha" style="width:42mm; display:block; filter:invert(1) brightness(0.45) sepia(1) saturate(0.5) hue-rotate(20deg);">
    <div class="rule-olive" style="width:14mm; margin:5mm 0 8mm 0;"></div>
    <h1 class="display" style="width:160mm;">En Madrid hay un restaurante construido sobre las flores</h1>
    <p class="subheading" style="width:132mm; margin-top:9mm;">Pipilacha convierte el ingrediente más incomprendido de la cocina en el centro absoluto de su menú.</p>
  </div>
  <img class="mark mark--ink" src="{ICON}" alt="" style="right:8mm; top:150mm; width:102mm; height:102mm; opacity:0.05;">
  <div style="position:absolute; left:18mm; bottom:30mm; width:174mm;">
    <div class="rule" style="margin-bottom:5mm;"></div>
    <div style="display:flex; justify-content:space-between;">
      <div class="kicker">Dossier de prensa · Solsticio Floral</div>
      <div class="kicker">Julio de 2026 · Madrid, España</div>
    </div>
  </div>
</div>""")

# ── 02 · Resumen ejecutivo ────────────────────────────────────
pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  {RAIL}
  <div style="position:absolute; left:18mm; top:22mm; width:174mm;">
    <div class="kicker">Resumen ejecutivo</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 7mm 0;"></div>
    <h2 class="heading" style="width:120mm;">La noticia en menos de un minuto</h2>
  </div>
  <div style="position:absolute; left:18mm; top:70mm; width:88mm;">
    <p class="body">Pipilacha construye la totalidad de su menú alrededor de flores comestibles, tratadas como <strong>ingrediente técnico y no como elemento decorativo</strong> — algo muy poco habitual en un restaurante.</p>
    <p class="body" style="margin-top:5mm;">Lo dirigen Arán Rodrigo y Noé David, dos chefs formados en la misma escuela. Abrieron el restaurante en octubre de 2025, en el barrio de Fuente del Berro, Madrid.</p>
  </div>
  <div style="position:absolute; left:114mm; top:70mm; width:78mm;">
    <p class="body">El espacio recibe a <strong>16 comensales por servicio — ocho de ellos en la barra, frente a la cocina</strong> — en dos servicios al día, de jueves a domingo. El menú actual, «Solsticio Floral», documenta 32 flores distintas repartidas en 15 pases.</p>
    <p class="body" style="margin-top:5mm;">Precio del menú: 85€. Maridaje opcional de seis copas: +60€. Ficha completa y contacto de prensa al final de este documento.</p>
  </div>
  {framed(18, 135, 171, 115, IMG['guisante'], 'Guisantes con flor de saúco, terminados con pinzas en la mesa')}
  <div style="position:absolute; left:18mm; top:256mm; width:174mm;">
    <p class="caption">Guisante y flor de saúco. Cada pase parte de una flor con una función que los chefs pueden explicar.</p>
  </div>
  {folio('Resumen', 2)}
</div>""")

# ── 03 · Por qué es noticia (bloque musgo) ────────────────────
pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  <div style="position:absolute; left:0; top:0; width:210mm; height:88mm; background:#31331F;"></div>
  <img class="mark" src="{ICON}" alt="" style="right:18mm; top:18mm; width:38mm; height:38mm; opacity:0.85;">
  <div style="position:absolute; left:18mm; top:26mm; width:174mm;">
    <div class="kicker" style="color:#D5CDBC;">Por qué Pipilacha es noticia</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 6mm 0; background:#D5CDBC;"></div>
    <h2 class="heading" style="color:#F4EFE6; width:126mm;">Todos la reconocen.<br>Casi nadie la ha probado</h2>
  </div>
  <div style="position:absolute; left:18mm; top:104mm; width:84mm;">
    <p class="body">Las flores llevan siglos presentes en la cocina. Casi siempre como adorno. Casi nunca como ingrediente. Pipilacha invierte esa jerarquía: <strong>cada pase del menú parte de una flor, no termina en ella.</strong></p>
  </div>
  <div style="position:absolute; left:110mm; top:104mm; width:82mm;">
    <p class="body">Es una cocina que investiga flores — su sabor, su textura, su comportamiento al fermentarse, deshidratarse o pasar por la brasa — antes de decidir qué hacer con cada una. Usarlas es la consecuencia, no el punto de partida.</p>
  </div>
  <div style="position:absolute; left:18mm; top:150mm; width:174mm;">
    <div class="rule" style="margin-bottom:10mm;"></div>
    <p class="quote" style="width:158mm;">“Todo el mundo sabe cómo huele una rosa. Casi nadie sabe a qué sabe.”</p>
    <p class="attrib" style="margin-top:7mm;">Arán Rodrigo, chef</p>
    <div class="rule" style="margin-top:10mm;"></div>
  </div>
  {framed(18, 210, 84, 60, IMG['taco'], 'Taco de tila y alisos, uno de los pases de Solsticio Floral')}
  <div style="position:absolute; left:110mm; top:210mm; width:82mm;">
    <div class="kicker">Titular disponible</div>
    <p class="body" style="margin-top:4mm;">«La flor es el ingrediente más incomprendido de la cocina — no por dificultad técnica, sino porque nadie ha tenido la paciencia de entenderla.»</p>
  </div>
  {folio('Noticia', 3)}
</div>""")

# ── 04 · Solsticio Floral ─────────────────────────────────────
pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  {RAIL}
  <div style="position:absolute; left:18mm; top:22mm; width:174mm;">
    <div class="kicker">Por qué Solsticio Floral existe</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 7mm 0;"></div>
    <h2 class="heading" style="width:150mm; font-size:32pt;">¿Se puede cocinar un instante?</h2>
  </div>
  <div style="position:absolute; left:18mm; top:66mm; width:84mm;">
    <p class="body">El nuevo menú toma su nombre del solsticio de verano: el día del año con más horas de luz, y también el momento exacto en el que esa luz empieza a acortarse.</p>
    <p class="body" style="margin-top:5mm;">Los quince pases documentan lo que ocurre en ese punto de máxima intensidad — flores que solo florecen unos días, frutas en su semana exacta de madurez, fermentaciones que llevan meses de espera.</p>
  </div>
  <div style="position:absolute; left:110mm; top:66mm; width:82mm;">
    <p class="body">El menú no está organizado por ingredientes. Está organizado por <strong>un instante que, según los chefs, no puede detenerse — solo cocinarse.</strong></p>
    <div class="rule" style="margin:6mm 0;"></div>
    <div class="kicker">La cifra</div>
    <p class="display" style="font-size:40pt; margin-top:3mm;">15</p>
    <p class="caption" style="margin-top:2mm;">pases · 32 flores distintas documentadas</p>
  </div>
  <div style="position:absolute; left:0; top:150mm; width:210mm; height:147mm; overflow:hidden;">
    <img class="imgfill" src="{IMG['humo']}" alt="Pase de Solsticio Floral servido con humo">
  </div>
</div>""")

# ── 05 · Historia ─────────────────────────────────────────────
pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  <div style="position:absolute; left:0; top:0; width:210mm; height:118mm; overflow:hidden;">
    <img class="imgfill" src="{IMG['retiro']}" alt="Arán y Noé entre árboles en flor">
  </div>
  {RAIL}
  <div style="position:absolute; left:18mm; top:132mm; width:174mm;">
    <div class="kicker">La historia del proyecto</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 7mm 0;"></div>
    <h2 class="heading" style="width:150mm;">Dos cocineros, una escuela, una pregunta que no soltaron</h2>
  </div>
  <div style="position:absolute; left:18mm; top:192mm; width:84mm;">
    <p class="body">Arán Rodrigo y Noé David se formaron juntos en la Escuela de Hostelería de Alcalá de Henares.</p>
    <p class="body" style="margin-top:5mm;">En las cocinas donde siguieron creciendo empezaron a hacerse la misma pregunta: por qué un ingrediente presente en la mesa desde hace siglos seguía limitado, casi siempre, a decorar el plato.</p>
  </div>
  <div style="position:absolute; left:110mm; top:192mm; width:82mm;">
    <p class="body">En octubre de 2025 abrieron Pipilacha, en Fuente del Berro, con una decisión poco habitual en Madrid: <strong>un comedor deliberadamente pequeño</strong>, y un menú entero construido sobre esa pregunta.</p>
    <div class="rule" style="margin:6mm 0;"></div>
    <p class="caption">La escala es una decisión, no una limitación: permite explicar cada flor en la mesa, plato a plato, durante el servicio.</p>
  </div>
  {folio('Historia', 5)}
</div>""")

# ── 06 · Perfiles ─────────────────────────────────────────────
pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  {RAIL}
  <div style="position:absolute; left:18mm; top:22mm; width:174mm;">
    <div class="kicker">Quiénes son Arán y Noé</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 7mm 0;"></div>
    <h2 class="heading" style="width:150mm;">Veintipocos años y ninguna prisa</h2>
  </div>
  {framed(18, 66, 84, 112, IMG['aran'], 'Arán Rodrigo, chef de Pipilacha')}
  {framed(110, 66, 82, 112, IMG['noe'], 'Noé David, chef de Pipilacha')}
  <div style="position:absolute; left:18mm; top:186mm; width:84mm;">
    <div class="subheading">Arán Rodrigo</div>
    <div class="rule" style="margin:3mm 0 4mm 0;"></div>
    <p class="body">Nacido en 2001. Formado en la Escuela de Hostelería de Alcalá de Henares. Ha trabajado en las cocinas de El Invernadero, Krudo y Cobo Burgos.</p>
  </div>
  <div style="position:absolute; left:110mm; top:186mm; width:82mm;">
    <div class="subheading">Noé David</div>
    <div class="rule" style="margin:3mm 0 4mm 0;"></div>
    <p class="body">Nacido en 2003. Formado en la misma escuela que Arán. En Pipilacha comparten cocina, barra y servicio.</p>
  </div>
  <div style="position:absolute; left:18mm; top:234mm; width:174mm;">
    <div class="rule" style="margin-bottom:8mm;"></div>
    <p class="quote" style="width:150mm;">“Nunca hemos definido un sistema fijo. Cada flor nos obliga a empezar de cero.”</p>
    <p class="attrib" style="margin-top:6mm;">Noé David, chef</p>
  </div>
  {folio('Perfiles', 6)}
</div>""")

# ── 07 · Enfoque ──────────────────────────────────────────────
pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  {RAIL}
  <div style="position:absolute; left:18mm; top:22mm; width:174mm;">
    <div class="kicker">Qué problema gastronómico intentan resolver</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 7mm 0;"></div>
    <h2 class="heading" style="width:150mm;">Siglos en la mesa, nunca en el centro del plato</h2>
  </div>
  <div style="position:absolute; left:18mm; top:76mm; width:84mm;">
    <p class="body">En la mayoría de restaurantes, la flor cumple una función visual: un pétalo sobre el plato, un color de contraste. Rara vez se piensa en ella como se piensa en una verdura, una especia o una proteína.</p>
  </div>
  <div style="position:absolute; left:110mm; top:76mm; width:82mm;">
    <p class="body">Pipilacha empezó por el extremo contrario: probar cada flor sola, sin plato alrededor, para identificar qué aporta realmente — acidez, amargor, textura, un efecto sobre la lengua — antes de decidir si tiene sentido cocinarla.</p>
  </div>
  <div style="position:absolute; left:18mm; top:118mm; width:174mm;"><div class="rule"></div></div>
  <div style="position:absolute; left:18mm; top:130mm; width:174mm;">
    <div class="kicker">Qué hace diferente a Pipilacha</div>
    <h2 class="heading" style="width:150mm; margin-top:5mm;">Un menú construido, pase a pase, alrededor de una flor distinta</h2>
  </div>
  <div style="position:absolute; left:18mm; top:180mm; width:84mm;">
    <p class="body">La diferencia está en la escala: cada uno de los <strong>15 pases</strong> de Solsticio Floral tiene, al menos, una flor con una función definida dentro del plato.</p>
  </div>
  <div style="position:absolute; left:110mm; top:180mm; width:82mm;">
    <p class="body">Algunas aportan color. Otras, acidez. Otras cambian la textura o activan una sensación concreta en la lengua. Ninguna aparece sin una razón que los chefs puedan explicar con precisión.</p>
  </div>
  {framed(18, 226, 171, 50, IMG['esparrago'], 'Espárragos con tagete sobre plato de piedra')}
  {folio('Enfoque', 7)}
</div>""")

# ── 08 · Flores ───────────────────────────────────────────────
pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  <div style="position:absolute; left:110mm; top:0; width:100mm; height:297mm; overflow:hidden;">
    <img class="imgfill" src="{IMG['hoja']}" alt="Esfera transparente sobre una hoja, uno de los gestos del menú">
  </div>
  {RAIL}
  <div style="position:absolute; left:18mm; top:24mm; width:80mm;">
    <div class="kicker">Investigación sobre flores</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 7mm 0;"></div>
    <h2 class="heading" style="font-size:24pt;">La despensa que casi nadie ha abierto</h2>
    <p class="body" style="margin-top:8mm;">Solsticio Floral documenta flores poco habituales en cocina: guisante mariposa, cosmos, flor de ajo, oxalis, farolillo, kalanchoe, phlox estrellado, tagete, hibiscus, begonia y regaliz azteca, entre otras.</p>
    <p class="body" style="margin-top:5mm;">Algunas sostienen un plato ellas solas: en este menú hay <strong>salsas reducidas únicamente con una flor</strong>, y aires levantados a partir de otra. Otras se usan por su efecto físico: una de las flores del primer bocado activa una sensación de cosquilleo en la lengua.</p>
    <p class="body" style="margin-top:5mm;">Antes de cocinarlas, el propio menú incluye un momento dedicado solo a probarlas por separado, una a una, sin ningún plato alrededor. La selección cambia cada semana, con lo que está en flor.</p>
    <div class="rule" style="margin:8mm 0 5mm 0;"></div>
    <div class="kicker">Titular disponible</div>
    <p class="body" style="margin-top:3mm;">«Hay un restaurante en Madrid donde el menú empieza con cinco flores solas, servidas una a una.»</p>
  </div>
  {folio('Flores', 8)}
</div>""")

# ── 09 · Fermentaciones / proceso ─────────────────────────────
pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  {RAIL}
  <div style="position:absolute; left:18mm; top:22mm; width:174mm;">
    <div class="kicker">Fermentaciones</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 7mm 0;"></div>
    <h2 class="heading" style="width:120mm;">El tiempo como ingrediente</h2>
  </div>
  <div style="position:absolute; left:18mm; top:64mm; width:84mm;">
    <p class="body">Pipilacha produce internamente kombuchas, kéfires y fermentos, algunos infusionados con flores. Son, sencillamente, técnicas con las que los chefs llevan tiempo trabajando.</p>
  </div>
  <div style="position:absolute; left:110mm; top:64mm; width:82mm;">
    <p class="body">El kéfir del limpiador de paladar tarda días en desarrollarse. La reducción de kombucha que acompaña al higo a la brasa parte de una técnica con <strong>más de dos mil años</strong> de antigüedad.</p>
  </div>
  <div style="position:absolute; left:18mm; top:110mm; width:174mm;">
    <div class="rule" style="margin-bottom:8mm;"></div>
    <p class="quote" style="width:150mm;">“La cocina no siempre consiste en cocinar. Muchas veces consiste en esperar.”</p>
    <p class="attrib" style="margin-top:6mm;">Arán Rodrigo, chef</p>
    <div class="rule" style="margin-top:8mm;"></div>
  </div>
  {framed(18, 168, 84, 86, IMG['brasa'], 'Noé David en la brasa de Pipilacha')}
  <div style="position:absolute; left:18mm; top:259mm; width:84mm;">
    <p class="caption">La brasa, el otro extremo del tiempo: segundos en lugar de meses.</p>
  </div>
  <div style="position:absolute; left:110mm; top:168mm; width:82mm;">
    <div class="kicker">Proceso creativo</div>
    <div style="margin-top:6mm;">
      <div class="num">01</div>
      <div class="rule-olive" style="width:8mm; margin:2.5mm 0 3mm 0;"></div>
      <p class="body">Cada flor nueva pasa primero por una prueba aislada: se come sola, sin ningún otro ingrediente, para identificar su sabor real.</p>
    </div>
    <div style="margin-top:6mm;">
      <div class="num">02</div>
      <div class="rule-olive" style="width:8mm; margin:2.5mm 0 3mm 0;"></div>
      <p class="body">Solo si esa prueba revela algo que otro ingrediente no puede ofrecer, la flor entra en desarrollo para un plato.</p>
    </div>
    <div style="margin-top:6mm;">
      <div class="num">03</div>
      <div class="rule-olive" style="width:8mm; margin:2.5mm 0 3mm 0;"></div>
      <p class="body">El menú cambia entero con cada temporada: los quince pases se reescriben de cero, con las flores de ese momento.</p>
    </div>
  </div>
  {folio('Técnica', 9)}
</div>""")

# ── 10 · Cinco pases ──────────────────────────────────────────
def pase(n, name, desc, last=False):
    rule = '' if last else '<div class="rule" style="margin:5mm 0;"></div>'
    return f"""
    <div style="display:flex; gap:5mm;">
      <div class="num">{n:02d}</div>
      <div style="flex:1;">
        <div class="subheading" style="font-size:13pt;">{name}</div>
        <p class="body" style="margin-top:2mm;">{desc}</p>
      </div>
    </div>{rule}"""

pases_html = "".join([
    pase(1, "Pipilacha", "El primer bocado del menú, con forma de libélula. Polvo de pieles de fruta y verdura quemadas, alas de miel, guisante mariposa y flor eléctrica."),
    pase(2, "Farolillo", "Tres flores, tres funciones: el farolillo como recipiente de un tartar de atún rojo, el orégano como aroma y el kalanchoe como textura crujiente."),
    pase(3, "Tomate", "Distintos cortes y variedades de tomate, aire de flor de hinojo, gazpacho de claveles y aceite picual de primera prensada."),
    pase(4, "Codorniz", "Pechuga al horno sobre una salsa reducida únicamente con flor de hibiscus, con pétalos de begonia y muslos cocinados 24 horas a baja temperatura."),
    pase(5, "Sorbete de calabacín", "Cierre del menú: calabacín macerado en yuzu, pétalos de crisantemo y pipas, en lugar de un postre dulce convencional.", last=True),
])

pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  {RAIL}
  <div style="position:absolute; left:18mm; top:22mm; width:174mm;">
    <div class="kicker">Los platos que mejor representan el menú</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 7mm 0;"></div>
    <h2 class="heading" style="width:140mm;">Cinco pases para entender Solsticio Floral</h2>
  </div>
  <div style="position:absolute; left:18mm; top:72mm; width:96mm;">{pases_html}</div>
  {framed(124, 72, 65, 92, IMG['libelula'], 'Pipilacha, el primer bocado del menú, con forma de libélula')}
  {framed(124, 171, 65, 92, IMG['higo'], 'Presentación de un pase de Solsticio Floral sobre piedra')}
  <div style="position:absolute; left:124mm; top:268mm; width:65mm;">
    <p class="caption">Arriba, «Pipilacha»: el primer bocado, con forma de libélula, da nombre a la casa.</p>
  </div>
  {folio('Menú', 10)}
</div>""")

# ── 11 · Datos para titulares ─────────────────────────────────
def dato(n, top, title, desc):
    return f"""
  <div style="position:absolute; left:18mm; top:{top}mm; width:174mm;">
    <div style="display:flex; gap:7mm; align-items:flex-start;">
      <div class="num">{n:02d}</div>
      <div style="flex:1;">
        <div class="subheading" style="font-size:14pt;">{title}</div>
        <p class="body" style="margin-top:2mm; width:140mm;">{desc}</p>
      </div>
    </div>
    <div class="rule" style="margin-top:7mm;"></div>
  </div>"""

datos_html = "".join([
    dato(1, 72,  "El anís estrellado no es solo una especia", "El de uno de los aperitivos es el fruto de una flor, recogido antes de completar su maduración."),
    dato(2, 108, "La begonia de tu salón es comestible", "Una planta habitual en muchas casas, con una acidez cercana a la de un cítrico."),
    dato(3, 144, "Una salsa con una sola flor", "La salsa de la codorniz se reduce únicamente con flor de hibiscus."),
    dato(4, 180, "Una flor con efecto eléctrico", "La flor eléctrica del primer bocado activa una sensación de cosquilleo real en la lengua."),
    dato(5, 216, "Una planta con reloj propio", "El oxalis cierra sus hojas y flores cada tarde, y vuelve a abrirlas al día siguiente."),
])

pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  {RAIL}
  <div style="position:absolute; left:18mm; top:22mm; width:174mm;">
    <div class="kicker">Material para titulares y redes</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 7mm 0;"></div>
    <h2 class="heading" style="width:150mm;">Lo que no sabías de las flores que ves todos los días</h2>
  </div>
  {datos_html}
  {flower('begonia', right=15, top=106, w=19)}
  {flower('electrica', right=15, top=178, w=19)}
  {flower('oxalis', right=15, top=214, w=19)}
  {folio('Datos', 11)}
</div>""")

# ── 12 · Ficha + cronología ───────────────────────────────────
def hito(top, year, text):
    return f"""
  <div style="position:absolute; left:18mm; top:{top}mm; width:174mm;">
    <div style="display:flex; gap:6mm;">
      <div class="attrib" style="width:16mm; padding-top:0.6mm;">{year}</div>
      <div style="flex:1;"><p class="body">{text}</p></div>
    </div>
    <div class="rule" style="margin-top:4mm;"></div>
  </div>"""

cron_html = "".join([
    hito(168, "—",    "Arán Rodrigo y Noé David se forman en la Escuela de Hostelería de Alcalá de Henares."),
    hito(191, "—",    "Arán amplía su formación en El Invernadero, Krudo y Cobo Burgos."),
    hito(214, "2025", "Apertura de Pipilacha en Madrid, en octubre, con un menú construido enteramente sobre flores comestibles."),
    hito(237, "2026", "Presentación de «Solsticio Floral», quince pases centrados en el punto de máxima intensidad del verano."),
])

pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  {RAIL}
  <div style="position:absolute; left:18mm; top:22mm; width:174mm;">
    <div class="kicker">Datos rápidos</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 7mm 0;"></div>
    <h2 class="heading">Pipilacha en cifras</h2>
  </div>
  <div style="position:absolute; left:18mm; top:66mm; width:40mm;">
    <div class="display" style="font-size:32pt;">2025</div>
    <div class="rule-olive" style="width:8mm; margin:3mm 0;"></div>
    <p class="caption">Apertura · octubre de 2025</p>
  </div>
  <div style="position:absolute; left:66mm; top:66mm; width:40mm;">
    <div class="display" style="font-size:32pt;">16</div>
    <div class="rule-olive" style="width:8mm; margin:3mm 0;"></div>
    <p class="caption">Comensales por servicio · 8 en barra</p>
  </div>
  <div style="position:absolute; left:114mm; top:66mm; width:40mm;">
    <div class="display" style="font-size:32pt;">15</div>
    <div class="rule-olive" style="width:8mm; margin:3mm 0;"></div>
    <p class="caption">Pases del menú</p>
  </div>
  <div style="position:absolute; left:162mm; top:66mm; width:40mm;">
    <div class="display" style="font-size:32pt;">85€</div>
    <div class="rule-olive" style="width:8mm; margin:3mm 0;"></div>
    <p class="caption">Maridaje de seis copas: +60€</p>
  </div>
  <div style="position:absolute; left:18mm; top:108mm; width:84mm;">
    <p class="body"><strong>Ubicación</strong><br>C. del Azulejo, 2, 28028 Madrid — barrio de Fuente del Berro</p>
    <p class="body" style="margin-top:4mm;"><strong>Horario</strong><br>Jueves a domingo · dos servicios: 14:00 y 21:00</p>
  </div>
  <div style="position:absolute; left:110mm; top:108mm; width:82mm;">
    <p class="body"><strong>Chefs</strong><br>Arán Rodrigo y Noé David</p>
    <p class="body" style="margin-top:4mm;"><strong>Formación de ambos</strong><br>Escuela de Hostelería de Alcalá de Henares</p>
  </div>
  <div style="position:absolute; left:18mm; top:146mm; width:174mm;">
    <div class="rule" style="margin-bottom:6mm;"></div>
    <div class="kicker">Cronología</div>
    <h2 class="heading" style="font-size:20pt; margin-top:4mm;">De la escuela de Alcalá a Fuente del Berro</h2>
  </div>
  {cron_html}
  {folio('Ficha', 12)}
</div>""")

# ── 13 · Contacto ─────────────────────────────────────────────
pages.append(f"""
<div class="page" data-canvas-width="794" data-canvas-height="1123">
  <div style="position:absolute; left:0; top:0; width:210mm; height:120mm; overflow:hidden;">
    <img class="imgfill" src="{IMG['cierre']}" alt="Arán y Noé en la barra de Pipilacha">
  </div>
  {RAIL}
  <div style="position:absolute; left:18mm; top:136mm; width:174mm;">
    <div class="kicker">Contacto de prensa</div>
    <div class="rule-olive" style="width:14mm; margin:4mm 0 7mm 0;"></div>
    <h2 class="heading" style="width:150mm;">Entrevistas, visitas y material fotográfico</h2>
    <p class="body" style="width:120mm; margin-top:6mm;">Para entrevistas con Arán Rodrigo y Noé David, visitas al restaurante, material fotográfico en alta resolución o acceso al servicio en directo:</p>
  </div>
  <div style="position:absolute; left:18mm; top:196mm; width:84mm;">
    <div class="subheading" style="font-size:16pt;">info@pipilacha.es</div>
    <div class="subheading" style="font-size:16pt; margin-top:2mm;">+34 919 12 59 98</div>
    <p class="caption" style="margin-top:5mm;">@restaurante.pipilacha · pipilacha.es</p>
  </div>
  <div style="position:absolute; left:110mm; top:196mm; width:82mm;">
    <div class="kicker">Kit de prensa disponible</div>
    <p class="body" style="margin-top:4mm;">Fotografía en alta resolución de plato, cocina y equipo. Logotipo en distintos formatos. Biografías ampliadas de ambos chefs. Ficha completa del menú Solsticio Floral, pase a pase.</p>
    <p class="body" style="margin-top:4mm;">Disponible bajo petición.</p>
  </div>
  <div style="position:absolute; left:18mm; top:262mm; width:174mm;">
    <div class="rule" style="margin-bottom:5mm;"></div>
    <p class="caption">Este dossier puede ampliarse con fichas individuales de cada pase o una visita guiada al restaurante fuera de horario de servicio.</p>
  </div>
  {folio('Contacto', 13)}
</div>""")

html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Pipilacha — Dossier de prensa · Solsticio Floral</title>
<meta name="hz:slide-selector" content=".page">
<meta name="hz:canvas-width" content="794">
<meta name="hz:canvas-height" content="1123">
<style>{CSS}</style>
</head>
<body>
{"".join(pages)}
</body>
</html>"""

out = scratch + "/dossier_v6.html"
with open(out, "w", encoding="utf-8") as f:
    f.write(html)
print("written", out, f"{len(html)/1e6:.1f} MB, {len(pages)} pages")
