import React from "react";
import { observer } from "mobx-react"
import {storeContext} from "../../utils/storeContext"
import useStore from "../../utils/useStore"

const SessionExpired = () => {
    return <div className="text-center session-expired mb-3">Your session has expired. To continue to access your Google Books data, please log out and sign in again.</div>
}

export default SessionExpired;