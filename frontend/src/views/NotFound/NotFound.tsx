import { Link } from '@tanstack/react-router'

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">ページが見つかりません</h2>
      <p className="text-gray-600 mb-8">
        お探しのページは存在しないか、移動または削除された可能性があります。
      </p>
      <Link
        to="/"
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
      >
        ホームに戻る
      </Link>
    </div>
  )
}
