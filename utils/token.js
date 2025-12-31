/**
 * Token 管理工具：适配微信小程序/APP/H5
 * 城小二校园外卖项目专用
 */
export const TokenManager = {
  // Token 存储的 key（自定义，避免冲突）
  TOKEN_KEY: 'cxr_token',
  USER_INFO_KEY: 'cxr_user_info',

  // 1. 存储 Token + 用户信息
  setToken(token, userInfo = {}) {
    uni.setStorageSync(this.TOKEN_KEY, token);
    uni.setStorageSync(this.USER_INFO_KEY, userInfo);
  },

  // 2. 获取 Token
  getToken() {
    return uni.getStorageSync(this.TOKEN_KEY) || '';
  },

  // 3. 获取用户信息
  getUserInfo() {
    return uni.getStorageSync(this.USER_INFO_KEY) || {};
  },

  // 4. 清除 Token + 用户信息（退出登录）
  clearToken() {
    uni.removeStorageSync(this.TOKEN_KEY);
    uni.removeStorageSync(this.USER_INFO_KEY);
  },

  // 5. 检查是否已登录（有 Token 即视为登录）
  isLogin() {
    return !!this.getToken();
  }
};