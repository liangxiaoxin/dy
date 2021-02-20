// import axios from 'axios';
const axios = require('axios');
const puppeteer = require('puppeteer');
const userAgent =
  'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Mobile Safari/537.36';
async function request(url, type) {
  const option = {
    url,
    method: 'get',
    headers: {
      'user-agent': userAgent,
    },
  };
  if (type) {
    option.responseType = type;
  }
  return axios(option);
}
async function runDouyin(shareUrl) {
  // 1.根据分享的视频地址，通过重定向获取整个html信息
  // 旧方法不行了，使用puppeteer进行爬虫拿到重定向后的地址
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })
  const page = await browser.newPage()
  await page.goto(shareUrl, {
    waitUntil: 'domcontentloaded'
  })
  let redirectUrl = page._target._targetInfo.url

  // 2.截取itemId， dytk 发起二次请求获取uriId
  let itemId = redirectUrl.split("/")[redirectUrl.split("/").length-2]
  const long_url = `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${itemId}`;
  const { data: videoJson } = await request(long_url);
  // 3.最后通过uri参数来调用视频下载接口
  const uriId = videoJson.item_list[0].video.play_addr.uri;
  const share_title = videoJson.item_list[0].share_info.share_title;
  const noWatermarkUrl = `https://aweme.snssdk.com/aweme/v1/play/?video_id=${uriId}&ratio=720p&line=0`;
  const { data: videoStream } = await request(noWatermarkUrl, 'stream');
  return { videoStream, share_title };
}

module.exports = {
  runDouyin,
};
