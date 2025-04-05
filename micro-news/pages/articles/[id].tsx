// pages/articles/[id].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  query,
  collection,
  where,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore'
import Link from 'next/link'
import Script from 'next/script'

type Article = {
  id: string
  title: string
  author: string
  date: string
  category: string
  content: string
  views?: number
  tags?: string[]
}

export default function ArticlePage() {
  const router = useRouter()
  const { id } = router.query

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [prevArticle, setPrevArticle] = useState<Article | null>(null)
  const [nextArticle, setNextArticle] = useState<Article | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const docRef = doc(db, 'articles', id as string)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        setArticle(null)
        setLoading(false)
        return
      }

      const current = docSnap.data() as Article
      setArticle(current)

      // 閲覧数 +1
      await updateDoc(docRef, { views: increment(1) })

      // 前の記事（date < 現在、降順で1件）
      const prevQuery = query(
        collection(db, 'articles'),
        where('date', '<', current.date),
        orderBy('date', 'desc'),
        limit(1)
      )
      const prevSnap = await getDocs(prevQuery)
      if (!prevSnap.empty) {
        const prev = prevSnap.docs[0]
        setPrevArticle({ id: prev.id, ...prev.data() } as Article)
      }

      // 次の記事（date > 現在、昇順で1件）
      const nextQuery = query(
        collection(db, 'articles'),
        where('date', '>', current.date),
        orderBy('date', 'asc'),
        limit(1)
      )
      const nextSnap = await getDocs(nextQuery)
      if (!nextSnap.empty) {
        const next = nextSnap.docs[0]
        setNextArticle({ id: next.id, ...next.data() } as Article)
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) return <p className="p-6">読み込み中...</p>
  if (!article) return <p className="p-6">記事が見つかりませんでした。</p>

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

      {/* 記事本文 */}
      <main className="max-w-3xl mx-auto p-6">
        <p className="text-sm text-gray-900 mb-2">
          {article.date}｜{article.category}｜{article.author}
        </p>
        <h1 className="text-2xl font-bold mb-6 text-gray-900">{article.title}</h1>
        <article className="text-base leading-7 whitespace-pre-wrap text-gray-900">
          {article.content}
        </article>


    {/* 広告表示場所 */}
    <Script
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3635913502005838"
        crossOrigin="anonymous"
      />

    {/* 広告表示場所 */}
    <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3635913502005838"
        data-ad-slot="9328172597"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      <Script id="adsbygoogle-init" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>

      {/* タグ */}
                {article.tags && article.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm text-gray-600 mb-2">タグ：</h3>
            <ul className="flex flex-wrap gap-2 text-sm">
              {article.tags.map((tag, index) => (
                <li
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 cursor-default"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}


        {/* 前後の記事ナビゲーション */}
        <div className="flex justify-between items-center mt-12 text-sm text-blue-700">
          {prevArticle ? (
            <Link href={`/articles/${prevArticle.id}`} className="hover:underline">
              ← 前の記事：{prevArticle.title}
            </Link>
          ) : <span />}

          {nextArticle ? (
            <Link href={`/articles/${nextArticle.id}`} className="hover:underline ml-auto text-right">
              次の記事：{nextArticle.title} →
            </Link>
          ) : <span />}
        </div>
      </main>

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

