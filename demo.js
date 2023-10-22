let mqttClient;

window.addEventListener("load", (event) => {
    connectToBroker();
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const loginData = {
            email: email,
            password: password
        };
        publishLoginData(loginData);
    });
});

function connectToBroker() {
    const clientId = "client" + Math.random().toString(36).substring(7);
    const host = "ws://192.168.1.24:9001/mqtt";
    const options = {
        keepalive: 60,
        clientId: clientId,
        protocolId: "MQTT",
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000
    };
    mqttClient = mqtt.connect(host, options);
    mqttClient.on("error", (err) => {
        console.log("Error: ", err);
        mqttClient.end();
    });
    mqttClient.on("reconnect", () => {
        console.log("Reconnecting...");
    });
    mqttClient.on("connect", () => {
        console.log("Client connected:" + clientId);
    });
}

function publishLoginData(loginData) {
    const topic = "login";
    const message = JSON.stringify(loginData);
    mqttClient.publish(topic, message, {
        qos: 0,
        retain: false
    });
    console.log(`Sending Login Data: ${message}`);
}
