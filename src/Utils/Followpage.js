import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../Backend/firebase-init";
import { generateRandomId } from "./generateId";

const followpage = async (follower_id, followee_id) => {
  try {
    const follow_id = generateRandomId();
    const followRef = doc(db, "Follower", follow_id);
    const currentDate = new Date().toISOString();
    const followData = {
      follow_id: follow_id,
      follower_id: follower_id,
      followee_id: followee_id,
      followed_on: currentDate,
    };
    await setDoc(followRef, followData, { merge: true });
    return true;
  } catch (error) {
    console.log("FollowPage.js ERROR-INSERTING-FOLLOWER", error.message);
    return false;
  }
};

const checkfollow = async (follower_id, followee_id) => {
  try {
    // Reference to the Follower collection
    const followersRef = collection(db, "Follower");

    // Query to find a document with matching follower_id and followee_id
    const q = query(
      followersRef,
      where("follower_id", "==", follower_id),
      where("followee_id", "==", followee_id)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if any document matches the query
    if (!querySnapshot.empty) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("ERROR-CHECKING-FOLLOW-EXISTENCE", error.message);
    return false;
  }
};

export { checkfollow, followpage };
