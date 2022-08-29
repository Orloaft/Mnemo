import * as React from "react";

export function useMountEffect(effect: any) {
  return React.useEffect(effect as React.EffectCallback, []);
}

export function setOnKeyDown(f) {
  document.onkeydown = function (e: any) {
    e = e || window.event;
    f(e);
  };
}
