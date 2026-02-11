import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          backgroundColor: "#171717",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: "8rem",
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.05em",
                color: "hsl(0, 0%, 18%)",
              }}
            >
              404
            </span>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                페이지를 찾을 수 없습니다
              </h1>
              <p
                style={{
                  maxWidth: "20rem",
                  fontSize: "0.875rem",
                  color: "hsl(0, 0%, 60%)",
                }}
              >
                요청하신 페이지가 존재하지 않거나, 이동되었거나, 삭제되었을 수
                있습니다.
              </p>
            </div>

            <Link
              href="/dashboard"
              style={{
                marginTop: "0.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                borderRadius: "0.375rem",
                backgroundColor: "#76abae",
                padding: "0.625rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#171717",
                textDecoration: "none",
              }}
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
