import {ImageResponse} from "next/og";

export const alt = "DealState: One live state for every deal";
export const size = {width: 1200, height: 630};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#101820",
          color: "#F5F2EA",
        }}
      >
        <div style={{fontSize: 32, letterSpacing: "0.14em"}}>DealState</div>
        <div style={{fontSize: 76, marginTop: 40, maxWidth: 900}}>One live state for every deal.</div>
        <div style={{fontSize: 26, marginTop: 30, color: "#D7DED8"}}>Source-backed investment state.</div>
      </div>
    ),
    size,
  );
}
