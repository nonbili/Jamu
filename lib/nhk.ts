import * as cheerio from 'cheerio/slim'
import { News, nhk$ } from '@/states/nhk'
import { XMLParser } from 'fast-xml-parser'

const threshold = 3 * 3600 * 1000 // 3 hours

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
})

export async function fetchNewsList() {
  const syncedAt = nhk$.syncedAt.get()

  const now = Date.now()
  if (now - syncedAt < threshold) {
    return
  }

  const res = await fetch('https://nhkeasier.com/feed/')
  const xml = await res.text()
  try {
    const list = Object.values(data).flat().slice(0, 50)
    const newsList = list.map((news: any) => {
      const {
        news_id,
        title,
        news_easy_image_uri,
        news_web_image_uri,
        news_easy_voice_uri,
        news_publication_time,
        news_web_url,
      } = news
      const publishedAt = new Date(news_publication_time + '+09:00')
      return {
        id: news_id,
        image: news_easy_image_uri
          ? `https://www3.nhk.or.jp/news/easy/${news_id}/${news_easy_image_uri}`
          : news_web_image_uri,
        title,
        publishedAt,
        voiceId: news_easy_voice_uri?.split('.')[0],
        webUrl: news_web_url,
      }
    })
    nhk$.assign({ list: newsList, syncedAt: now })
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function fetchNewsArticle(id: string) {
  const res = await fetch(`https://www3.nhk.or.jp/news/easy/${id}/${id}.html`)
  const html = await res.text()
  const $ = cheerio.load(html)
  const body = $('#js-article-body').html()
  return body
}
