// src/components/JackpotToggle.tsx
import React from "react";
import styled from "styled-components";
import useJackpotOptIn from "../hooks/useJackpotOptIn";

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 18px;
  color: white;
`;

const Label = styled.div`
  font-size: 14px;
  color: #ffe42d;
  margin-right: 12px;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  input { display: none; }
  span {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #333;
    border-radius: 999px;
    transition: background 0.2s;
  }
  span:before {
    content: "";
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    top: 3px;
    background: white;
    border-radius: 50%;
    transition: transform 0.18s;
  }
  input:checked + span {
    background: #22c55e;
  }
  input:checked + span:before {
    transform: translateX(20px);
  }
`;

export default function JackpotToggle({ compact }: { compact?: boolean }) {
  const [optIn, setOptIn] = useJackpotOptIn();

  return (
    <Row style={compact ? { padding: "8px 12px" } : undefined}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Label>Jackpot-Chance (0.1%)</Label>
        {!compact && <div style={{ fontSize: 12, color: "#aaa" }}>Zahle +0,1% für Teilnahme</div>}
      </div>

      <Switch>
        <input
          type="checkbox"
          checked={optIn}
          onChange={(e) => setOptIn(e.target.checked)}
          aria-label="Jackpot Chance aktivieren"
        />
        <span />
      </Switch>
    </Row>
  );
}
