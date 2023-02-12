import type { PlayerWithFriends } from '@shared/types';
import type { GetCurrentPlayerResponse } from './GetCurrentPlayer';

export type GetMyFriendsResponse = GetCurrentPlayerResponse[];

export const getMyFriendsMapper = (playerWithFriends: PlayerWithFriends): GetMyFriendsResponse =>
	playerWithFriends.friendships.map(({ friend }) => ({ nickname: friend.nickname }));
