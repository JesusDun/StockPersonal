# Stock Personal

PWA sencilla para llevar el inventario de productos personales. La lista inicial está basada en la compra que planeas hacer; cada producto empieza como pendiente y solo entra al inventario cuando marcas **Ya lo compré**.

## Uso local

Abre la carpeta con un servidor web local, por ejemplo Apache de XAMPP, y visita `http://localhost/StockPersonal/`. El modo instalable y el uso sin conexión requieren HTTPS o `localhost`; abrir `index.html` directamente como archivo no activa el service worker.

- Marca cada artículo cuando lo compres para agregar la cantidad del paquete al inventario.
- Usa `−` para registrar consumo y `+` para corregir/agregar existencias.
- En `Consumo`, anota cuánto usas normalmente y elige si esa cantidad es por día, semana o mes. La estimación muestra cuánto te queda en días, semanas y meses.
- El tema oscuro viene activado de inicio; usa el botón del encabezado para cambiar a tema claro. La preferencia se guarda en este dispositivo.
- El saludo, la fecha y el reloj usan la hora y zona local del dispositivo; se actualizan automáticamente mientras la app está abierta.
- Agrega otros productos desde el formulario al final.
- Los datos se guardan en el almacenamiento local del navegador en ese dispositivo; no hay cuenta ni sincronización.

## Publicar en Render

El archivo `render.yaml` configura un sitio estático sin paso de compilación. Crea un Static Site en Render conectado a este repositorio y usa la configuración del Blueprint, o bien establece el directorio publicado como `.` y el comando de compilación vacío. Render servirá los archivos y HTTPS habilitará la instalación PWA.

El presupuesto inicial conserva los rangos que anotaste: **$1,253–$1,393 MXN**. El precio del yogurt se mantiene como rango de $90–$180 y sus sabores/precios indicados aparecen como nota para elegir en la tienda.
