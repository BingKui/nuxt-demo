// 页面跳转方法
export const RedirectTo = (path, param = {}) => {
  let query = '';
  for (let key in param) {
    query += `${key}=${param[key]}&`;
  }
  window.location.href = `${path}${query ? '?' + query : ''}`
}

// 浏览器返回方法
export const NavigateBack = () => {
  window.history.go(-1);
}

// 浏览器前进方法，可以设置步骤，默认为 1
export const NavigateForward = (num = 1) => {
  window.history(num);
}

export const GetUrlParam = (name) => {
  let search = window.location.search;
  search = search.substring(1, search.length)
  const arr = search.split('&');
  let result = '';
  for (let i = 0; i < arr.length; i++) {
    const _name = arr[i].split('=')[0];
    if (_name === name) {
      result = arr[i].split('=')[1];
      break;
    }
  }
  return result;
}
