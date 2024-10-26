import {
    dbGetCollection
} from "./db"

/**
 * Retrieves the last open position from the database.
 *
 * @returns {Promise<number | 0>} A promise that resolves to the last open position as a number, 
 *                                or 0 if no position data is found.
 */
export async function getLastOpenPosition(): Promise < number | 0 > {
    const dbCollection = dbGetCollection('position');
    const data = await dbCollection.findOne({
        type: "position"
    });
    if (data) {
        return data.data
    }
    return 0;
}

/**
 * Saves profit and loss (PnL) data to the database within a specified time range.
 *
 * @param {Date} startTime - The start time of the PnL period.
 * @param {Date} endTime - The end time of the PnL period.
 * @param {number} pnl - The profit and loss value to save.
 * @returns {Promise<void>} A promise that resolves when the data has been saved.
 */
export async function savePnl(startTime: Date, endTime: Date, pnl: number) {
    const dbCollection = dbGetCollection('pnl');
    await dbCollection.insertOne({
        startTime,
        endTime,
        pnl
    });
}

/**
 * Saves or updates the current open position in the database.
 *
 * @param {number} position - The current open position to save.
 * @returns {Promise<void>} A promise that resolves when the position has been saved or updated.
 */
export async function saveOpenPosition(position: number) {
    const dbCollection = dbGetCollection('position');
    await dbCollection.updateOne({
        type: "position"
    }, {
        $set: {
            type: "position",
            data: position
        }
    }, {
        upsert: true
    })
}

/**
 * Resets the database by clearing all entries in the PnL collection and setting the open position to 0.
 *
 * @returns {Promise<void>} A promise that resolves when the database reset is complete.
 */
export async function resetDb() {
    await dbGetCollection('pnl').deleteMany({});
    await saveOpenPosition(0);
}