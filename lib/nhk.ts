import * as cheerio from 'cheerio/slim'
import { News, nhk$ } from '@/states/nhk'
import { XMLParser } from 'fast-xml-parser'

const threshold = 3 * 3600 * 1000 // 3 hours

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
})

interface Item {
  title: string
  link: string
  description: string
  pubDate: string
  guid: string
}

const imgRegExp = /<img src="([^"]+)"/
const audioRegExp = /<audio src="([^"]+)"/

export async function fetchNewsList() {
  const syncedAt = nhk$.syncedAt.get()

  const now = Date.now()
  if (now - syncedAt < threshold) {
    return
  }

  const res = await fetch('https://nhkeasier.com/feed/')
  const xml = await res.text()
  const data = parser.parse(xml)

  try {
    const list = data.rss.channel.item.slice(0, 50)
    const newsList = list.map((item: Item) => {
      const { title, link, description, pubDate, guid } = item
      const publishedAt = new Date(pubDate)
      const id = new URL(guid).pathname.split('/').at(-2)
      const imgMatches = description.match(imgRegExp)
      let image
      if (imgMatches) {
        image = new URL(imgMatches[1], 'https://nhkeasier.com').href
      }
      const audioMatches = description.match(audioRegExp)
      let audio
      if (audioMatches) {
        audio = new URL(audioMatches[1], 'https://nhkeasier.com').href
      }
      const audioIndex = description.indexOf('<audio')
      const html = audioIndex ? description.slice(0, audioIndex) : description
      return {
        id,
        html,
        image,
        title,
        publishedAt,
        audio,
        webUrl: link,
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
