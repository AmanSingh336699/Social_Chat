import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { server } from "../../constants/config"

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1`, credentials: "include"}),
    tagTypes: ["Chat", "User", "Message"],

    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: "/chat/my",
                keepUnusedDataFor: 60
            }),
            providesTags: ["Chat"]
        }),
        searchUser: builder.query({
            query: (name) => ({
                url: `user/search?name=${name}`,
            }),
            providesTags: ["User"]
        }),
        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: "/user/sendRequest",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["User"]
        }),
        getNotifications: builder.query({
            query: () => ({
                url: "user/notifications",
            }),
            keepUnusedDataFor: 0,
        }),
        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: "user/acceptrequest",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Chat"]
        }),
        chatDetails: builder.query({
            query: ({ chatId, populate = false}) => {
                let url = `chat/${chatId}`
                if(populate) url += "?populate=true"
                return {
                    url,
                }
            },
            providesTags: ["Chat"]
        }),
        getMessages: builder.query({
            query: ({ chatId, page }) => ({
                url: `chat/messages/${chatId}?page=${page}`,
            }),
            serializeQueryArgs: ({ endpointName, queryArgs }) => `${endpointName}-${queryArgs.chatId}`,
            merge: (currentCache, newItems) => {
                currentCache.push(...newItems);
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page
            },
            keepUnusedDataFor: 0,
        }),
        sendAttachments: builder.mutation({
            query: (data) => ({
                url: "chat/message",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Message"]
        }),
        myGroups: builder.query({
            query: () => ({
                url: "chat/my/groups",
            }),
            providesTags: ["Chat"]
        }),
        availableFriends: builder.query({
            query: (chatId) => {
                let url = `user/friends`;
                if(chatId) url += `?chatId=${chatId}`;
                return { url }
            },
            providesTags: ["Chat"]
        }),
        newGroup: builder.mutation({
            query: ({ name, members }) => ({
                url: "chat/new",
                method: "POST",
                body: { name, members },
            }),
            invalidatesTags: ["Chat"]
        }),
        renameGroup: builder.mutation({
            query: ({ chatId, name }) => ({
                url: `chat/${chatId}`,
                method: "PUT",
                body: { name },
            }),
            invalidatesTags: ["Chat"]
        }),
        removeGroupMember: builder.mutation({
            query: ({ chatId, userId }) => ({
                url: "chat/removemember",
                method: "PUT",
                body: { chatId, userId },
            }),
            invalidatesTags: ["Chat"]
        }),
        addGroupMembers: builder.mutation({
            query: ({ members, chatId }) => ({
                url: "chat/addmembers",
                method: "PUT",
                body: { members, chatId },
            }),
            invalidatesTags: ["Chat"]
        }),
        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `chat/${chatId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Chat"]
        }),
        leaveGroup: builder.mutation({
            query: (chatId) => ({
                url: `chat/leave/${chatId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Chat"]
        })
    })
})

export default api

export const {
    useMyChatsQuery,
    useLazySearchUserQuery,
    useSendFriendRequestMutation,
    useGetNotificationsQuery,
    useAcceptFriendRequestMutation,
    useChatDetailsQuery,
    useGetMessagesQuery,
    useSendAttachmentsMutation,
    useMyGroupsQuery,
    useAvailableFriendsQuery,
    useNewGroupMutation,
    useRenameGroupMutation,
    useRemoveGroupMemberMutation,
    useAddGroupMembersMutation,
    useDeleteChatMutation,
    useLeaveGroupMutation,
  } = api;