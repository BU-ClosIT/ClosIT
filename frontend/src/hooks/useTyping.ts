import { useEffect, useRef, useState } from "react";

export function useTyping() {
  const [toType, setToType] = useState<string>("");
  const [typedArr, setTypedArr] = useState<string[]>([]);

  const type = () => {
    const respArr = toType.split("");
    respArr.forEach((letter, idx) => {
      setTimeout(() => {
        setTypedArr((prev) => [...prev, letter]);
      }, idx * 5);
    });
  };

  useEffect(() => {
    setTypedArr([]);
    type();
  }, [toType]);

  const clear = () => {
    setTypedArr([]);
    setToType("");
  };

  return { typedArr, setToType, type, clear };
}
