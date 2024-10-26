import {
    dbGetCollection
} from "./db";

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
        return data.data.toFixed(5)
    }
    return 0;
}