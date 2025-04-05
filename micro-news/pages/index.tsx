// pages/index.tsx
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  Timestamp
} from 'firebase/firestore'

const ITEMS_PER_PAGE = 10

type Article = {
  id: string
  title: string
  author: string
  date: string
  category: string
  views?: number
  content?: string
  timestamp?: any
  tags?: string[]
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [popularArticles, setPopularArticles] = useState<Article[]>([])
  const [topArticle, setTopArticle] = useState<Article | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchArticles = async () => {
      const now = Timestamp.now()
      const yesterday = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000)

      // 24時間以内で最も閲覧数が多い記事を1件取得
      const topQuery = query(
        collection(db, 'articles'),
        where('timestamp', '>=', yesterday),
        orderBy('timestamp', 'desc'),
        orderBy('views', 'desc'),
        limit(1)
      )
      const topSnap = await getDocs(topQuery)
      if (!topSnap.empty) {
        const doc = topSnap.docs[0]
        setTopArticle({ id: doc.id, ...doc.data() } as Article)
      }

      // 全記事を新しい順に取得
      const q = query(
        collection(db, 'articles'),
        orderBy('date', 'desc')
      )
      const snapshot = await getDocs(q)
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[]

      setArticles(docs)

      // 人気記事（viewsで並び替えて上位5件）
      const popularQuery = query(
        collection(db, 'articles'),
        orderBy('views', 'desc'),
        limit(5)
      )
      const popularSnapshot = await getDocs(popularQuery)
      const popularDocs = popularSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[]
      setPopularArticles(popularDocs)
    }

    fetchArticles()
  }, [])

  // 表示する記事を切り出す
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const visibleArticles = articles.slice(startIndex, endIndex)
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE)

  return (
    <>
      {/* ヘッダー */}
      <header className="bg-gray-900 text-white p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold hover:underline">
            ミクロ社会ニュース
          </Link>
          <Nav />
        </div>
      </header>

      {/* 🔥 ここに注目記事セクションを追加 */}
      {topArticle && (
        <section className="max-w-5xl mx-auto p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">🕒 トレンド記事</h2>
          <Link
            href={`/articles/${topArticle.id}`}
            className="block border rounded-lg p-6 shadow-lg bg-yellow-50 hover:bg-yellow-100 hover:scale-105 transition-transform duration-200 transition"
          >
            <h3 className="text-2xl font-bold text-blue-800 mb-2">{topArticle.title}</h3>
            <p className="text-sm text-gray-900">
              {topArticle.date}｜{topArticle.category}｜{topArticle.author}
            </p>
            <p className="mt-2 text-gray-800 text-base line-clamp-3">
              {topArticle.content?.slice(0, 150)}...
            </p>
          </Link>
        </section>
      )}

      {/* メイン + サイドバー */}
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 記事一覧（3列分） */}
        <section className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {visibleArticles.map(article => (
            <Link
              href={`/articles/${article.id}`}
              key={article.id}
              className="block border rounded-lg p-4 shadow hover:shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-200 transition"
            >
              <h2 className="text-lg font-semibold text-blue-700">{article.title}</h2>
              <p className="text-sm text-gray-500">
                {article.date}｜{article.category}｜{article.author}
              </p>
              <p className="mt-2 text-gray-700 text-sm line-clamp-2">詳細を見る</p>
            </Link>
          ))}
        </section>

        {/* サイドバー：人気記事 */}
        <aside className="md:col-span-1">
          <h2 className="text-lg font-bold mb-4 text-gray-900">🔥 人気記事</h2>
          <ul className="space-y-3 text-sm">
            {popularArticles.map(article => (
              <li key={article.id} className="border-l-4 border-blue-500 pl-3">
                <Link
                  href={`/articles/${article.id}`}
                  className="text-blue-700 hover:underline font-semibold"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </main>
      

              {/* ページネーション表示 */}
              {totalPages > 1 && (
              <div className="col-span-full mt-6 flex justify-center space-x-2 mr-70">
              {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      {/* フッター */}
      <footer className="bg-gray-100 text-gray-600 text-sm text-center py-4 mt-12 border-t">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold hover:underline">
            ミクロ社会ニュース
          </Link>
          <Footer />
        </div>
      </footer>
    </>
  )
}
