export class MessageCountStore {
  static instance: MessageCountStore = new MessageCountStore()

  public incrementCallbacks: {
    [channelName: string]: (count: number) => void
  } = {}

  public channelCounts: {
    [channelName: string]: number
  } = {}

  static getChannelCount(channelName: string): number {
    return MessageCountStore.instance.channelCounts[channelName] || 0
  }

  static getChannelCounts(): { [channelName: string]: number } {
    return MessageCountStore.instance.channelCounts
  }

  static incrementChannelCount(channelName: string, toAdd: number = 1): number {
    if (MessageCountStore.instance.channelCounts[channelName]) {
      MessageCountStore.instance.channelCounts[channelName] = MessageCountStore.instance.channelCounts[channelName] + toAdd
    } else {
      MessageCountStore.instance.channelCounts[channelName] = toAdd
    }
    MessageCountStore.instance.incrementCallbacks[channelName] && MessageCountStore.instance.incrementCallbacks[channelName](MessageCountStore.instance.channelCounts[channelName])
    return MessageCountStore.instance.channelCounts[channelName]
  }

  static resetChannelCount(channelName: string): void {
    MessageCountStore.instance.channelCounts[channelName] = 0
  }

  static registerCallback(channelName: string, callback: (count: number) => void) {
    MessageCountStore.instance.incrementCallbacks[channelName] = callback
  }

  static clearCallback(channelName: string) {
    delete MessageCountStore.instance.incrementCallbacks[channelName]
  }

}