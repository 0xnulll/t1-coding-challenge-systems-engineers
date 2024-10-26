export interface RawMarketMessage {
    messageType: "market";
    buyPrice: string;
    sellPrice: string;
    startTime: string; // ISO 8601 format: "2024-01-01T19:00:00.000+00:00"
    endTime: string;
}
export interface MarketMessage {
    messageType: "market";
    buyPrice: number;
    sellPrice: number;
    startTime: Date;
    endTime: Date;
}

export interface RawTradeMessage {
    messageType: "trades";
    tradeType: "BUY" | "SELL";
    volume: string;
    time: string; // ISO 8601 format: "2024-01-01T19:00:00.000+00:00"
}
export interface TradeMessage {
    messageType: "trades";
    tradeType: "BUY" | "SELL";
    volume: number;
    time: Date;
}

export interface PnL {
    startTime: string,
    endTime: string,
    pnl: number
}