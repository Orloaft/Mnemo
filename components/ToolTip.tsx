import { Popover, Typography } from "@mui/material";
import React, { ReactNode, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

interface ToolTipProps {
  anchorRef: any;
  content: string;
  children: ReactNode;
}

export function ToolTip(props: ToolTipProps) {
  const { children, anchorRef } = props;

  const [isActive, setIsActive] = React.useState(false);
  const debouncedClick = useDebouncedCallback((isActive: boolean) => {
    setIsActive(isActive);
  }, 100);
  return (
    <div
      onClick={() => {
        debouncedClick(!isActive);
      }}
      onMouseLeave={() => debouncedClick(false)}
    >
      {children}
      <div style={{ pointerEvents: "none" }}>
        <Popover
          style={{
            pointerEvents: "none",
          }}
          id="card"
          open={isActive}
          onClose={() => null}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 150, left: 500 }}
        >
          <Typography
            sx={{
              fontFamily: "SilkScreen",
              p: 2,
              background: ` linear-gradient(
                109.6deg,
                rgba(15, 2, 2, 1) 11.2%,
                rgba(36, 163, 190, 1) 91.1%
              )`,
              border: `2px solid #ffebcd`,
              width: "10rem",
              height: "10rem",
              color: "#ffebcd",
            }}
          >
            {props.content}
          </Typography>
        </Popover>
      </div>
    </div>
  );
}
