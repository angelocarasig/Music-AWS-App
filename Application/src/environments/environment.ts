export const environment = {
  apiUrl: 'https://n3g36bf8s6.execute-api.us-east-1.amazonaws.com/api',
  login: {
    registerUser: '/login/register-user',
    loginUser: '/login/login-user',
  },
  music: {
    getMusic: '/music/get-music'
  },
  subscriptions: {
    getMusic: '/subscriptions/get-music',
    addMusic: '/subscriptions/add-music',
    deleteMusic: '/subscriptions/delete-music',
  }
};