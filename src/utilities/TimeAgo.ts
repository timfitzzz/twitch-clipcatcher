import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

export class TimeAgoUtil {
  public static instance: TimeAgoUtil = new TimeAgoUtil()

  public timeAgo: TimeAgo;

  constructor() {
    TimeAgo.addDefaultLocale(en)
    this.timeAgo = new TimeAgo('en-US')
  }
}