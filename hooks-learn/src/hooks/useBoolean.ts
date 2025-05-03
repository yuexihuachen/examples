import { useCallback, useState } from "react";

export function useBoolean(defaultValue = false) {

    const [bool, setBool] = useState(defaultValue);

    const setTrue = useCallback(() => {setBool(true)}, [])

    const setFalse = useCallback(() => { setBool(false)}, [])

    const toggle = useCallback(() => {setBool(x => !x)}, [])

    return {
        bool,
        setBool,
        setTrue,
        setFalse,
        toggle
    }
}