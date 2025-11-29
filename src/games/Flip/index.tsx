import { GambaUi, useWagerInput } from "gamba-react-ui";
import { GAMBA_SDK_VERSION } from "gamba-react-ui";
import { useGamba } from "gamba-react";
import { useEffect, useState } from "react";

export default function Flip() {
  const gamba = useGamba();
  const wager = useWagerInput();
  const [side, setSide] = useState(0);

  const play = () => {
    gamba.play({ wager: wager.wager, metadata: { side } });
  };

  useEffect(() => {
    gamba.on("play:success", () => {});
  }, [gamba]);

  return (
    <GambaUi.Screen>
      <GambaUi.Portal target="screen">
        <div
          style={{
            minHeight: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "rgba(255, 255, 255, 0.06)",
              padding: "22px",
              borderRadius: "18px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: "18px" }}>Flip</h2>

            <GambaUi.WagerInput {...wager} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1.2fr",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              <button
                onClick={() => setSide(0)}
                style={{
                  padding: "12px 0",
                  borderRadius: "14px",
                  border: side === 0 ? "2px solid #4ade80" : "2px solid transparent",
                  background: "rgba(0, 0, 0, 0.3)",
                }}
              >
                Heads
              </button>
              <button
                onClick={() => setSide(1)}
                style={{
                  padding: "12px 0",
                  borderRadius: "14px",
                  border: side === 1 ? "2px solid #4ade80" : "2px solid transparent",
                  background: "rgba(0, 0, 0, 0.3)",
                }}
              >
                Tails
              </button>
              <GambaUi.PlayButton
                onClick={play}
                style={{
                  borderRadius: "14px",
                  padding: "12px 0",
                }}
              >
                FLIP
              </GambaUi.PlayButton>
            </div>
          </div>
        </div>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <div style={{ display: "none" }} />
      </GambaUi.Portal>
    </GambaUi.Screen>
  );
}
