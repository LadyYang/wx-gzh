import Observe from './lib/Observe';

export interface BaseEvent {
  ToUserName: string;
  FromUserName: string;
  CreateTime: number;

  MsgType: string;
}

/**
 * 微信文本消息请求
 */
export interface TextEvent extends BaseEvent {
  Content: string;

  MsgType: 'text';
}

interface MediaEvent extends BaseEvent {
  /** 消息媒体id，可以调用获取临时素材接口拉取数据。 */
  MediaId: string;

  /** 消息id，64位整型 */
  MsgId: number;
}

interface ImageEvent extends MediaEvent {
  /** 图片链接（由系统生成） */
  PicUrl: string;

  MsgType: 'image';
}

interface VoiceEvent extends MediaEvent {
  /** 语音格式，如amr，speex等 */
  Format: string;

  /** 语音识别结果，UTF8编码 */
  Recognition?: string;

  MsgType: 'voice';
}

interface VideoEvent extends MediaEvent {
  /** 视频消息缩略图的媒体id，可以调用多媒体文件下载接口拉取数据。 */
  ThumbMediaId: string;

  MsgType: 'video';
}

interface ShortVideoEvent extends Exclude<{ MsgType: string }, VideoEvent> {
  MsgType: 'shortvideo';
}

interface LocationEvent extends MediaEvent {
  Location_X: string;
  Location_Y: string;

  /** 地图缩放大小 */
  Scale: string;

  /** 地理位置信息 */
  Label: string;

  MsgType: 'location';
}

interface LinkEvent extends BaseEvent {
  Title: string;
  Description: string;
  Url: string;

  MsgType: 'link';
}

/** 推送事件类型 */
interface PushEvent extends BaseEvent {
  MsgType: 'event';
  Event: string;
}

/**
 * 微信自定义菜单事件请求
 */
export interface MenuEvent extends PushEvent {
  Event: 'VIEW' | 'CLICK';

  /** 事件KEY值，是自定义菜单接口中KEY值对应 或者 是设置的跳转URL */
  EventKey: string;
}

interface SubscribeEvent extends PushEvent {
  Event: 'subscribe';

  /** 有值 说明是扫二维码进来的。 事件KEY值，qrscene_为前缀，后面为二维码的参数值 */
  EventKey?: string;

  /** 有值 说明是扫二维码进来的。二维码的ticket，可用来换取二维码图片 */
  Ticket?: string;
}

interface UnsubscribeEvent extends PushEvent {
  Event: 'unsubscribe';
}

interface ScanEvent extends PushEvent {
  Event: 'SCAN';

  /** 事件KEY值，是一个32位无符号整数，即创建二维码时的二维码scene_id */
  EventKey: string;

  /** 二维码的ticket，可用来换取二维码图片 */
  Ticket: string;
}

interface PostLocationEvent extends PushEvent {
  Event: 'LOCATION';

  /** 地理位置纬度 */
  Latitude: string;

  /** 地理位置经度 */
  Longitude: string;

  /** 地理位置精度 */
  Precision: string;
}

interface PaySuccessEvent {
  return_code: 'SUCCESS' | 'FAIL';
  return_msg?: string;

  /** 小程序ID */
  appid: string;

  /** 商户号 */
  mch_id: string;

  /** 设备号	 */
  device_info: string;

  /** 随机字符串 */
  nonce_str: string;

  sign: string;

  /** 签名类型 */
  sign_type?: string;

  result_code: 'SUCCESS' | 'FAIL';

  err_code?: string;
  err_code_des?: string;

  openid: string;

  is_subscribe: string;

  /** 交易类型 */
  trade_type: string;
  bank_type: string;
  total_fee: number;

  /** 应结订单金额 */
  settlement_total_fee?: number;

  fee_type?: string;

  /** 现金支付金额 */
  cash_fee: string;

  /** 现金支付货币类型 */
  cash_fee_type?: string;

  transaction_id: string;

  out_trade_no: string;

  attach?: string;

  time_end: string;
}

export interface WeChatEvent {
  /** 文本信息 */
  text: (event: TextEvent) => Promise<string>;

  image: (event: ImageEvent) => Promise<string>;

  voice: (event: VoiceEvent) => Promise<string>;

  video: (event: VideoEvent) => Promise<string>;

  location: (event: LocationEvent) => Promise<string>;

  postLocation: (
    event: PostLocationEvent,
    ctx: { body: any }
  ) => Promise<string>;

  link: (event: LinkEvent) => Promise<string>;

  /** 扫码 */
  scan: (event: ScanEvent) => Promise<string>;

  subscribe: (event: SubscribeEvent) => Promise<string>;

  unsubscribe: (event: UnsubscribeEvent) => Promise<string>;

  /** 点击菜单拉取消息时的事件推送 */
  click: (event: MenuEvent) => Promise<string>;

  /** 点击菜单跳转链接时的事件推送 */
  view: (event: MenuEvent) => Promise<string>;

  /** token is ok */
  ready: (token: string) => Promise<void>;

  unknow: (event: MenuEvent) => Promise<string>;

  paySuccess: (event: PaySuccessEvent) => Promise<void>;

  payFail: () => Promise<void>;
}
