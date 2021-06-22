import { ApiClient, TwitchApiCallType } from "twitch/lib";
import { TwitchClipV5 } from "../types";

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
      return video.creationDate.getUTCMilliseconds() + offset
    } else {
      return null
    }
  })
}