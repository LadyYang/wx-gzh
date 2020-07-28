export async function responseText(xml: any, content: string, ctx: any) {
  ctx.body = `<xml>
  <ToUserName><![CDATA[${xml.FromUserName}]]></ToUserName>
  <FromUserName><![CDATA[${xml.ToUserName}]]></FromUserName>
  <CreateTime>${new Date().getTime()}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${content}]]></Content>
</xml>`;
}

export function responseImage(xml: any, media_id: string, ctx: any) {
  ctx.body =
    '<xml>' +
    '<ToUserName>' +
    '<![CDATA[' +
    xml.FromUserName +
    ']]>' +
    '</ToUserName>' +
    '<FromUserName>' +
    '<![CDATA[' +
    xml.ToUserName +
    ']]>' +
    '</FromUserName>' +
    '<CreateTime>' +
    new Date().getTime() +
    '</CreateTime>' +
    '<MsgType>' +
    '<![CDATA[image]]>' +
    '</MsgType>' +
    '<Image>' +
    '<MediaId>' +
    '<![CDATA[' +
    media_id +
    ']]>' +
    '</MediaId>' +
    '</Image>' +
    '</xml>';
}

export async function responseVoice(xml: any, media_id: string, ctx: any) {
  ctx.body = `<xml>
  <ToUserName><![CDATA[${xml.FromUserName}]]></ToUserName>
  <FromUserName><![CDATA[${xml.ToUserName}]]></FromUserName>
  <CreateTime>${new Date().getTime()}</CreateTime>
  <MsgType><![CDATA[voice]]></MsgType>
  <Voice>
    <MediaId><![CDATA[${media_id}]]></MediaId>
  </Voice>
</xml>`;
}

export function responseVideo(
  xml: any,
  media_id: string,
  title: string,
  description: string,
  ctx: any
) {
  ctx.body = `<xml>
<ToUserName><![CDATA[${xml.FromUserName}]]></ToUserName>
<FromUserName><![CDATA[${xml.ToUserName}]]></FromUserName>
<CreateTime>${new Date().getTime()}</CreateTime>
<MsgType><![CDATA[video]]></MsgType>
<Video>
  <MediaId><![CDATA[${media_id}]]></MediaId>
  <Title><![CDATA[${title}]]></Title>
  <Description><![CDATA[${description}]]></Description>
</Video>
</xml>`;
}

// export async function responseMusic(xml: any, ctx: any,  payloads: {},) {
//   ctx.body = `<xml>
//   <ToUserName><![CDATA[${xml.FromUserName}]]></ToUserName>
//   <FromUserName><![CDATA[${xml.ToUserName}]]></FromUserName>
//   <CreateTime>${new Date().getTime()}</CreateTime>
//   <MsgType><![CDATA[music]]></MsgType>
//   <Music>
//     <Title><![CDATA[${title}]]></Title>
//     <Description><![CDATA[${description}]]></Description>
//     <MusicUrl><![CDATA[${url}]]></MusicUrl>
//     <HQMusicUrl><![CDATA[HQ_MUSIC_Url]]></HQMusicUrl>
//     <ThumbMediaId><![CDATA[media_id]]></ThumbMediaId>
// </Music>
// </xml>`;
// }

// export function responseNews(
//   xml: any,
//   media_id: string,
//   title: string,
//   description: string,
//   ctx: any
// ) {
//   ctx.body = `<xml>
// <ToUserName><![CDATA[${xml.FromUserName}]]></ToUserName>
// <FromUserName><![CDATA[${xml.ToUserName}]]></FromUserName>
// <CreateTime>${new Date().getTime()}</CreateTime>
// <MsgType><![CDATA[video]]></MsgType>
// <Video>
//   <MediaId><![CDATA[${media_id}]]></MediaId>
//   <Title><![CDATA[${title}]]></Title>
//   <Description><![CDATA[${description}]]></Description>
// </Video>
// </xml>`;
// }
