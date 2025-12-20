import fs from 'fs/promises'
import { XMLParser } from 'fast-xml-parser'

const xml = await fs.readFile('nhk.xml', 'utf8')

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
})
const data = parser.parse(xml)
console.log('- data', data)
// console.log('- items', data.rss.channel.item)
console.log('- items', data.rss.channel.item[0])

export interface Item {
  title: string
  link: string
  description: string
  pubDate: string
  guid: string
}

let item0 = {
  title: '日本銀行が利子を0.75%に上げると決めた',
  link: 'https://nhkeasier.com/story/9260/',
  description:
    '<img src="/media/jpg/ne2025121912444.jpg" alt="Story illustration">\n                    <p><ruby>日本銀行<rt>にっぽんぎんこう</rt></ruby>は、19<ruby>日<rt>にち</rt></ruby>、<ruby>利子<rt>りし</rt></ruby>を0.75％ぐらいに<ruby>上<rt>あ</rt></ruby>げると<ruby>決<rt>き</rt></ruby>めました。</p>\n<p><ruby>日本<rt>にっぽん</rt></ruby>では、<ruby>長<rt>なが</rt></ruby>い<ruby>間<rt>あいだ</rt></ruby>、<ruby>利子<rt>りし</rt></ruby>がとても<ruby>低<rt>ひく</rt></ruby>くなっていました。</p>\n<p>しかし、<ruby>今年<rt>ことし</rt></ruby>1<ruby>月<rt>がつ</rt></ruby>、0.5％に<ruby>上<rt>あ</rt></ruby>げていて、0.75％になると、30<ruby>年<rt>ねん</rt></ruby><ruby>前<rt>まえ</rt></ruby>と<ruby>同<rt>おな</rt></ruby>じぐらいです。</p>\n<p><ruby>日本銀行<rt>にっぽんぎんこう</rt></ruby>の<ruby>植田<rt>うえだ</rt></ruby><ruby>総裁<rt>そうさい</rt></ruby>は「<ruby>利子<rt>りし</rt></ruby>を<ruby>上<rt>あ</rt></ruby>げても<ruby>働<rt>はたら</rt></ruby>く<ruby>人<rt>ひと</rt></ruby>の<ruby>給料<rt>きゅうりょう</rt></ruby>が<ruby>上<rt>あ</rt></ruby>がる<ruby>可能性<rt>かの うせい</rt></ruby>が<ruby>高<rt>たか</rt></ruby>いと<ruby>考<rt>かんが</rt></ruby>えています。これからも<ruby>利子<rt>りし</rt></ruby>を<ruby>上<rt>あ</rt></ruby>げるかどうかは、<ruby>物<rt>もの</rt></ruby>の<ruby>値段<rt>ねだん</rt></ruby>や<ruby>日本<rt>にっぽん</rt></ruby>の<ruby>経済<rt>けいざい</rt></ruby>の<ruby>様子<rt>ようす</rt></ruby>を<ruby>見<rt>み</rt></ruby>て<ruby>決<rt>き</rt></ruby>めたいと<ruby>思<rt>おも</rt></ruby>います」と<ruby>話<rt>はな</rt></ruby>しました。</p>\n<p><ruby>私<rt>わた し</rt></ruby>たちが、<ruby>銀行<rt>ぎんこう</rt></ruby>から、お<ruby>金<rt>かね</rt></ruby>を<ruby>借<rt>か</rt></ruby>りるときや<ruby>預<rt>あず</rt></ruby>けるときの<ruby>利子<rt>りし</rt></ruby>も<ruby>上<rt>あ</rt></ruby>がりそうです。</p>\n                    <audio src="/media/mp3/ne2025121912444.mp3" controls preload="none"></audio>\n                <ul>\n                        <li><a href="https://www3.nhk.or.jp/news/easy/ne2025121912444/ne2025121912444.html">Original</a></li>\n                    <li><a href="/story/9260/" class="permalink">Permalink</a></li>\n                </ul>',
  pubDate: 'Fri, 19 Dec 2025 19:30:00 +0900',
  guid: 'https://nhkeasier.com/story/9260/',
}
