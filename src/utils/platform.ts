/**
 * @description 是否是浙里办的环境
 * @returns {Boolean}
 */
export function isZhelibanClient() {
  return !!navigator.userAgent.toLocaleLowerCase().match('dtdreamweb');
}

// 是否是浙里办的微信环境
export function isZLBWx() {
  return (
    window.navigator.userAgent.toLowerCase().includes('miniprogram/wx') ||
    (window as any).__wxjs_environment === 'miniprogram'
  );
}

// 是否为浙政钉环境
export const isZZDing = () => {
  return JSON.stringify(navigator.userAgent).includes('TaurusApp');
};

/**
 * @desc 如果是支付宝容器不支持用户身份(海外)，则认为支付宝容器降级为普通容器
 */
export function isInAlipayClient() {
  if ((window as any).alipayJump2H5Client) {
    return false;
  } else {
    return !!navigator.userAgent.toLocaleLowerCase().match('alipay');
  }
}

export function isInAlipayMiniProgram() {
  const userAgent = navigator.userAgent.toLocaleLowerCase();
  return !!(userAgent.match('alipay') && userAgent.match('miniprogram'));
}

export function browserInfo() {
  const u = navigator.userAgent;
  return {
    // 移动终端浏览器版本信息
    isQQ: !!u.match(/QQ/i), // 是否是QQ内打开
    isWechat: !!u.match(/MicroMessenger/i), // 是否是微信内打开
    isDing: !!u.match(/ding\s?talk/i), // 是否是钉钉内打开
    isAlipay: !!u.match(/AliApp\s?talk/i), // 是否是钉钉内打开
  } as { [key: string]: boolean };
}

export function isInBrowser() {
  const u = navigator.userAgent;
  const platform = {
    // 移动终端浏览器版本信息
    isQQ: !!u.match(/QQ/i), // 是否是QQ内打开
    isWechat: !!u.match(/MicroMessenger/i), // 是否是微信内打开
    isDing: !!u.match(/ding\s?talk/i), // 是否是钉钉内打开
    isAlipay: !!u.match(/AliApp\s?talk/i), // 是否是钉钉内打开
  } as { [key: string]: boolean };

  let result = true;

  Object.keys(platform).forEach((key: string) => {
    if (!result) return;

    result = !platform[key];
  });

  return result;
}

// h5的环境
export function isInH5Client() {
  return !isZhelibanClient() && !isInAlipayClient();
}
