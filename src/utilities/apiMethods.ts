import { ApiClient } from "@twurple/api";
import { GetUserInfoPayload } from "../redux/actions";
import { TwitchClipV5 } from "../types";
import { helixClipToKraken } from "./parsers";

export const getClipMeta = async (clipSlug: string, apiClient: ApiClient): Promise<TwitchClipV5 | null> => {

  return await apiClient
    .clips.getClipById(clipSlug)
    .then((clip) => {
      // console.log('found clip: ', clip)
      return clip ? helixClipToKraken(clip) : null;
    });
};

export const getClipEpoch = async (vodId: string, offset: number, apiClient: ApiClient): Promise<number | null> => {
  // console.log('getting clip epoch for vodId', vodId, 'offset ', offset, ' using apiclient ', apiClient)
  // let accessToken = (await apiClient.getAccessToken())
  // if (accessToken) {
    return apiClient.videos.getVideoById(vodId).then(video => {
      return video ? video.creationDate.getTime() + offset * 1000 : 0
    })
    // return axios.get(`https://api.twitch.tv/helix/videos?id=${vodId}`, { 
    //   headers: {
    //     'Accept': 'application/json',
    //     'Authorization': `Bearer ${accessToken.accessToken}`,
    //     'Client-Id': process.env.REACT_APP_TWITCH_CLIENT_ID
    //   }
    // }).then(({data}) => {
    //   // console.log('got data:', data)
    //   if (data && data.data && data.data[0]) {
    //     return (new Date(data.data[0].created_at)).getTime() + offset * 1000
    //   } else {
    //     // console.log('couldnt determine start epoch, debug: ', data)
    //     return 0
    //   }
    // }).catch(err => {console.log(err); return 0})
  // } else {
  //   // console.log('couldnt get access token')
  //   return 0
  // }
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
    if (clipMeta && clipMeta.vod && clipMeta.vod.offset) {
      let epochReport = await getClipEpoch(clipMeta.vod.id, clipMeta.vod.offset, apiClient).then(epoch => {

        // console.log('got epoch: ', epoch, ' for clipslug ', clipSlug)
        return epoch ? {
          clipSlug,
          startEpoch: epoch
        } : {
          clipSlug,
          startEpoch: 0
        }
      }).catch((err) => { console.log(err); return { clipSlug, startEpoch: 0 }})
      // console.log('got epochreport, ', epochReport)
      return epochReport

    } else {
      return {
        clipSlug,
        startEpoch: 0
      }
    }
  }).catch((err) => { console.log(err); return { clipSlug, startEpoch: 0 }})

}

export const fetchUserInfo = async (userName: string, apiClient: ApiClient): Promise<GetUserInfoPayload | null> => {
  return apiClient.users.getUserByName(userName).then( async (userInfo) => {
      if (userInfo) {
        let followResponse = await userInfo.getFollows()
        let follows = followResponse.data.map(helixFollow => helixFollow.followedUserName)
        if (followResponse.cursor.length > 0) {
          follows = [];
          let request = apiClient.users.getFollowsPaginated({ user: userName });
          follows = (await request.getAll()).map(helixFollow => helixFollow.followedUserName);
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