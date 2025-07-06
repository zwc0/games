/**
  @typedef DisplayNotificationParams
  @property {string} title
  @property {NotificationOptions} options
*/

/**
  @typedef ModuleActions
  @property {Promise<(params: DisplayNotificationParams)=>void>} displayNotification
*/

/**
  @typedef ModuleConstructor
  @property {HTMLElement} container
  @property {ModuleActions} actions
*/

/**
  @typedef ModuleReturn
  @property {Promise<()=>void>|()=>void} start
  @property {Promise<()=>void>|()=>void} dispose
*/
