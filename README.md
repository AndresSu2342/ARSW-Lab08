### Escuela Colombiana de Ingeniería
### Arquitecturas de Software - ARSW

---

### Integrantes: Joan S. Acevedo Aguilar - Cesar A. Borray Suarez

---

### Laboratorio - Broker de Mensajes STOMP con WebSockets + HTML5 Canvas.

- Conectarse con un botón
- publicar con eventos de mouse

var newpoint = JSON.parse(greeting.body);
                addPointToCanvas(newpoint);


stompClient.send("/topic/newpoint", {}, JSON.stringify(pt));  				


Este ejercicio se basa en la documentación oficial de SprinbBoot, para el [manejo de WebSockets con STOMP](https://spring.io/guides/gs/messaging-stomp-websocket/).

En este repositorio se encuentra una aplicación SpringBoot que está configurado como Broker de mensajes, de forma similar a lo mostrado en la siguiente figura:

![](https://docs.spring.io/spring/docs/current/spring-framework-reference/images/message-flow-simple-broker.png)

En este caso, el manejador de mensajes asociado a "/app" aún no está configurado, pero sí lo está el broker '/topic'. Como mensaje, se usarán puntos, pues se espera que esta aplicación permita progragar eventos de dibujo de puntos generados por los diferentes clientes.

## Parte I.

Para las partes I y II, usted va a implementar una herramienta de dibujo colaborativo Web, basada en el siguiente diagrama de actividades:

![](img/P1-AD.png)

Para esto, realice lo siguiente:

1. Haga que la aplicación HTML5/JS al ingresarle en los campos de X y Y, además de graficarlos, los publique en el tópico: /topic/newpoint . Para esto tenga en cuenta (1) usar el cliente STOMP creado en el módulo de JavaScript y (2) enviar la representación textual del objeto JSON (usar JSON.stringify). Por ejemplo:

	```javascript
	//creando un objeto literal
	stompClient.send("/topic/newpoint", {}, JSON.stringify({x:10,y:10}));
	```

	```javascript
	//enviando un objeto creado a partir de una clase
	stompClient.send("/topic/newpoint", {}, JSON.stringify(pt)); 
	```
	
	Para realizar esto miramos nuestra funcion de connectAndSubscribe en el app.js, hacemos que se conecte primero al topico /topic/newpoint y luego enviamos la representación textual del objeto JSON del punto

    ![Image](https://github.com/user-attachments/assets/ec81ccc9-32e1-4165-9f4d-38391a7b58b8)

	Y en el retorno del app.js, especificamente en la funcion publica publishPoint, que se ejecuta al dar click en el boton hacemos que se dibuje el punto y posteriormente lo mande al servidor usando STOMP

	![Image](https://github.com/user-attachments/assets/a05eba8a-3cc5-43f7-8ee5-dec1e159c462)

2. Dentro del módulo JavaScript modifique la función de conexión/suscripción al WebSocket, para que la aplicación se suscriba al tópico "/topic/newpoint" (en lugar del tópico /TOPICOXX). Asocie como 'callback' de este suscriptor una función que muestre en un mensaje de alerta (alert()) el evento recibido. Como se sabe que en el tópico indicado se publicarán sólo puntos, extraiga el contenido enviado con el evento (objeto JavaScript en versión de texto), conviértalo en objeto JSON, y extraiga de éste sus propiedades (coordenadas X y Y). Para extraer el contenido del evento use la propiedad 'body' del mismo, y para convertirlo en objeto, use JSON.parse. Por ejemplo:

	```javascript
	var theObject=JSON.parse(message.body);
	```

	Actualizamos la funcion connectAndSubscribe para que apartir del punto recibido podamos desglosar las coordenadas 'x' y 'y' y mandar una alerta que notifique el nuevo punto 

    ![Image](https://github.com/user-attachments/assets/3807cd99-1152-4199-a0a4-c7ec23707512)

3. Compile y ejecute su aplicación. Abra la aplicación en varias pestañas diferentes (para evitar problemas con el caché del navegador, use el modo 'incógnito' en cada prueba).

	Ejecutamos la aplicacion y vemos que no hay ningun problema, por lo que procedemos a abrir varias pestañas

    ![Image](https://github.com/user-attachments/assets/f584d06c-dea7-4ead-b5b6-5a3d8173ca36)

6. Ingrese los datos, ejecute la acción del botón, y verifique que en todas la pestañas se haya lanzado la alerta con los datos ingresados.

	Ingresamos una coordenada para el primer punto y vemos que al enviar, nos lanza la alerta en la pestaña actual y vemos solo desde la anvegacion de pestañas el punto azul que menciona que hay una alerta en las otras pestañas, mas sin embargo revisamos en las demas pestañas y esta si muestra la alerta

	Pestaña 1
    ![Image](https://github.com/user-attachments/assets/71c66f37-769b-4cb3-9d6a-461fbb2c1f2d)
	Pestaña 2
    ![Image](https://github.com/user-attachments/assets/9e394ab8-753e-45c4-b263-675ead754f34)
	Pestaña 3
	![Image](https://github.com/user-attachments/assets/8d5cf1fa-7aca-43c9-8553-3abdf9f9e8ed)

5. Haga commit de lo realizado, para demarcar el avance de la parte 2.

	```bash
	git commit -m "PARTE 1".
	```


## Parte II.

Para hacer mas útil la aplicación, en lugar de capturar las coordenadas con campos de formulario, las va a capturar a través de eventos sobre un elemento de tipo \<canvas>. De la misma manera, en lugar de simplemente mostrar las coordenadas enviadas en los eventos a través de 'alertas', va a dibujar dichos puntos en el mismo canvas. Haga uso del mecanismo de captura de eventos de mouse/táctil usado en ejercicios anteriores con este fin.

1. Haga que el 'callback' asociado al tópico /topic/newpoint en lugar de mostrar una alerta, dibuje un punto en el canvas en las coordenadas enviadas con los eventos recibidos. Para esto puede [dibujar un círculo de radio 1](http://www.w3schools.com/html/html5_canvas.asp).

	Removemos dentro del index los campos de entrada y solo agregamos un titulo que me mencione hacer un click en el canvas para agregar los puntos

    ![Image](https://github.com/user-attachments/assets/245db332-63d3-40d1-bc99-b94a906789e3)

	Ahora en el app.js devolvemos solamente una funcion de inicio donde nos conectara al websocket y definira el manejador de eventos para el canvas, para captar las coordenadas del click, enviar el punto al servidor y dibujarlo

	![Image](https://github.com/user-attachments/assets/a8f0ae1f-ac40-4d9c-98b5-dab1d0079a17)

2. Ejecute su aplicación en varios navegadores (y si puede en varios computadores, accediendo a la aplicación mendiante la IP donde corre el servidor). Compruebe que a medida que se dibuja un punto, el mismo es replicado en todas las instancias abiertas de la aplicación.

	Volvemos a probar pero ahora en tres diferentes navegadores para comprobar que si funciona el manejador de eventos, se cree el punto y este se refleje en las demas instancias

	Chrome
    ![Image](https://github.com/user-attachments/assets/18d9ac7e-37ce-48ac-a1c7-39ccdc4a5d49)
	Edge
	![Image](https://github.com/user-attachments/assets/3e6a71d4-e859-43d8-8600-3db53fcc769a)
	Firefox
	![Image](https://github.com/user-attachments/assets/4c71a650-dd74-41f1-b2cd-1b7872271073)

3. Haga commit de lo realizado, para marcar el avance de la parte 2.

	```bash
	git commit -m "PARTE 2".
	```

## Parte III.

Ajuste la aplicación anterior para que pueda manejar más de un dibujo a la vez, manteniendo tópicos independientes. Para esto:

1. Agregue un campo en la vista, en el cual el usuario pueda ingresar un número. El número corresponderá al identificador del dibujo que se creará.

	Agregamos al index.html el nuevo campo de entrada donde pedira el ID del dibujo

    ![Image](https://github.com/user-attachments/assets/11c59a1a-e5d6-423c-8bf8-251810b0fdc4)

	Miramos si este si se ve reflejado en la pagina

	![Image](https://github.com/user-attachments/assets/4ec47cc2-f7ca-4ed8-8aaf-fc86c412caef)

2. Modifique la aplicación para que, en lugar de conectarse y suscribirse automáticamente (en la función init()), lo haga a través de botón 'conectarse'. Éste, al oprimirse debe realizar la conexión y suscribir al cliente a un tópico que tenga un nombre dinámico, asociado el identificador ingresado, por ejemplo: /topic/newpoint.25, topic/newpoint.80, para los dibujos 25 y 80 respectivamente.

	Para esto primeramente, creamos una variable privada en el app.js donde se guardara el id del dibujo

    ![Image](https://github.com/user-attachments/assets/4c430a96-c634-457b-898f-bf035b5318ec)

	Modificamos la funcion publica de inicio a una de conectar que solo se accionara cuando se le de al boton de conectarse, en este validamos que si exista un id digitado en el campo y llama a la funcion connectAndSuscribe para conectarse al websocket

    ![Image](https://github.com/user-attachments/assets/d056b85e-976a-48c7-9524-f7158cbd9503)

	Y por ultimo en esta funcion antes mencionada, concatenamos en el topico seguido el id del dibujo guardado en la variable privada y realizamos la suscripcion

	![Image](https://github.com/user-attachments/assets/abc4b978-214b-4781-af34-ca3d1af499f6)

3. De la misma manera, haga que las publicaciones se realicen al tópico asociado al identificador ingresado por el usuario.

	Para esto dentro de la misma funcion conectar publica, definimos el manejador de eventos para el canva y cambiamos el topico al cual se mandara el punto

	![Image](https://github.com/user-attachments/assets/bd6afefc-72ef-4820-bf28-29559b7ec2a2)

4. Rectifique que se puedan realizar dos dibujos de forma independiente, cada uno de éstos entre dos o más clientes.

	```bash
	git commit -m "PARTE 3".
	```

	Antes de realizar el commit, rectificamos que si se puedan crear diferentes instancias por topicos dinamicos y estos no se interpondrian, ademas de ver si los otros si pueden ver los puntos en su instancia conectada
	
	![Image](https://github.com/user-attachments/assets/47b6da35-2cd9-46ed-88e5-dc9819f3d951)
	
	![Image](https://github.com/user-attachments/assets/6784ccde-e1e4-4e2b-a677-6394ec6b20f6)
	
	![Image](https://github.com/user-attachments/assets/ceb6e1d4-5fcd-49ac-9eab-adb5fae83699)


## Parte IV.

Para la parte IV, usted va  a implementar una versión extendida del modelo de actividades y eventos anterior, en la que el servidor (que hasta ahora sólo fungía como Broker o MOM -Message Oriented Middleware-) se volverá también suscriptor de ciertos eventos, para a partir de los mismos agregar la funcionalidad de 'dibujo colaborativo de polígonos':

![](img/P2-AD.png)

Para esto, se va a hacer una configuración alterna en la que, en lugar de que se propaguen los mensajes 'newpoint.{numdibujo}' entre todos los clientes, éstos sean recibidos y procesados primero por el servidor, de manera que se pueda decidir qué hacer con los mismos. 

Para ver cómo manejar esto desde el manejador de eventos STOMP del servidor, revise [puede revisar la documentación de Spring](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#websocket-stomp-destination-separator).


1. Cree una nueva clase que haga el papel de 'Controlador' para ciertos mensajes STOMP (en este caso, aquellos enviados a través de "/app/newpoint.{numdibujo}"). A este controlador se le inyectará un bean de tipo SimpMessagingTemplate, un Bean de Spring que permitirá publicar eventos en un determinado tópico. Por ahora, se definirá que cuando se intercepten los eventos enviados a "/app/newpoint.{numdibujo}" (que se supone deben incluir un punto), se mostrará por pantalla el punto recibido, y luego se procederá a reenviar el evento al tópico al cual están suscritos los clientes "/topic/newpoint".

	```java
	
	@Controller
	public class STOMPMessagesHandler {
		
		@Autowired
		SimpMessagingTemplate msgt;
	    
		@MessageMapping("/newpoint.{numdibujo}")    
		public void handlePointEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {
			System.out.println("Nuevo punto recibido en el servidor!:"+pt);
			msgt.convertAndSend("/topic/newpoint"+numdibujo, pt);
		}
	}

	```
	
	Creamos la clase Controlador STOMPMessagesHandler, tal cual como se nos indica

    ![Image](https://github.com/user-attachments/assets/70b92d9e-6d0a-47a7-940f-9f5ccb1e5819)

2. Ajuste su cliente para que, en lugar de publicar los puntos en el tópico /topic/newpoint.{numdibujo}, lo haga en /app/newpoint.{numdibujo}. Ejecute de nuevo la aplicación y rectifique que funcione igual, pero ahora mostrando en el servidor los detalles de los puntos recibidos.

	Ahora en el app.js cambiamos el topico /topic/newpoint.{numdibujo}, al topico /app/newpoint.{numdibujo} para que actue el controlador y intercepte los eventos para mostrar los puntos recibidos

    ![Image](https://github.com/user-attachments/assets/0248115d-0b44-49a0-8e63-c8f180874e9f)

	Ejecutamos la aplicacion y dibujamos 2 puntos en un dibujo cualquiera

    ![Image](https://github.com/user-attachments/assets/b3441b52-6406-432a-be89-7610781de506)

	Miramos si estos puntos se reflejan desde otra pestaña que esta conectado al mismo dibujo

	![Image](https://github.com/user-attachments/assets/1e11d799-2b90-4914-835c-b647316cde87)
	
	Y ahora desde otra instancia de dibujo agregamos otros 2 puntos

	![Image](https://github.com/user-attachments/assets/2f1520f0-946c-4e93-855e-2c1c30c69ed9)
	
	Revisamos la consola del backend y miramos que este si imprime los puntos recibidos con su respectiva coordenada, ademas de dejar un espaciado para diferenciar las distintas instancias de dibujo

	![Image](https://github.com/user-attachments/assets/e4bca9f3-c3e0-4a59-8be3-b9f99601b5e2)

3. Una vez rectificado el funcionamiento, se quiere aprovechar este 'interceptor' de eventos para cambiar ligeramente la funcionalidad:

	1. Se va a manejar un nuevo tópico llamado '/topic/newpolygon.{numdibujo}', en donde el lugar de puntos, se recibirán objetos javascript que tengan como propiedad un conjunto de puntos.

		Para esto dentro de la funcion connectAndSubscribe, aparte de que se subscriba al topico de los puntos individuales tambien se subscriba al topico de lso poligonos que es /topic/newpolygon.{numdibujo}

	   ![Image](https://github.com/user-attachments/assets/45052bfd-6cd7-4646-ab34-2495c07f490b)

    2. El manejador de eventos de /app/newpoint.{numdibujo}, además de propagar los puntos a través del tópico '/topic/newpoints', llevará el control de los puntos recibidos(que podrán haber sido dibujados por diferentes clientes). Cuando se completen tres o más puntos, publicará el polígono en el tópico '/topic/newpolygon'. Recuerde que esto se realizará concurrentemente, de manera que REVISE LAS POSIBLES CONDICIONES DE CARRERA!. También tenga en cuenta que desde el manejador de eventos del servidor se tendrán N dibujos independientes!.

		Modificamos nuestro controlador para que mantenga el guardado de puntos temporal dentro de un ConcurrentHashMap para evitar condiciones de carrera, y asi mismo tener el conteo de puntos recibidos para que al momento de tener 3 o mas este, forme y envie el poligono al nuevo topico

		![Image](https://github.com/user-attachments/assets/5e6b1aaa-4e47-4de5-a0be-224929871800)

    3. El cliente, ahora también se suscribirá al tópico '/topic/newpolygon'. El 'callback' asociado a la recepción de eventos en el mismo debe, con los datos recibidos, dibujar un polígono, [tal como se muestran en ese ejemplo](http://www.arungudelli.com/html5/html5-canvas-polygon/).
    
		Agregamos una nueva funcion privada en el app.js llamada drawPolygon para poder dibujar el poligono en el canvas

		![Image](https://github.com/user-attachments/assets/6e7475d7-a822-463d-abe2-0e06a5d06d33)

	4. Verifique la funcionalidad: igual a la anterior, pero ahora dibujando polígonos cada vez que se agreguen cuatro puntos.

		Ejecutamos la aplicacion y nos conectamos al dibujo 1 donde dibujamos 3 puntos y observamos que este automaticamente dibuja el poligono 

		![Image](https://github.com/user-attachments/assets/304e386f-53de-4601-9dd0-dd2e590bb58a)
   
   		Volvemos a probar en otra instancia (dibujo 2) y vemos que funciona independientemente
		
		![Image](https://github.com/user-attachments/assets/420cee0f-8ab0-47e3-b07d-0328c2c74482)
		
		Y por ultimo verificamos que la otra pestaña conectada al dibujo 1 si haya mostrado el poligono antes dibujado de forma correcta

		![Image](https://github.com/user-attachments/assets/37039dcb-af25-4d26-80db-f55495048636)

4. A partir de los diagramas dados en el archivo ASTAH incluido, haga un nuevo diagrama de actividades correspondiente a lo realizado hasta este punto, teniendo en cuenta el detalle de que ahora se tendrán tópicos dinámicos para manejar diferentes dibujos simultáneamente.

	Creamos un nuevo diagrama actualizado dentro del ASTAH incluido con todo el funcionamiento actual incluyendo los topicos dinamicos

    ![Image](https://github.com/user-attachments/assets/4ca0c219-eae3-4c7f-9e31-2546de066255)

5. Haga commit de lo realizado.

	```bash
	git commit -m "PARTE FINAL".
	```	


### Criterios de evaluación

1. La aplicación propaga correctamente los puntos entre todas las instancias abierta de la misma, cuando hay sólo un dibujo.
2. La aplicación propaga correctamente los puntos entre todas las instancias abierta de la misma, cuando hay más de un dibujo.
3. La aplicación propaga correctamente el evento de creación del polígono, cuando colaborativamente se insertan cuatro puntos.
4. La aplicación propaga correctamente el evento de creación del polígono, cuando colaborativamente se insertan cuatro puntos, con 2 o más dibujos simultáneamente.
5. En la implementación se tuvo en cuenta la naturaleza concurrente del ejercicio. Por ejemplo, si se mantiene el conjunto de los puntos recibidos en una colección, la misma debería ser de tipo concurrente (thread-safe).
