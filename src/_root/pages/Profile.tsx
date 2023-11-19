import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import { Models } from "appwrite";

import { Button } from "@/components/ui";
import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetFollowers,
  useGetFollowings,
  useGetUserById,
} from "@/lib/react-query/queries";
import { GridPostList, Loader } from "@/components/shared";
import { followUser } from "@/lib/utils";
import { useEffect, useState } from "react";
import { log } from "console";

interface StabBlockProps {
  value: string | number;
  label: string;
}

type PostStatsProps = {
  followlist: Models.Document;
};

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  // const id: string = useParams().id;

  const { data: currentUser } = useGetUserById(id || "");
  const { data: followersData } = useGetFollowers(currentUser?.$id);
  const { data: followingsData } = useGetFollowings(currentUser?.$id);
  const { data: LoggedInfollowingsData } = useGetFollowings(user.id);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollower, setIsFollower] = useState(false);

  const [followlength, setfollowlength] = useState(0);
  const [followinglength, setfollowinglength] = useState(0);

  const visitDocId = followersData?.documents[0]?.$id;
  const loginDocId = LoggedInfollowingsData?.documents[0]?.$id;

  // const followersCount = followersData?.documents[0]?.followers?.length || 0;
  // const followingsCount = followingsData?.documents[0]?.followings?.length || 0;

  const [followersArray, setfollowersArray] = useState<string[]>(
    followersData?.documents[0]?.followers?.map(
      (item: { $id: any }) => item?.$id
    ) || []
  );

  const [followingArray, setfollowingArray] = useState<string[]>(
    followingsData?.documents[0]?.followings?.map(
      (item: { $id: any }) => item?.$id
    ) || []
  );

  const [LoggedInfollowing, setLoggedInfollowing] = useState<string[]>(
    LoggedInfollowingsData?.documents[0]?.followings?.map(
      (item: { $id: any }) => item?.$id
    ) || []
  );

  // console.log("Length");
  // console.log(followersArray);
  // console.log(followingArray);
  // console.log(LoggedInfollowing);

  // const followersArray =
  //   followersData?.documents[0]?.followers?.map(
  //     (item: { $id: any }) => item?.$id
  //   ) || [];
  // const followingArray =
  //   followingsData?.documents[0]?.followings?.map(
  //     (item: { $id: any }) => item?.$id
  //   ) || [];

  console.log(`Login User ${user.id}`);
  console.log(`Profile User ${currentUser?.$id}`);

  console.log(followersArray);
  console.log(followingArray);

  console.log("login User Following ");
  console.log(LoggedInfollowing);

  useEffect(() => {
    const followersArrays =
      followersData?.documents[0]?.followers?.map(
        (item: { $id: any }) => item?.$id
      ) || [];
    setIsFollowing(followersArrays.includes(user.id));
    setfollowlength(followersArrays.length);
  }, [followersData, user.id]);

  useEffect(() => {
    const followingArrays =
      followingsData?.documents[0]?.followings?.map(
        (item: { $id: any }) => item?.$id
      ) || [];
    setIsFollower(followingArrays.includes(user.id));
    setfollowinglength(followingArrays.length);
  }, [followingsData, user.id]);

  console.log(followingsData);
  console.log(followersData);

  console.log(isFollowing);
  console.log(isFollower);

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const handlefollow = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    try {
      let followsArray = [...followersArray];
      let LoginfollowsArray = [...LoggedInfollowing];
      console.log("Before");
      console.log(followsArray);
      console.log(LoginfollowsArray);

      if (LoginfollowsArray.includes(currentUser?.$id)) {
        LoginfollowsArray = LoginfollowsArray.filter(
          (Id) => Id !== currentUser?.$id
        );
      } else {
        LoginfollowsArray.push(currentUser?.$id);
      }
      setLoggedInfollowing(LoginfollowsArray);

      if (followsArray.includes(user.id)) {
        followsArray = followsArray.filter((Id) => Id !== user.id);
      } else {
        followsArray.push(user.id);
      }
      setfollowersArray(followsArray);
      // If not following, follow the user

      console.log("After");
      console.log(followsArray);
      console.log(LoginfollowsArray);

      await followUser(
        currentUser?.$id,
        user.id,
        followsArray,
        LoginfollowsArray,
        visitDocId,
        loginDocId
      );

      // Toggle the follow state
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleFollow = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
  //   e.stopPropagation();
  // };

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock value={followersArray.length} label="Followers" />
              <StatBlock value={followingArray.length} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              {/* Update the Follow button to call handleFollowUser */}
              <Button type="button" className="shad-button_primary px-8">
                {isFollowing ? (
                  <span onClick={handlefollow}>Unfollow</span>
                ) : isFollower ? (
                  <span onClick={handlefollow}>Follow Back</span>
                ) : (
                  <span onClick={handlefollow}>Follow</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser.posts} showUser={false} />}
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
