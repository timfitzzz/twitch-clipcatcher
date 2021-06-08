export class MessageCountStore {
  static instance: MessageCountStore = new MessageCountStore()

  public channelCounts: {
    [channelName: string]: number
  } = {}

  constructor() {
    
  }

  static getChannelCount(channelName: string): number {
    return MessageCountStore.instance.channelCounts[channelName] || 0
  }

  static incrementChannelCount(channelName: string, toAdd: number = 1): number {
    if (MessageCountStore.instance.channelCounts[channelName]) {
      MessageCountStore.instance.channelCounts[channelName] = MessageCountStore.instance.channelCounts[channelName] + toAdd
    } else {
      MessageCountStore.instance.channelCounts[channelName] = toAdd
    }
    return MessageCountStore.instance.channelCounts[channelName]
  }

  static resetChannelCount(channelName: string): void {
    MessageCountStore.instance.channelCounts[channelName] = 0
  }

}