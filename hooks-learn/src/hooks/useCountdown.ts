import { useCallback } from "react";
import { useBoolean } from "./useBoolean";
import { useCounter } from "./useCounter";
import { useInterval } from "./useInterval";

type CountdownOptions = {
    countStart: number;
    countStop?: number;
    intervalMs?: number;
    isIncrement?: boolean;
}

type CountdownController = {
    startCountdown: () => void;
    stopCountdown: () => void;
    resetCountdown: () => void;
}

export function useCountdown({
    countStart,
    countStop = 0,
    intervalMs = 1000,
    isIncrement = false
}: CountdownOptions): [number, CountdownController] {

    const {
        count,
        increment,
        decrement,
        reset: resetCount
    } = useCounter(countStart);

    const {
        bool: isCountdownRunning,
        setTrue: startCountdown,
        setFalse: stopCountdown,
    } = useBoolean(false)

    const resetCountdown = useCallback(() => {
        stopCountdown()
        resetCount()
    }, [
        stopCountdown,resetCount
    ])

    const countdownCallback = useCallback(() => {
        if (count === countStop) {
            stopCountdown()
            return
        }

        if (isIncrement) {
            increment()
        } else {
            decrement()
        }
    }, [
        count, countStop, decrement,increment,isIncrement,stopCountdown
    ])

    useInterval(countdownCallback, isCountdownRunning?intervalMs: null)

    return [
        count, {
            startCountdown,
            stopCountdown,
            resetCountdown
        }
    ]
}