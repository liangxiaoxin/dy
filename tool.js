const { runDouyin } = require('./core');
const fs = require('fs');
const request = require("request");
const list = [
  'https://v.douyin.com/e1jt2X5/',
  'https://v.douyin.com/e1j9UtG/',
  'https://v.douyin.com/e1jmwM4/',
]
var downloadPic = function(src, dest){
  request(src).pipe(fs.createWriteStream(dest)).on('close',function(){
    console.log('pic saved!')
  })
}
async function tool(url,index) {
  const { videoStream, share_title,videoPoster,avatar,authorName } = await runDouyin(
    url
  );
  console.log('videoStream',videoStream)
  console.log('share_title',share_title)
  videoStream.pipe(fs.createWriteStream(`./download/${share_title}(无水印).mp4`)); // 下载到本地

  if (index === 0) {
    downloadPic(avatar,`./download/${authorName}(头像).png`)
  }
  downloadPic(videoPoster,`./download/${share_title}(封面).png`)
}
list.forEach((item,index)=>{
  tool(item,index);
})
