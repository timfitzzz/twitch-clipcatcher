import { ApiClient, HelixFollowData, HelixPaginatedResponseWithTotal, TwitchApiCallType } from "twitch/lib";
import { GetUserInfoPayload } from "../redux/actions";
import { TwitchClipV5 } from "../types";

export const getClipMeta = async (clipSlug: string, apiClient: ApiClient): Promise<TwitchClipV5> => {
  return await apiClient
    .callApi({
      type: TwitchApiCallType.Kraken,
      url: `/clips/${clipSlug}`,
    })
    .then((clip) => {
      // console.log('found clip: ', clip)
      return clip; 
    });
};

export const getClipEpoch = async (vodId: string, offset: number, apiClient: ApiClient): Promise<number | null> => {
  // console.log('getting clip epoch for vodId', vodId, 'offset ', offset, ' using apiclient ', apiClient)
  let epoch = apiClient.callApi({ type: TwitchApiCallType.Helix, url: `/videos?id=${vodId}`}).then(({data}) => {
    if (data && data[0]) {
      return (new Date(data[0].created_at)).getTime() + offset * 1000
    } else {
      return null
    }
  }).catch(err => {console.log(err); return null})
  return epoch
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

  return clipSets && clipSets.length > 0 ? await Promise.all(clipSets.map(clipSet => apiClient.helix.clips.getClipsByIds(clipSet)))
                .then(responseClipSets => {
                  let results: UpdatedClipViews[] = []
                  responseClipSets.forEach((clipSet,i) => {
                    console.log('missing count for clip set ', i, ': ', clipSets[i].length - responseClipSets.length )
                    clipSet.forEach(clip => results.push({slug: clip.id, views: clip.views}))
                  })
                  return results
                }) : []
}

// retryClipEpoch: try again to get vod and calculate start time

export interface UpdatedClipEpoch {
  clipSlug: string,
  startEpoch: number
}

export const retryClipEpoch = async (clipSlug: string, apiClient: ApiClient): Promise<UpdatedClipEpoch> => {

  return await getClipMeta(clipSlug, apiClient).then(async (clipMeta) => {
    // console.log('got clipMeta ', clipMeta)
    if (clipMeta.vod) {
      // console.log(clipMeta.vod)
      let epochReport = await getClipEpoch(clipMeta.vod.id, clipMeta.vod.offset, apiClient).then(epoch => {

        // console.log('got epoch: ', epoch, ' for clipslug ', clipSlug)
        return epoch ? {
          clipSlug,
          startEpoch: epoch
        } : {
          clipSlug,
          startEpoch: 0
        }
      })
      // console.log('got epochreport, ', epochReport)
      return epochReport

    } else {
      return {
        clipSlug,
        startEpoch: 0
      }
    }
  })

}

export const fetchUserInfo = async (userName: string, apiClient: ApiClient): Promise<GetUserInfoPayload | null> => {
  return apiClient.helix.users.getUserByName(userName).then( async (userInfo) => {
      if (userInfo) {
        let followResponse = await userInfo.getFollows()
        let follows = followResponse.data.map(helixFollow => helixFollow.followedUserName)
        let timeout = false
        setTimeout(() => {
          timeout = true
        }, 3000)
        if (followResponse.cursor.length > 0) {
          do {
            await apiClient.callApi<HelixPaginatedResponseWithTotal<HelixFollowData>>({ 
              type: TwitchApiCallType.Helix, 
              url: `/users/follows?from_id=${userInfo.id}&after=${followResponse.cursor}&first=100`
            /* eslint-disable-next-line no-loop-func */ // eslint doesn't like this, but i'm ok with it.
            }).then((data) => {
              follows = follows.concat(data.data.map(helixFollow => helixFollow.to_name))
              followResponse.cursor = data.pagination ? data.pagination.cursor : ""
            })
          } while (followResponse.cursor && !timeout)
        }
        return { 
          name: userInfo.name, 
          profilePictureUrl: userInfo.profilePictureUrl,
          follows
        }
      } else {
        return null
      }
      
    }).catch(err => {console.log(err); return null})
}