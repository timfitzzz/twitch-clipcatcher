//  // demo data for generating example visuals

// import { defaultFilters, defaultSort, ICatcherChannel } from "../types";
// import { AnnotationsSliceState } from "./annotations";
// import { ClipsSliceState } from "./clips";
// import { MessagesSliceState } from "./messages";
// import { UsersSliceState } from "./users";

// export const channelsDemoData: ICatcherChannel = { 
//   name: 'clipstime',
//   scanning: false,
//   holdUpdates: false,
//   clips: [
//     'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS',
//     'NiceRockySharkWTRuck-wGevnXNX5XPj6ilU',
//     'FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7',
//   ],
//   sort: defaultSort,
//   filters: defaultFilters,
//   postersByClip: {
//     'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS': [
//       'zaqariscott7'
//     ],
//     'NiceRockySharkWTRuck-wGevnXNX5XPj6ilU': [
//       'emjayultra'
//     ],
//     'FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7': [
//       'itssaber_',
//       'seanlai01'
//     ],
//   },
//   stackClips: true,
//   error: null
// }

// export const clipsDemoData: Partial<ClipsSliceState> = {
//   clips: {
//     'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS': {
//       slug: 'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS',
//       tracking_id: '1263395950',
//       url: 'https://clips.twitch.tv/HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS?tt_medium=clips_api&tt_content=url',
//       embed_url: 'https://clips.twitch.tv/embed?clip=HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS&tt_medium=clips_api&tt_content=embed',
//       embed_html: '<iframe src=\'https://clips.twitch.tv/embed?clip=HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS&tt_medium=clips_api&tt_content=embed\' width=\'640\' height=\'360\' frameborder=\'0\' scrolling=\'no\' allowfullscreen=\'true\'></iframe>',
//       broadcaster: {
//         id: '71092938',
//         name: 'xqcow',
//         display_name: 'xQcOW',
//         channel_url: 'https://www.twitch.tv/xqcow',
//         logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/xqcow-profile_image-9298dca608632101-300x300.jpeg'
//       },
//       curator: {
//         id: '526232159',
//         name: 'zaqariscott7',
//         display_name: 'zaqariscott7',
//         channel_url: 'https://www.twitch.tv/zaqariscott7',
//         logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/a9032e60-b6e8-4b74-8bc4-a5784c3edb36-profile_image-150x150.png'
//       },
//       vod: {
//         id: '1095397423',
//         url: 'https://www.twitch.tv/videos/1095397423?t=3h28m38s',
//         offset: 12518,
//         preview_image_url: ''
//       },
//       broadcast_id: '42955417821',
//       game: 'Grand Theft Auto V',
//       language: 'en',
//       title: 'POGGERS BOBCAT AND CRACKING TOOL',
//       views: 200,
//       duration: 33.2,
//       created_at: '2021-07-23T09:43:17Z',
//       thumbnails: {
//         medium: 'https://clips-media-assets2.twitch.tv/AT-cm%7C1263395950-preview-480x272.jpg',
//         small: 'https://clips-media-assets2.twitch.tv/AT-cm%7C1263395950-preview-260x147.jpg',
//         tiny: 'https://clips-media-assets2.twitch.tv/AT-cm%7C1263395950-preview-86x45.jpg'
//       },
//       startEpoch: 1627033342000,
//       firstSeenAnnotation: '62ae7b58-e012-4d7c-a574-82e0dedc4bd3',
//       broadcasterName: 'xqcow',
//       postedBy: {
//         clipstime: [
//           'zaqariscott7'
//         ]
//       },
//       votes: {
//         clipstime: {
//           up: [
//             'zaqariscott7'
//           ],
//           down: []
//         }
//       },
//       taggedIn: {
//         clipstime: {
//           as: {
//             tags: [
//               'weirdchamp'
//             ],
//             byTag: {
//               weirdchamp: [
//                 'astralhollow'
//               ]
//             }
//           }
//         }
//       },
//       metaedIn: {
//         clipstime: {
//           by: [
//             'astralhollow'
//           ]
//         }
//       },
//       dramaedIn: {}
//     },
//     'NiceRockySharkWTRuck-wGevnXNX5XPj6ilU': {
//       slug: 'NiceRockySharkWTRuck-wGevnXNX5XPj6ilU',
//       tracking_id: '1262991166',
//       url: 'https://clips.twitch.tv/NiceRockySharkWTRuck-wGevnXNX5XPj6ilU?tt_medium=clips_api&tt_content=url',
//       embed_url: 'https://clips.twitch.tv/embed?clip=NiceRockySharkWTRuck-wGevnXNX5XPj6ilU&tt_medium=clips_api&tt_content=embed',
//       embed_html: '<iframe src=\'https://clips.twitch.tv/embed?clip=NiceRockySharkWTRuck-wGevnXNX5XPj6ilU&tt_medium=clips_api&tt_content=embed\' width=\'640\' height=\'360\' frameborder=\'0\' scrolling=\'no\' allowfullscreen=\'true\'></iframe>',
//       broadcaster: {
//         id: '95873995',
//         name: 'ramee',
//         display_name: 'Ramee',
//         channel_url: 'https://www.twitch.tv/ramee',
//         logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/852b713a-dd69-4a15-9edb-384b8edd3d2d-profile_image-300x300.png'
//       },
//       curator: {
//         id: '149767209',
//         name: 'emjayultra',
//         display_name: 'emjayultra',
//         channel_url: 'https://www.twitch.tv/emjayultra',
//         logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/4b0b1faa-4c47-4e61-90d9-64cfae4a745d-profile_image-150x150.png'
//       },
//       vod: {
//         id: '1094837107',
//         url: 'https://www.twitch.tv/videos/1094837107?t=4h49m31s',
//         offset: 17371,
//         preview_image_url: 'https://clips-media-assets2.twitch.tv/AT-cm%7C1262991166-preview.jpg'
//       },
//       broadcast_id: '42719903452',
//       game: 'Grand Theft Auto V',
//       language: 'en',
//       title: 'sticks the landing',
//       views: 1,
//       duration: 17.85,
//       created_at: '2021-07-23T00:14:44Z',
//       thumbnails: {
//         medium: 'https://clips-media-assets2.twitch.tv/AT-cm%7C1262991166-preview-480x272.jpg',
//         small: 'https://clips-media-assets2.twitch.tv/AT-cm%7C1262991166-preview-260x147.jpg',
//         tiny: 'https://clips-media-assets2.twitch.tv/AT-cm%7C1262991166-preview-86x45.jpg'
//       },
//       startEpoch: 1626999242000,
//       firstSeenAnnotation: 'bc260aed-7276-4db3-8c89-962473eb3fae',
//       broadcasterName: 'ramee',
//       postedBy: {
//         clipstime: [
//           'emjayultra'
//         ]
//       },
//       votes: {
//         clipstime: {
//           up: [
//             'emjayultra'
//           ],
//           down: []
//         }
//       }
//     },
//     'FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7': {
//       slug: 'FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7',
//       tracking_id: '1250331362',
//       url: 'https://clips.twitch.tv/FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7?tt_medium=clips_api&tt_content=url',
//       embed_url: 'https://clips.twitch.tv/embed?clip=FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7&tt_medium=clips_api&tt_content=embed',
//       embed_html: '<iframe src=\'https://clips.twitch.tv/embed?clip=FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7&tt_medium=clips_api&tt_content=embed\' width=\'640\' height=\'360\' frameborder=\'0\' scrolling=\'no\' allowfullscreen=\'true\'></iframe>',
//       broadcaster: {
//         id: '26154978',
//         name: 'sykkuno',
//         display_name: 'Sykkuno',
//         channel_url: 'https://www.twitch.tv/sykkuno',
//         logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/sykkuno-profile_image-6ab1e70e07e29e9b-300x300.jpeg'
//       },
//       curator: {
//         id: '198797618',
//         name: 'pnastyfps',
//         display_name: 'PNastyFPS',
//         channel_url: 'https://www.twitch.tv/pnastyfps',
//         logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/db3491c8-b36e-46a6-a671-b9b1f64ac380-profile_image-150x150.png'
//       },
//       vod: {
//         id: '1083839237',
//         url: 'https://www.twitch.tv/videos/1083839237?t=4h5m33s',
//         offset: 14733,
//         preview_image_url: 'https://clips-media-assets2.twitch.tv/AT-cm%7C1250331362-preview.jpg'
//       },
//       broadcast_id: '42788882733',
//       game: 'Gang Beasts',
//       language: 'en',
//       title: 'ALRIGHT TONY, IT\'S TIME',
//       views: 4718,
//       duration: 15.6,
//       created_at: '2021-07-12T02:25:49Z',
//       thumbnails: {
//         medium: 'https://clips-media-assets2.twitch.tv/AT-cm%7C1250331362-preview-480x272.jpg',
//         small: 'https://clips-media-assets2.twitch.tv/AT-cm%7C1250331362-preview-260x147.jpg',
//         tiny: 'https://clips-media-assets2.twitch.tv/AT-cm%7C1250331362-preview-86x45.jpg'
//       },
//       startEpoch: 1626056721000,
//       firstSeenAnnotation: 'bfdd1882-82b8-41f1-b26f-ec4497819c32',
//       broadcasterName: 'sykkuno',
//       postedBy: {
//         clipstime: [
//           'itssaber_',
//           'seanlai01'
//         ]
//       },
//       votes: {
//         clipstime: {
//           up: [
//             'itssaber_',
//             'seanlai01'
//           ],
//           down: []
//         }
//       },
//       taggedIn: {
//         clipstime: {
//           as: {
//             tags: [
//               'sykkuno',
//               'pov',
//               'had',
//               'dying'
//             ],
//             byTag: {
//               sykkuno: [
//                 'itssaber_',
//                 'seanlai01'
//               ],
//               pov: [
//                 'itssaber_',
//                 'seanlai01'
//               ],
//               had: [
//                 'itssaber_',
//                 'seanlai01'
//               ],
//               dying: [
//                 'itssaber_',
//                 'seanlai01'
//               ]
//             }
//           }
//         }
//       },
//       metaedIn: {},
//       dramaedIn: {}
//     },
//   }
// }

