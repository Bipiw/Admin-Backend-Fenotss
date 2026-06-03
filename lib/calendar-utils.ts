import { ETHIOPIAN_MONTHS } from "./constants"
const ethDate = require("ethiopian-date");

export interface EthDate {
    year: number;
    month: number;
    day: number;
}

/**
 * Converts a Gregorian Date to an Ethiopian Date
 */
export function toEthDate(date: Date): EthDate {
    const [year, month, day] = ethDate.toEthiopian(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    );
    return { year, month, day };
}

/**
 * Formats an Ethiopian date with month name
 */
export function formatEthDate(date: Date, locale: "en" | "am" = "en"): string {
    const { year, month, day } = toEthDate(date);
    const monthName = ETHIOPIAN_MONTHS[locale][month - 1];

    if (locale === "am") {
        return `${monthName} ${day} ቀን ${year} ዓ.ም`;
    }
    return `${monthName} ${day}, ${year} E.C.`;
}

/**
 * Converts Ethiopian date back to Gregorian
 */
export function toGregorian(year: number, month: number, day: number): Date {
    const [gYear, gMonth, gDay] = ethDate.toGregorian(year, month, day);
    return new Date(gYear, gMonth - 1, gDay);
}
