var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }
    }

    var stompClient = null;
    var drawingId = null;  // ID del dibujo actual

    var addPointToCanvas = function (point) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI);
        ctx.stroke();
    };

    var drawPolygon = function (polygon) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");

        if (polygon.length < 3) return; // Un polígono necesita al menos 3 puntos

        ctx.beginPath();
        ctx.moveTo(polygon[0].x, polygon[0].y);

        for (var i = 1; i < polygon.length; i++) {
            ctx.lineTo(polygon[i].x, polygon[i].y);
        }
        ctx.closePath();

        ctx.fillStyle = "rgba(0, 255, 0, 0.3)"; // Color verde semi-transparente
        ctx.fill();
        ctx.strokeStyle = "green";
        ctx.stroke();
    };


    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);

        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);

            // Suscribirse a los puntos individuales
            stompClient.subscribe(`/topic/newpoint.${drawingId}`, function (message) {
                var receivedPoint = JSON.parse(message.body);
                addPointToCanvas(receivedPoint);
            });

            // Suscribirse a los polígonos
            stompClient.subscribe(`/topic/newpolygon.${drawingId}`, function (message) {
                var receivedPolygon = JSON.parse(message.body).points;
                drawPolygon(receivedPolygon);
            });

            console.log(`Suscrito a /topic/newpoint.${drawingId} y /topic/newpolygon.${drawingId}`);
        });

    };



    return {
        connect: function () {
            // Obtener el ID del dibujo ingresado por el usuario
            drawingId = document.getElementById("drawingId").value;
            if (!drawingId) {
                alert("Por favor, ingrese un ID de dibujo.");
                return;
            }

            console.info(`Conectando al dibujo ${drawingId}...`);
            //websocket connection
            connectAndSubscribe();

            canvas.addEventListener("click", function (evt) {
                var pos = getMousePosition(evt);
                var pt = new Point(pos.x, pos.y);
                console.info("Enviando punto a ${drawingId}: " + JSON.stringify(pt));

                // Enviar el punto al servidor /app/newpoint.{numdibujo}
                var topic = `/app/newpoint.${drawingId}`;
                stompClient.send(topic, {}, JSON.stringify(pt));

                // Dibujar el punto localmente
                addPointToCanvas(pt);
            });
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            console.log("Disconnected");
        }
    };

})();