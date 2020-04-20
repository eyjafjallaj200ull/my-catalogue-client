import {storeContext} from "./storeContext"
import {useContext} from "react"

const useStore = () => {
    const store = useContext(storeContext)
    if (!store) {
      // this is especially useful in TypeScript so you don't need to be checking for null all the time
      throw new Error('useStore must be used within a StoreProvider.')
    }
    return store
}
export default useStore