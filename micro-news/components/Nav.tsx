// components/Nav.tsx
import Link from 'next/link'

export default function Nav() {
return (
    <nav className="space-x-2 text-sm">
    <Link href="/" className="px-4 py-4 rounded hover:bg-gray-700">ホーム</Link>
    <Link href="/category/政治" className="px-5 py-4 rounded hover:bg-gray-700">政治</Link>
    <Link href="/category/事件" className="px-5 py-4 rounded hover:bg-gray-700">事件</Link>
    <Link href="/category/繁殖" className="px-5 py-4 rounded hover:bg-gray-700">繁殖</Link>
    <Link href="/category/災害" className="px-5 py-4 rounded hover:bg-gray-700">災害</Link>
    <Link href="/category/環境" className="px-5 py-4 rounded hover:bg-gray-700">環境</Link>
    </nav>
)
}
