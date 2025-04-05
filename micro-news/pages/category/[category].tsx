// pages/category/[category].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import Link from 'next/link'
import Script from 'next/script'


const ITEMS_PER_PAGE = 10

type Article = {
id: string
title: string
author: string
date: string
category: string
views?: number
}

export default function CategoryPage() {
const router = useRouter()
const { category } = router.query
const [articles, setArticles] = useState<Article[]>([])
const [loading, setLoading] = useState(true)
const [currentPage, setCurrentPage] = useState(1)

useEffect(() => {
    if (!category) return

    const fetchByCategory = async () => {
    const q = query(
        collection(db, 'articles'),
        where('category', '==', category),
        orderBy('date', 'desc')
    )
    const snapshot = await getDocs(q)
    const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Article[]
    setArticles(docs)
    setLoading(false)
    }

    fetchByCategory()
}, [category])

const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
const endIndex = startIndex + ITEMS_PER_PAGE
const visibleArticles = articles.slice(startIndex, endIndex)
const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE)

return (
    <>
    <header className="bg-gray-900 text-white p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold hover:underline">
                ミクロ社会ニュース
            </Link>
            <Nav />
        </div>
    </header>

    <main className="max-w-5xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
            カテゴリ: {category}
        </h2>

        {loading ? (
        <p>読み込み中...</p>
        ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {articles.map(article => (
            <li key={article.id} className="border p-4 rounded shadow hover:shadow-lg transition">
                <Link href={`/articles/${article.id}`}>
                <h3 className="text-lg font-semibold text-blue-700">{article.title}</h3>
                </Link>
                <p className="text-sm text-gray-500">
                {article.date}｜{article.author}
                </p>
            </li>
            ))}
        </ul>
        )}

        {/* 広告表示場所 */}
        <Script
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3635913502005838"
        crossOrigin="anonymous"
        />

        {/* 広告 */}
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
                <Footer/>
            </div>
        </footer>
    </>
)
}
