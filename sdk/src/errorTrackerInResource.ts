import {
    ERROR_LEVEL
  } from './constant/index'
  import { ERROR_TYPE } from './constant'
  import { sendData } from './send'
  import { getFlag, setFlag, getLocationHref } from './utils/util'
  
  class ErrorTrackerInResource {
    static instance: null | ErrorTrackerInResource
    oldErrorHandler: OnErrorEventHandlerNonNull
    constructor() {
      this.oldErrorHandler = null
    }
  
    static getInstance() {
      if (!ErrorTrackerInResource.instance) {
        ErrorTrackerInResource.instance = new ErrorTrackerInResource()
      }
      return ErrorTrackerInResource.instance
    }
    install() {
    if (getFlag('watchResource')) {
        return
    }
    setFlag('watchResource', true)
    if (window.addEventListener) {
        window.addEventListener('error', this.traceGlobalResource, true)
    }
    
    }
    traceGlobalResource(e: any) {
      if (e.target.localName) {
        const error = {
          type: ERROR_TYPE.RESOURCE_ERROR,
          outerHTML: e.target.outerHTML,
          tagName: e.target.localName,
          url: getLocationHref(),
          src: e.target.href || e.target.src,
          level: ERROR_LEVEL.LOW,
          time: Date.now(),
          timeStamp: e.timeStamp,
          name: e.type
        }
      sendData(error)
      }
        
    }
    
  }
  
  export default ErrorTrackerInResource.getInstance()
  