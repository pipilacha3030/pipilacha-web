# DNS para que los correos de Brevo lleguen

> ✅ **HECHO el 30 jul 2026.** Los cuatro registros están puestos en Arsys y publicados;
> Brevo da el dominio como **verificado y autenticado** (los cuatro en OK). El remitente
> `info@pipilacha.es` está creado y activo (id 2) y la plantilla de confirmación ya sale
> desde él, no desde el Gmail. El MX (`mx.serviciodecorreo.es`) quedó intacto.
>
> Ojo con el retardo: Arsys tardó **varios minutos** en publicar los TXT y el SPF editado
> aunque el panel ya los mostraba. No repitas el cambio pensando que falló — consulta con
> `dig` contra `@dns17.servidoresdns.net` y espera.

Registros que hay que añadir en **Arsys** (los nameservers de `pipilacha.es` son
`dns17/18.servidoresdns.net`, así que la zona se edita ahí, no en Brevo).

Valores sacados de la API de Brevo el **30 jul 2026** para el dominio `pipilacha.es`,
que ya está dado de alta en la cuenta (creado el 29 jul) pero **sin verificar**.

> ⚠️ **Regla de oro:** el correo `@pipilacha.es` funciona hoy (MX `mx.serviciodecorreo.es`).
> Ninguno de estos cambios lo toca **si se hacen tal cual**. El único peligro real es el
> SPF: **nunca se añade un segundo registro SPF**, se edita el que ya existe.

---

## 1. Los tres registros de Brevo (añadir tal cual)

| Tipo | Nombre / Host | Valor |
|---|---|---|
| CNAME | `brevo1._domainkey` | `b1.pipilacha-es.dkim.brevo.com` |
| CNAME | `brevo2._domainkey` | `b2.pipilacha-es.dkim.brevo.com` |
| TXT | `@` (la raíz del dominio) | `brevo-code:5506f2202b9f024f25e36d69e657aeda` |

Los dos CNAME son la **firma DKIM**: lo que le demuestra a Gmail que ese correo sale de
verdad de Pipilacha. El TXT es la comprobación de que el dominio es vuestro.

## 2. DMARC — no existe ninguno, hay que crearlo

| Tipo | Nombre / Host | Valor |
|---|---|---|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |

`p=none` significa **solo observar**: no bloquea nada, únicamente recoge informes. Es el
punto de partida seguro. Desde 2024 Gmail y Yahoo lo exigen a quien envía correo masivo;
sin DMARC, los envíos acaban en spam aunque el DKIM esté bien.

## 3. SPF — **editar el que ya hay, NO crear otro**

Valor actual (comprobado por DNS el 30 jul 2026):

```
v=spf1 a mx include:_spf.serviciodecorreo.es include:_spf.mlsend.com ~all
```

Sustituirlo por:

```
v=spf1 a mx include:_spf.serviciodecorreo.es include:_spf.mlsend.com include:spf.brevo.com ~all
```

Lo único que cambia es `include:spf.brevo.com` antes del `~all`.

**Por qué cabe:** el SPF admite un máximo de **10 consultas DNS** y pasarse lo invalida
entero. El registro actual gasta 6 (`a`=1, `mx`=1, serviciodecorreo=3 porque lleva dos
includes dentro, mlsend=1). Brevo suma 1 más → **7 de 10**. Hay margen.

---

## Un cabo suelto que conviene mirar

En el DNS hay rastro de **MailerLite**, otra herramienta de email:

- `mailerlite-domain-verification=3470811c31d82efe65ff9b5a60f307b7b26efed5` en la raíz
- `include:_spf.mlsend.com` dentro del SPF
- pero **sin DKIM configurado** (`ml._domainkey` está vacío)

O sea: alguien empezó a montar MailerLite y lo dejó a medias. Si ya no se usa, quitar esos
dos rastros libera una consulta del SPF y deja el dominio más limpio. **No lo toques sin
confirmar** que nadie envía desde ahí.

---

## Después de añadirlos

1. La propagación tarda entre 15 minutos y unas horas.
2. En Brevo: **Ajustes → Remitentes, dominios y IPs dedicadas → pipilacha.es → Verificar**.
3. Dar de alta `info@pipilacha.es` como remitente y **usarlo en lugar de
   `r.pipilacha@gmail.com`**. Enviar marketing desde una dirección de Gmail es lo que
   más spam provoca: el dominio `gmail.com` no es vuestro y no se puede autenticar.
4. Comprobar desde el terminal:

```bash
dig +short CNAME brevo1._domainkey.pipilacha.es
dig +short TXT _dmarc.pipilacha.es
dig +short TXT pipilacha.es
```
