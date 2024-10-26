import Kafka from 'node-rdkafka';
import {
    toTradeMessage
} from './transformation';
import {
    connectToMongoDB
} from "./db"
import {
    MarketMessage,
    TradeMessage
} from './types';
import {
    toMarketMessage
} from './transformation';
import {
    getLastOpenPosition,
    resetDb,
    saveOpenPosition,
    savePnl
} from './db_service';

const tradeVolume = {
    buy: 0,
    sell: 0
};
const consumer = new Kafka.KafkaConsumer({
    'group.id': 'calculation-service',
    'metadata.broker.list': 'kafka:9092',
}, {});

connectToMongoDB("mongodb://database:27017/tradingDB", "tradingDB");

consumer.connect({}, (err, metaData) => {
    if (err) {
        console.error('Error connecting to Kafka:', err);
        return;
    }

    console.log('Connected to Kafka:', metaData);
});

function resetTradeVolume() {
    // Reset trade volume
    tradeVolume.buy = 0;
    tradeVolume.sell = 0;
}

/**
 * Processes a trade message and updates the trade volume accordingly.
 *
 * @param {TradeMessage} data - The trade message containing trade type and volume.
 *                              `data.tradeType` should be either "BUY" or "SELL",
 *                              and `data.volume` indicates the volume of the trade.
 */
function processTradeMessage(data: TradeMessage) {
    if (data.tradeType === "BUY") {
        tradeVolume.buy += data.volume;
    } else if (data.tradeType === "SELL") {
        tradeVolume.sell += data.volume;
    }
}

/**
 * Processes a market message, calculates the profit and loss (PnL) based on the
 * current trade volume, and saves both the PnL and the updated open position.
 *
 * @param {MarketMessage} data - The market message containing start and end times,
 *                               as well as the current buy and sell prices.
 * @returns {Promise<void>} A promise that resolves after saving the PnL and the
 *                          updated open position.
 */
async function processMarketMessage(data: MarketMessage):Promise<void> {
    const pnl = tradeVolume.sell * data.sellPrice - tradeVolume.buy * data.buyPrice;
    // Save PNL
    await savePnl(data.startTime, data.endTime, pnl);
    const lastOpenPosition = await getLastOpenPosition();

    // Save open posistion
    await saveOpenPosition(lastOpenPosition + tradeVolume.buy - tradeVolume.sell);
    resetTradeVolume();
}




consumer.on('ready', async () => {
    consumer.subscribe(['trades', "market"]);
    consumer.consume();
    // reset pnl on db
    await resetDb();
}).on('data', async (data) => {
    if (!data.value) {
        throw new Error('Invalid message');
    }

    const message = JSON.parse(data.value.toString());
    if (message.messageType === 'trades') {
        const tradeMessage = toTradeMessage(message);
        processTradeMessage(tradeMessage);
    } else if (message.messageType === "market") {
        const marketMessage = toMarketMessage(message);
        await processMarketMessage(marketMessage);
    } else {
        throw new Error('Invalid trade type');
    }
});