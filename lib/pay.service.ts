// /*
//  * @Description: 微信各种支付
//  * @Author: chtao
//  * @Email: victoryct@163.com
//  * @Github: https://github.com/LadyYang
//  * @Date: 2020-06-18 23:24:38
//  * @LastEditors: chtao
//  * @LastEditTime: 2020-07-29 07:31:01
//  * @FilePath: \zwdownload\server\wechat\lib\pay.service.ts
//  */

// import crypto from 'crypto';
// import Axios from 'axios';
// import { parseString } from 'xml2js';
// import { promisify } from 'util';

// const ps = promisify(parseString);

// import config from '../../config';

// export default class WxPay {
//   private static raw(args: {
//     [x: string]: any;
//     appid?: any;
//     attach?: any;
//     body?: any;
//     mch_id?: any;
//     nonce_str?: any;
//     notify_url?: any;
//     openid?: any;
//     out_trade_no?: any;
//     spbill_create_ip?: any;
//     total_fee?: any;
//     trade_type?: any;
//     appId?: any;
//     timeStamp?: any;
//     nonceStr?: any;
//     package?: any;
//     signType?: any;
//   }) {
//     let keys = Object.keys(args);
//     keys = keys.sort();
//     let newArgs: any = {};
//     keys.forEach(function (key) {
//       newArgs[key] = args[key];
//     });
//     let string = '';
//     for (let k in newArgs) {
//       string += '&' + k + '=' + newArgs[k];
//     }
//     string = string.substr(1);
//     return string;
//   }
//   // 签名
//   private static paysignjsapi(
//     attach: any,
//     body: any,
//     nonce_str: string,
//     openid: any,
//     out_trade_no: any,
//     total_fee: any,
//     trade_type: any
//   ) {
//     var ret = {
//       appid: config.appID,
//       attach: attach,
//       body: body,
//       mch_id: config.mch_id,
//       nonce_str: nonce_str,
//       notify_url: config.wx_notify_url,
//       openid: openid,
//       out_trade_no: out_trade_no,
//       spbill_create_ip: config.client_ip,
//       total_fee: total_fee,
//       trade_type: trade_type,
//     };
//     var string = this.raw(ret);

//     string = string + '&key=' + config.key;
//     var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
//     return sign.toUpperCase();
//   }
//   //签名加密算法,jsapi 第二次的签名
//   private static paysignjsapifinal(
//     appId: any,
//     timeStamp: any,
//     nonceStr: any,
//     package1: any,
//     signType: any
//   ) {
//     let ret = {
//       appId: appId,
//       timeStamp: timeStamp,
//       nonceStr: nonceStr,
//       package: package1,
//       signType: signType,
//     };
//     let string = this.raw(ret);
//     string = string + '&key=' + config.key;
//     let sign = crypto.createHash('md5').update(string, 'utf8').digest('hex');
//     return sign.toUpperCase();
//   }
//   // 随机字符串产生函数
//   private static createNonceStr() {
//     return Math.random().toString(36).substr(2, 30);
//   }
//   // 时间戳产生函数
//   private static createTimeStamp() {
//     return Math.floor(new Date().getTime() / 1000) + '';
//   }

//   private static getBookingNo() {
//     let date = new Date();
//     let year = date.getFullYear();
//     let month = date.getMonth() + 1;
//     let day = date.getDate();

//     return '' + year + month + day + Math.random().toString(10).substr(2, 30);
//   }
//   // 此处的attach不能为空值 否则微信提示签名错误
//   private static async order(
//     attach: string,
//     body: string,
//     openid: string,
//     bookingNo: string,
//     total_fee: number,
//     trade_type: string
//   ) {
//     let nonce_str = this.createNonceStr();
//     var timeStamp = this.createTimeStamp();
//     total_fee *= 100;
//     var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
//     var formData = '<xml>';
//     formData += '<appid>' + config.appID + '</appid>'; //appid
//     formData += '<mch_id>' + config.mch_id + '</mch_id>'; //商户号
//     formData += '<notify_url>' + config.wx_notify_url + '</notify_url>';
//     formData += '<spbill_create_ip>' + config.client_ip + '</spbill_create_ip>';
//     formData += '<attach>' + attach + '</attach>'; //附加数据
//     formData += '<body>' + body + '</body>';
//     formData += '<nonce_str>' + nonce_str + '</nonce_str>'; //随机字符串，不长于32位。
//     formData += '<openid>' + openid + '</openid>';
//     formData += '<out_trade_no>' + bookingNo + '</out_trade_no>';
//     formData += '<total_fee>' + total_fee + '</total_fee>';
//     formData += '<trade_type>' + trade_type + '</trade_type>'; // trade_type 作为参数传递 -- by maoxx
//     formData +=
//       '<sign>' +
//       this.paysignjsapi(
//         attach,
//         body,
//         nonce_str,
//         openid,
//         bookingNo,
//         total_fee,
//         trade_type
//       ) +
//       '</sign>';
//     formData += '</xml>';
//     try {
//       const result = (await Axios.post(url, formData)).data;

//       return await ps(result);
//     } catch (err) {
//       throw err;
//     }
//   }

//   static async createH5PayUrl(
//     payType: string,
//     num: string,
//     price: number,
//     openid: string
//   ) {
//     let attach = num + 'wxpay' + payType + 'wxpay' + openid;
//     let body = 'PaperCrazy论文检测';
//     let bookingNo = this.getBookingNo(); //订单号
//     let total_fee = price;
//     return await this.order(
//       attach,
//       body,
//       openid,
//       bookingNo,
//       total_fee,
//       'JSAPI'
//     );
//   }

//   static async createJsapiSign(
//     payType: string,
//     num: string,
//     price: number,
//     openid: string,
//     body: string = payType
//   ) {
//     let attach = num + 'wxpay' + payType + 'wxpay' + openid;
//     let bookingNo = this.getBookingNo(); //订单号
//     let total_fee = price;

//     const result: any = await this.order(
//       attach,
//       body,
//       openid,
//       bookingNo,
//       total_fee,
//       'JSAPI'
//     );

//     if (
//       result.xml.return_code[0] === 'SUCCESS' &&
//       result.xml.result_code[0] === 'SUCCESS'
//     ) {
//       // console.log('jsapi 返回成功: ', result.xml.prepay_id[0]);
//       let timeStamp = this.createTimeStamp();
//       let nonceStr = result.xml.nonce_str[0];
//       let _package = 'prepay_id=' + result.xml.prepay_id[0];
//       let signType = 'MD5';
//       let paySign = this.paysignjsapifinal(
//         config.appID,
//         timeStamp,
//         nonceStr,
//         _package,
//         signType
//       );
//       console.log('jsapi 二次签名：', paySign);
//       return {
//         appId: config.appID,
//         timestamp: timeStamp,
//         nonceStr: nonceStr,
//         package: _package,
//         signType: signType,
//         paySign: paySign,
//       };
//     } else {
//       return {
//         appId: config.appID,
//         timestamp: '',
//         nonceStr: '',
//         package: '',
//         signType: '',
//         paySign: '',
//       };
//     }
//   }
// }
