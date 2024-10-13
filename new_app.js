const sensor = require('node-dht-sensor');
const { Pool } = require('pg');
const cron = require('node-cron');
require('dotenv').config();

// Configuração do sensor DHT11
const sensorType = 22;  // DHT11
const sensorPin = 22;    // GPIO pin número 22 (ajustar conforme necessário)

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Função para ler dados do sensor
function lerSensor() {
  return new Promise((resolve, reject) => {
    sensor.read(sensorType, sensorPin, (err, temperature, humidity) => {
      if (err) {
        reject(err);
      } else {
        resolve({ temperature, humidity });
      }
    });
  });
}

// Função para inserir dados no banco
async function inserirDados(temperatura, umidade) {
  const client = await pool.connect();
  try {
    const query = 'INSERT INTO sensor_dht11_dados (temperatura, umidade) VALUES ($1, $2)';
    await client.query(query, [temperatura, umidade]);
    console.log(`Dados inseridos: Temperatura ${temperatura}°C, Umidade ${umidade}%`);
  } catch (err) {
    console.error('Erro ao inserir dados:', err);
  } finally {
    client.release();
  }
}

// Função principal para ler o sensor e inserir dados
async function capturarEInserirDados() {
  try {
    const { temperature, humidity } = await lerSensor();
    await inserirDados(temperature, humidity);
  } catch (err) {
    console.error('Erro ao capturar ou inserir dados:', err);
  }
}

// Agendar a execução a cada hora
cron.schedule('0 * * * *', () => {
  console.log('Executando captura de dados...');
  capturarEInserirDados();
});

console.log('Aplicação iniciada. Aguardando próxima execução programada.');

// Executar imediatamente na inicialização
capturarEInserirDados();