const express = require('express');
const { join } = require('node:path');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Servir archivos estáticos
app.use(express.static(join(__dirname, '../cliente')));
app.use(express.static(join(__dirname, '../public')));

// Variables globales
let arduinoPort = null;
let isArduinoConnected = false;

// Función para buscar Arduino
async function findArduino() {
    try {
        const { SerialPort } = require('serialport');
        const ports = await SerialPort.list();
        
        // Buscar puerto Arduino (común: /dev/ttyUSB0, /dev/ttyACM0, COM3, etc.)
        const arduinoPorts = ports.filter(port => 
            port.manufacturer && (
                port.manufacturer.toLowerCase().includes('arduino') ||
                port.manufacturer.toLowerCase().includes('ch340') ||
                port.manufacturer.toLowerCase().includes('ftdi') ||
                port.path.includes('ttyUSB') ||
                port.path.includes('ttyACM')
            )
        );
        
        if (arduinoPorts.length > 0) {
            console.log('🔍 Puertos Arduino encontrados:', arduinoPorts.map(p => p.path));
            return arduinoPorts[0].path;
        } else {
            console.log('⚠️  No se encontraron puertos Arduino');
            return null;
        }
    } catch (error) {
        console.error('❌ Error buscando Arduino:', error);
        return null;
    }
}

// Función para conectar con Arduino
async function connectArduino() {
    const portPath = await findArduino();
    
    if (!portPath) {
        console.log('❌ No se puede conectar: Arduino no encontrado');
        return false;
    }
    
    try {
        arduinoPort = new SerialPort({
            path: portPath,
            baudRate: 115200,
        });
        
        const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));
        
        arduinoPort.on('open', () => {
            console.log(`✅ Conectado al Arduino en ${portPath}`);
            isArduinoConnected = true;
            
            // Notificar a todos los clientes
            io.emit('arduino_status', { connected: true, port: portPath });
        });
        
        arduinoPort.on('error', (err) => {
            console.error('❌ Error del puerto serial:', err);
            isArduinoConnected = false;
            io.emit('arduino_status', { connected: false });
        });
        
        arduinoPort.on('close', () => {
            console.log('🔌 Puerto serial cerrado');
            isArduinoConnected = false;
            io.emit('arduino_status', { connected: false });
        });
        
        // Leer datos del Arduino
        parser.on('data', (data) => {
            const cleanData = data.trim();
            console.log('📡 Datos recibidos:', cleanData);
            
            // Intentar parsear como JSON (formato del Arduino)
            if (cleanData.startsWith('{') && cleanData.endsWith('}')) {
                try {
                    const jsonData = JSON.parse(cleanData);
                    console.log('✅ JSON válido del Arduino:', jsonData);
                    
                    // Enviar datos completos a todos los clientes
                    io.emit('arduino_data', jsonData);
                    
                } catch (parseError) {
                    console.log('⚠️  No es JSON válido:', cleanData);
                }
            } else if (cleanData === 'KATARI_SENSORS_READY') {
                console.log('🚀 Arduino listo para enviar datos');
                io.emit('arduino_ready', true);
            }
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Error conectando con Arduino:', error);
        return false;
    }
}

// Socket.io eventos
io.on('connection', (socket) => {
    console.log('🔗 Cliente conectado:', socket.id);
    
    // Enviar estado actual del Arduino
    socket.emit('arduino_status', { connected: isArduinoConnected });
    
    socket.on('connect_arduino', async () => {
        console.log('📞 Cliente solicitó conexión con Arduino');
        if (!isArduinoConnected) {
            await connectArduino();
        }
    });
    
    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado:', socket.id);
    });
});

// Intentar conectar al Arduino al iniciar
connectArduino();

// Reconectar automáticamente cada 30 segundos si no está conectado
setInterval(async () => {
    if (!isArduinoConnected) {
        console.log('🔄 Intentando reconectar con Arduino...');
        await connectArduino();
    }
}, 30000);

server.listen(3000, () => {
    console.log('🚀 Servidor iniciado en puerto 3000');
    console.log('🔍 Buscando Arduino...');
});
