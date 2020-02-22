import { API_URL } from './config'

export default {
    refresh: () => {
        const authToken = localStorage.getItem('authToken')
    
        return fetch(`${API_URL}/refresh`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
          credentials: 'include'
        })
        .then(res => res.json())
    },

    logout: () => {
        const authToken = localStorage.getItem('authToken')
    
        return fetch(`${API_URL}/logout`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          },
          credentials: 'include'
        })
          .then(res => res.ok)
    }
}