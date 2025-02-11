import {
    Button,
    Dialog,
    DialogTitle,
    Skeleton,
    Stack,
    Typography,
  } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import UserItem from "../shared/UserItem";
import {
useAddGroupMembersMutation,
useAvailableFriendsQuery,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../customHook/Hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";

const AddMemberDialog = ({ chatId }) => {
    const dispatch = useDispatch()
    const { isAddMember } = useSelector((state) => state.misc)

    const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId)
    const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddGroupMembersMutation)
    const [selectedMembers, setSelectedMembers] = useState(new Set())

    const selectMemberHandler = useCallback((id) => {
        setSelectedMembers((prev) => {
            const updated = new Set(prev)
            updated.has(id) ? updated.delete(id) : updated.add(id);
            return updated
        })
    }, [])

    const closeHandler = useCallback(() => {
        dispatch(setIsAddMember(false))
    }, [dispatch])

    const addMemberSubmitHandler = useCallback(() => {
        if(selectedMembers.size === 0)
            return
        addMembers("Adding Members...", {
            members: Array.from(selectedMembers),
            chatId
        })
        closeHandler()
    }, [addMembers, selectedMembers, chatId, closeHandler])

    useErrors([{ isError, error }])

    const renderedFriends = useMemo(() => {
        if(isLoading) return <Skeleton />
        if(!data?.friends?.length)
            return <Typography textAlign="center">No Friends</Typography>
        return data.friends.map((friend) => (
            <UserItem key={friend._id} user={friend} handler={selectMemberHandler} isAdded={selectedMembers.has(friend._id)} />
        ))
    }, [isLoading, data, selectedMembers, selectMemberHandler])

    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack p={4} width={320} spacing={4}>
                <DialogTitle textAlign="center">Add Member</DialogTitle>
                <Stack spacing={2}>{renderedFriends}</Stack>
                <Stack direction="row" justifyContent="space-evenly">
                    <Button color="error" onClick={closeHandler}>Cancel</Button>
                    <Button onClick={addMemberSubmitHandler} variant="contained" disabled={isLoadingAddMembers || selectedMembers.size === 0}>Submit Changes</Button>
                </Stack>
            </Stack>

        </Dialog>
    )
}

export default React.memo(AddMemberDialog)