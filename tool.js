const { runDouyin } = require('./core');
const fs = require('fs');
const request = require("request");
const list = [

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
  let realTitle = share_title.split(' ')[0]
  videoStream.pipe(fs.createWriteStream(`./download/${index}.${realTitle}(无水印).mp4`)); // 下载到本地

  if (index === 0) {
    downloadPic(avatar,`./download/${authorName}(头像).png`)
  }
  downloadPic(videoPoster,`./download/${index}.${share_title}(封面).png`)
}
list.forEach((item,index)=>{
  tool(item,index);
})
