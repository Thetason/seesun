const KST_OFFSET_HOURS = 9;

export type AssignmentAvailabilityInput = {
    availableFrom?: Date | string | null;
    availableUntil?: Date | string | null;
};

type AvailabilityWindowInput = {
    availableFrom?: string | null;
    availableUntil?: string | null;
};

function toDate(value: Date | string | null | undefined): Date | null {
    if (!value) {
        return null;
    }

    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function createDateFromKstParts(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute = 0,
    second = 0
) {
    return new Date(Date.UTC(year, month, day, hour - KST_OFFSET_HOURS, minute, second));
}

export function getDefaultLongBlackWindow(referenceDate = new Date()) {
    const referenceInKst = new Date(referenceDate.getTime() + KST_OFFSET_HOURS * 60 * 60 * 1000);
    const year = referenceInKst.getUTCFullYear();
    const month = referenceInKst.getUTCMonth();
    const day = referenceInKst.getUTCDate();

    return {
        availableFrom: createDateFromKstParts(year, month, day, 9),
        availableUntil: createDateFromKstParts(year, month, day + 1, 6),
    };
}

export function getDefaultMissionPossibleWindow(referenceDate = new Date()) {
    return getDefaultLongBlackWindow(referenceDate);
}

export function getMissionPossibleWindowForDate(dateKey: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);

    if (!match) {
        throw new Error("Invalid missionPossible date key.");
    }

    const [, yearValue, monthValue, dayValue] = match;
    const year = Number(yearValue);
    const month = Number(monthValue) - 1;
    const day = Number(dayValue);

    return {
        availableFrom: createDateFromKstParts(year, month, day, 9),
        availableUntil: createDateFromKstParts(year, month, day + 1, 6),
    };
}

export function parseAvailabilityWindow(input: AvailabilityWindowInput) {
    const availableFrom = toDate(input.availableFrom);
    const availableUntil = toDate(input.availableUntil);

    if (input.availableFrom && !availableFrom) {
        return { error: "Invalid availableFrom date." };
    }

    if (input.availableUntil && !availableUntil) {
        return { error: "Invalid availableUntil date." };
    }

    if (availableFrom && availableUntil && availableFrom >= availableUntil) {
        return { error: "availableFrom must be earlier than availableUntil." };
    }

    return { availableFrom, availableUntil };
}

export function getAssignmentAvailabilityState(
    input: AssignmentAvailabilityInput,
    referenceDate = new Date()
) {
    const availableFrom = toDate(input.availableFrom);
    const availableUntil = toDate(input.availableUntil);

    const isUpcoming = Boolean(availableFrom && referenceDate < availableFrom);
    const isExpired = Boolean(availableUntil && referenceDate > availableUntil);

    return {
        availableFrom,
        availableUntil,
        isUpcoming,
        isExpired,
        isAvailable: !isUpcoming && !isExpired,
        hasWindow: Boolean(availableFrom || availableUntil),
    };
}
