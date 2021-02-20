const { runDouyin } = require('./core');
const fs = require('fs');
const list = [
  'https://v.douyin.com/JofAHe7/',
]
async function tool(url) {
  const { videoStream, share_title } = await runDouyin(
    url
  );
  console.log('share_title',share_title)
  videoStream.pipe(fs.createWriteStream(`${share_title}(无水印).mp4`)); // 下载到本地
}
list.forEach((item)=>{
  tool(item);
})