// export const annotationsDemoData: Partial<AnnotationsSliceState> = {
//   annotations: {
//     '62ae7b58-e012-4d7c-a574-82e0dedc4bd3': {
//       annotationTypes: [
//         0,
//         1
//       ],
//       clipSlug: 'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS',
//       channelName: 'clipstime',
//       by: 'zaqariscott7',
//       userTypes: [
//         0
//       ],
//       messageId: '62ae7b58-e012-4d7c-a574-82e0dedc4bd3',
//       messageEpoch: 1627033502429,
//       upvote: false,
//       downvote: false,
//       veto: false,
//       meta: false,
//       drama: false,
//       tags: []
//     },
//     '2a297c08-2063-4dcc-ba7d-74f66d2d8b5c': {
//       annotationTypes: [
//         0,
//         1
//       ],
//       clipSlug: 'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS',
//       channelName: 'clipstime',
//       by: 'zaqariscott7',
//       userTypes: [
//         0
//       ],
//       messageId: '2a297c08-2063-4dcc-ba7d-74f66d2d8b5c',
//       messageEpoch: 1627033527181,
//       upvote: false,
//       downvote: false,
//       veto: false,
//       meta: false,
//       drama: false,
//       tags: [],
//       reverted: true
//     },
//     '794a490c-4232-404e-ba60-a91903fd80c3': {
//       annotationTypes: [
//         3
//       ],
//       clipSlug: 'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS',
//       channelName: 'clipstime',
//       by: 'astralhollow',
//       userTypes: [
//         1,
//         0
//       ],
//       messageId: '794a490c-4232-404e-ba60-a91903fd80c3',
//       messageEpoch: 1627033541427,
//       upvote: false,
//       downvote: false,
//       veto: false,
//       meta: true,
//       drama: false,
//       tags: [
//         'weirdchamp'
//       ]
//     },
//     '636064de-c4f1-4c18-9206-2b4c85c871b7': {
//       annotationTypes: [
//         0,
//         1
//       ],
//       clipSlug: 'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS',
//       channelName: 'clipstime',
//       by: 'zaqariscott7',
//       userTypes: [
//         0
//       ],
//       messageId: '636064de-c4f1-4c18-9206-2b4c85c871b7',
//       messageEpoch: 1627033543070,
//       upvote: false,
//       downvote: false,
//       veto: false,
//       meta: false,
//       drama: false,
//       tags: []
//     },
//     'bc260aed-7276-4db3-8c89-962473eb3fae': {
//       annotationTypes: [
//         0,
//         1
//       ],
//       clipSlug: 'NiceRockySharkWTRuck-wGevnXNX5XPj6ilU',
//       channelName: 'clipstime',
//       by: 'emjayultra',
//       userTypes: [
//         1,
//         0
//       ],
//       messageId: 'bc260aed-7276-4db3-8c89-962473eb3fae',
//       messageEpoch: 1626999438605,
//       upvote: false,
//       downvote: false,
//       veto: false,
//       meta: false,
//       drama: false,
//       tags: []
//     },
//     'bfdd1882-82b8-41f1-b26f-ec4497819c32': {
//       annotationTypes: [
//         0,
//         1,
//         3
//       ],
//       clipSlug: 'FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7',
//       channelName: 'clipstime',
//       by: 'itssaber_',
//       userTypes: [
//         0,
//         1
//       ],
//       messageId: 'bfdd1882-82b8-41f1-b26f-ec4497819c32',
//       messageEpoch: 1626108497499,
//       upvote: false,
//       downvote: false,
//       veto: false,
//       meta: false,
//       drama: false,
//       tags: [
//         'sykkuno',
//         'pov',
//         'had',
//         'dying'
//       ]
//     },
//     '54672226-2a10-4120-aff0-32f3c9596717': {
//       annotationTypes: [
//         0,
//         1,
//         3
//       ],
//       clipSlug: 'FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7',
//       channelName: 'clipstime',
//       by: 'seanlai01',
//       userTypes: [
//         0
//       ],
//       messageId: '54672226-2a10-4120-aff0-32f3c9596717',
//       messageEpoch: 1626108547892,
//       upvote: false,
//       downvote: false,
//       veto: false,
//       meta: false,
//       drama: false,
//       tags: [
//         'sykkuno',
//         'pov',
//         'had',
//         'dying'
//       ]
//     },
//   },
//   annotationsByClip: {
//     'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS': {
//       clipstime: [
//         '62ae7b58-e012-4d7c-a574-82e0dedc4bd3',
//         '794a490c-4232-404e-ba60-a91903fd80c3',
//         '636064de-c4f1-4c18-9206-2b4c85c871b7'
//       ]
//     },
//     'NiceRockySharkWTRuck-wGevnXNX5XPj6ilU': {
//       clipstime: [
//         'bc260aed-7276-4db3-8c89-962473eb3fae'
//        ]
//     },
//     'FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7': {
//       clipstime: [
//         'bfdd1882-82b8-41f1-b26f-ec4497819c32',
//         '54672226-2a10-4120-aff0-32f3c9596717'
//       ]
//     },
//   },
//   annotationsByChannel: {
//     clipstime: [
//       '62ae7b58-e012-4d7c-a574-82e0dedc4bd3',
//       '794a490c-4232-404e-ba60-a91903fd80c3',
//       '636064de-c4f1-4c18-9206-2b4c85c871b7',
//       'bc260aed-7276-4db3-8c89-962473eb3fae',
//       'bfdd1882-82b8-41f1-b26f-ec4497819c32',
//       '54672226-2a10-4120-aff0-32f3c9596717'
//     ]
//   },
//   annotationsByUser: {
//     zaqariscott7: {
//       'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS': [
//         '62ae7b58-e012-4d7c-a574-82e0dedc4bd3',
//         '636064de-c4f1-4c18-9206-2b4c85c871b7'
//       ]
//     },
//     astralhollow: {
//       'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS': [
//         '794a490c-4232-404e-ba60-a91903fd80c3'
//       ]
//     },
//     emjayultra: {
//       'NiceRockySharkWTRuck-wGevnXNX5XPj6ilU': [
//         'bc260aed-7276-4db3-8c89-962473eb3fae'
//       ]
//     },
//     itssaber_: {
//       'FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7': [
//         'bfdd1882-82b8-41f1-b26f-ec4497819c32'
//       ]
//     },
//     seanlai01: {
//       'FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7': [
//         '54672226-2a10-4120-aff0-32f3c9596717'
//       ]
//     },

