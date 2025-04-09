export { }

declare global {
  export interface Window {
    /** Ant-design-vue message instance */
    $message?: import('ant-design-vue/es/message/interface').MessageInstance
    /** Ant-design-vue modal instance */
    $modal?: Omit<import('ant-design-vue/es/modal/confirm').ModalStaticFunctions, 'warn'>
    /** Ant-design-vue notification instance */
    $notification?: import('ant-design-vue/es/notification/interface').NotificationInstance
  }
}
