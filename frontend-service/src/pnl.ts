import {
    dbGetCollection
} from "./db";

export interface PnL {
    startTime: string,
    endTime: string,
    pnl: number
}

/**
 * Retrieves an array of PnL records from the database, sorted by start time in descending order.
 *
 * @returns {Promise<Array<PnL>>} A promise that resolves to an array of PnL records,
 *                                or an empty array if no records are found.
 */
export async function getPnls(): Promise < Array < PnL >> {
    const dbCollection = dbGetCollection('pnl');
    const data = await dbCollection.find < PnL > ({}).sort({
        "startTime": -1
    });
    if (data) {
        return data.toArray();
    }
    return [];
}