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

            // Suscribirse al tópico dinámico con el ID del dibujo
            var topic = `/topic/newpoint.${drawingId}`;
            stompClient.subscribe(topic, function (message) {
                var receivedPoint = JSON.parse(message.body);
                addPointToCanvas(receivedPoint);
            });

            console.log(`Suscrito a ${topic}`);
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

                // Dibujar el punto localmente
                addPointToCanvas(pt);

                // Enviar el punto al servidor
                var topic = `/topic/newpoint.${drawingId}`;
                stompClient.send(topic, {}, JSON.stringify(pt));
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