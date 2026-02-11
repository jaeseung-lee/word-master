import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* 404 숫자 */}
        <div className="relative">
          <span className="text-[8rem] font-black leading-none tracking-tighter text-gray-04">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[8rem] font-black leading-none tracking-tighter text-primary/20">
            404
          </span>
        </div>

        {/* 메시지 */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-white">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="max-w-xs text-sm text-gray-02">
            요청하신 페이지가 존재하지 않거나, 이동되었거나, 삭제되었을 수
            있습니다.
          </p>
        </div>

        {/* 홈으로 버튼 */}
        <Link
          href="/dashboard"
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
