/* eslint-disable @typescript-eslint/no-unused-vars*/
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { singletonHook } from 'react-singleton-hook'
import { ChatClient } from "@twurple/chat";
import { useContextSelector } from 'use-context-selector';
import { AuthContext } from '../contexts/AuthContext';

const init = {
  chatClient: null,
  loggedIn: null
}

const useChatClientImpl = () => {

  // console.log('rerendering usechatclient')

  const authProvider = useContextSelector(AuthContext, (c) => c.authProvider)
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(false)

  

  useEffect(() => {
    if (authProvider && !chatClient) {
      const chatClient = new ChatClient({webSocket: true}) //new ChatClient(authProvider, { webSocket: true});
      if (chatClient) {
        setChatClient(chatClient);
      }
      if (chatClient) {
        if (!loggedIn) {
          chatClient.connect();
          chatClient.onRegister(() => {
            // console.log('logged into chat')
            chatClient.onJoin((chan, user) => console.log(`${user} joined ${chan}`))
            chatClient.onPart((chan, user) => console.log(`${user} parted ${chan}`))
            setLoggedIn(true);
          });

        }
      }
    }

    return (() => {
      if (chatClient) {
        chatClient.quit()
      }
      setLoggedIn(false)
      setChatClient(null)
    })

  }, [authProvider]);

  return  { chatClient, loggedIn }

}

export const useChatClient = singletonHook(init, useChatClientImpl)

export default useChatClient