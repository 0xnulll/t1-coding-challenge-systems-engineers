import { Producer, ProducerGlobalConfig } from 'node-rdkafka';
import { StreamProcessor } from './StreamProcessor';
import { RawMarketMessage, RawTradeMessage } from './types';
let timeFrameCounter = 0;
let tradeCounter = 0;

type RawMessage = RawMarketMessage | RawTradeMessage;

const producerConfig: ProducerGlobalConfig = {
    'metadata.broker.list': 'kafka:9092',
    'dr_cb': true,  // Delivery report callback
};
const NumberOfClient = 2;
const producer = new Producer(producerConfig);

producer.on('event.error', (err) => {
    console.error('Error from producer:', err);
});

producer.on('ready', () => {
    console.log('Kafka Producer is ready');
    fetchStreamAndProduce()
        .then(() => {
            console.log('Stream processing completed');
        })
        .catch((error) => {
            console.error('Stream processing failed:', error);
        }
        );
});

function onMessage(message: RawMessage) {
    // reseting timeframe
    producer.produce(
        message.messageType,
        timeFrameCounter%NumberOfClient,
        Buffer.from(JSON.stringify(message)),
        null,
        Date.now() 
    );

    if (message.messageType === "market") {
        timeFrameCounter += 1;
        tradeCounter = 0;
    } else {
        tradeCounter += 1;
    }
}

async function fetchStreamAndProduce() {
    const response = await fetch('https://t1-coding-challenge-9snjm.ondigitalocean.app/stream');

    if (!response.ok) {
        console.error('Failed to fetch stream:', response.statusText);
        return;
    }

    if (!response.body) {
        console.error('Response body is null');
        return;
    }

    const streamProcessor = new StreamProcessor(onMessage);

    await streamProcessor.processStream(response.body);

    console.log('Streaming ended');
    producer.disconnect();
};

producer.connect({}, (err, metaData) => {
    if (err) {
        console.error('Error connecting to Kafka:', err);
        return;
    }

    console.log('Connected to Kafka:', metaData);
});
