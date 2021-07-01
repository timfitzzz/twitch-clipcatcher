import { ApiClient, HelixUser, TwitchApiCallType } from "twitch/lib";
import { TwitchClipV5 } from "../types";
import PromiseThrottle from 'promise-throttle'

export const getClipMeta = async (clipSlug: string, apiClient: ApiClient): Promise<TwitchClipV5> => {
  return apiClient
    .callApi({
      type: TwitchApiCallType.Kraken,
      url: `/clips/${clipSlug}`,
    })
    .then((clip) => {
      return clip; 
    });
};

export const getClipEpoch = async (vodId: string, offset: number, apiClient: ApiClient): Promise<number | null> => {
  return apiClient.helix.videos.getVideoById(vodId).then((video) => {
    if (video) {
      return video.creationDate.getTime() + offset
    } else {
      return null
    }
  })
}


// updateClipsViews: split list of clips into groups of 100 and update their view counts from the helix api.

export interface UpdatedClipViews {
  slug: string
  views: number
}

export const updateClipsViews = async (clipSlugs: string[], apiClient: ApiClient): Promise<UpdatedClipViews[] | void> => {

  // generate sets of 100
  let clipSets: string[][] = []

  while (clipSlugs.length > 100) {
    clipSets.push(clipSlugs.splice(0, 100))
  }
  clipSets.push(clipSlugs)

  return Promise.all(clipSets.map(clipSet => apiClient.helix.clips.getClipsByIds(clipSet)))
                .then(clipSets => {
                  let results: UpdatedClipViews[] = []
                  clipSets.forEach(clipSet => clipSet.forEach(clip => results.push({slug: clip.id, views: clip.views})))
                })
}

// retryClipEpoch: try again to get vod and calculate start time

export interface UpdatedClipEpoch {
  clipSlug: string,
  startEpoch: number
}

export const retryClipEpoch = async (clipSlug: string, apiClient: ApiClient): Promise<UpdatedClipEpoch> => {

  return getClipMeta(clipSlug, apiClient).then(clipMeta => {
    if (clipMeta.vod) {
      return getClipEpoch(clipMeta.vod.id, clipMeta.vod.offset, apiClient).then(epoch => epoch ? {
        clipSlug,
        startEpoch: epoch
      } : {
        clipSlug,
        startEpoch: 0
      } )
    } else {
      return {
        clipSlug,
        startEpoch: 0
      }
    }
  })

}

export const retryClipEpochs = async (clipSlugs: string[], apiClient: ApiClient): Promise<UpdatedClipEpoch[]> => {

  let promises: Promise<UpdatedClipEpoch>[] = []
  let promiseThrottle = new PromiseThrottle({
    requestsPerSecond: 1
  })

  for (let i = 0; i < clipSlugs.length; i++) {
    promises.push(promiseThrottle.add(() => retryClipEpoch(clipSlugs[i], apiClient)))
  }

  return Promise.all(promises)
}

export const fetchUserInfo = async (userName: string, apiClient: ApiClient): Promise<HelixUser | null> => {
  return apiClient.helix.users.getUserByName(userName)
}