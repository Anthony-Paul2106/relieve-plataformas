# Configuración del correo del formulario

El formulario envía la solicitud desde `POST /api/contact` usando Nodemailer en
el servidor. El endpoint valida los datos nuevamente y conserva la comprobación
de origen, el encabezado requerido, el límite del cuerpo y el campo honeypot.

## Variables privadas necesarias

Definir en `.env.local` para desarrollo y en el panel privado del proveedor
para producción. No compartirlas, subirlas al repositorio ni exponerlas con el
prefijo `NEXT_PUBLIC_`.

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=cuenta-remitente@gmail.com
SMTP_PASSWORD=CONTRASENA_DE_APLICACION_DE_GMAIL
CONTACT_EMAIL=destino-confirmado@dominio.com
```

Los valores de cuenta son marcadores explicativos: sustituirlos por los valores
reales autorizados por el cliente. Para Gmail, `SMTP_PASSWORD` debe ser una
contraseña de aplicación generada para la cuenta, no la contraseña habitual de
inicio de sesión. El endpoint exige Gmail en puerto 465 con TLS seguro.

`CONTACT_EMAIL` debe reemplazarse por el destinatario real confirmado antes de
usar el formulario en producción. El endpoint rechaza expresamente destinatarios
del dominio `example.com`.

## Qué significa la confirmación

El formulario muestra éxito solo cuando Nodemailer confirma que el servidor
SMTP aceptó el mensaje para el destinatario. Esto no confirma que el mensaje
haya llegado a la bandeja de entrada; conviene revisar también spam y las
políticas de entrega de Gmail.

Los errores SMTP se mantienen en el servidor y el visitante recibe un mensaje
genérico para volver a intentarlo. No se registran credenciales ni se guarda la
solicitud en una base de datos.

## Prueba manual

1. Verifica en privado que las cinco variables estén configuradas y que
   `.env.local` permanezca excluido por `.gitignore`.
2. Reinicia el servidor local después de cambiar variables de entorno.
3. Completa el formulario con nombre y teléfono válidos, correo opcional y una
   descripción de prueba.
4. Envía una vez y espera la confirmación del formulario. Si el SMTP rechaza la
   conexión o el mensaje, se mostrará un error y no una confirmación de éxito.
5. Comprueba la bandeja del destinatario y la carpeta de spam. Si no llega,
   revisa la configuración de Gmail y los registros privados del proveedor de
   despliegue; nunca copies contraseñas en reportes o capturas.
