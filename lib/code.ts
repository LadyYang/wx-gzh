/*
 * @Description: 生成二维码图片
 * @Author: chtao
 * @Email: 1763615252@qq.com
 * @Date: 2020-07-26 19:22:26
 * @LastEditTime: 2020-07-27 23:29:23
 * @LastEditors: chtao
 * @FilePath: \zwdownload\server\wechat\lib\code.ts
 */

import { v4 as uuid } from 'uuid';
import Axios from 'axios';
import WeChat from '..';

/**
 * 生成带参数的临时二维码图片
 * @param accessToken token
 * @param time 过期时间  默认为最大值 2592000(s) 30 天
 */
export async function getQRCode(this: WeChat, time: number = 2592000) {
  try {
    const scene_id =
      uuid().split('-').join('') + Math.random().toString(36).substr(2, 10);

    const data = {
      expire_seconds: time,
      action_name: 'QR_STR_SCENE',
      action_info: { scene: { scene_str: scene_id } },
    };

    const content = JSON.stringify(data);

    const result = (
      await Axios.post(
        `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${this.token}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': content.length,
          },
        }
      )
    ).data;

    return {
      url:
        'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' +
        result.ticket +
        '&t=' +
        new Date().getTime(),
      scene_id,
    };
  } catch (err) {
    throw err;
  }
}