//   }
// }

// export const messagesDemoData: Partial<MessagesSliceState> = {
//   messages: {
//     '62ae7b58-e012-4d7c-a574-82e0dedc4bd3': 'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS',
//     '2a297c08-2063-4dcc-ba7d-74f66d2d8b5c': 'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS',
//     '794a490c-4232-404e-ba60-a91903fd80c3': 'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS',
//     '636064de-c4f1-4c18-9206-2b4c85c871b7': 'HotRespectfulOtterSaltBae-RYDYYKmW1Ty1uKFS',
//     'bc260aed-7276-4db3-8c89-962473eb3fae': 'NiceRockySharkWTRuck-wGevnXNX5XPj6ilU',
//     'bfdd1882-82b8-41f1-b26f-ec4497819c32': 'FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7',
//     '54672226-2a10-4120-aff0-32f3c9596717': 'FrailCallousChinchillaLitty-ZnzF9vB2w7Nwkhv7',
//   }
// }

// export const usersDemoData: Partial<UsersSliceState> = {
//   users: {
//     zaqariscott7: {
//       userName: 'zaqariscott7',
//       annotations: [
//         '62ae7b58-e012-4d7c-a574-82e0dedc4bd3',
//         '2a297c08-2063-4dcc-ba7d-74f66d2d8b5c',
//         '636064de-c4f1-4c18-9206-2b4c85c871b7'
//       ],
//       userTypes: {
//         clipstime: [
//           0
//         ]
//       }
//     },
//     astralhollow: {
//       userName: 'astralhollow',
//       annotations: [
//         '794a490c-4232-404e-ba60-a91903fd80c3'
//       ],
//       userTypes: {
//         clipstime: [
//           1,
//           0
//         ]
//       }
//     },
//     emjayultra: {
//       userName: 'emjayultra',
//       annotations: [
//         'bc260aed-7276-4db3-8c89-962473eb3fae'
//       ],
//       userTypes: {
//         clipstime: [
//           1,
//           0
//         ]
//       }
//     },
//     itssaber_: {
//       userName: 'itssaber_',
//       annotations: [
//         'bfdd1882-82b8-41f1-b26f-ec4497819c32'
//       ],
//       userTypes: {
//         clipstime: [
//           0,
//           1
//         ]
//       }
//     },
//     seanlai01: {
//       userName: 'seanlai01',
//       annotations: [
//         '54672226-2a10-4120-aff0-32f3c9596717'
//       ],
//       userTypes: {
//         clipstime: [
//           0
//         ]
//       }
//     },
    
//   }
// }

export default {}