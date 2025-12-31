/**
 * Loading 工具：避免重复调用 hideLoading 导致的错误
 */
export const Loading = {
  _loadingCount: 0,

  // 显示加载
  show(options = {}) {
    this._loadingCount++
    if (this._loadingCount === 1) {
      uni.showLoading({
        title: '加载中...',
        mask: true,
        ...options
      })
    }
  },

  // 隐藏加载
  hide() {
    if (this._loadingCount > 0) {
      this._loadingCount--
      if (this._loadingCount === 0) {
        try {
          uni.hideLoading()
        } catch (e) {
          // 防止没有 loading 时调用 hideLoading 报错
          console.warn('hideLoading 警告:', e.message)
        }
      }
    }
  },

  // 重置计数器（异常情况下使用）
  reset() {
    this._loadingCount = 0
    try {
      uni.hideLoading()
    } catch (e) {
      console.warn('hideLoading 重置警告:', e.message)
    }
  }
}

// 兼容原有 API，方便迁移
export const showLoading = Loading.show.bind(Loading)
export const hideLoading = Loading.hide.bind(Loading)
