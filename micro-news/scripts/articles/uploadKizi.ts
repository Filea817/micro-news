import { initializeApp } from 'firebase/app'
import { getFirestore, collection, setDoc, doc, serverTimestamp } from 'firebase/firestore'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const firebaseConfig = {
    apiKey: "AIzaSyDAGp6TNmhtYv60r4Swl8ggJfhGh9pTxL8",
    authDomain: "micro-news-a1948.firebaseapp.com",
    projectId: "micro-news-a1948",
    storageBucket: "micro-news-a1948.appspot.app",
    messagingSenderId: "324917398576",
    appId: "1:324917398576:web:5d7c89b8add1b49e29f1f5",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.json'))

async function upload() {
  for (const file of files) {
    const filePath = path.join(__dirname, file)
    const article = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    const id = article.id || file.replace('.json', '')
    await setDoc(doc(db, 'articles', id), {
      ...article,
      views: 0,
      timestamp: serverTimestamp()
    })

    console.log(`アップロード完了: ${id}`)
  }
}

upload().catch(console.error)