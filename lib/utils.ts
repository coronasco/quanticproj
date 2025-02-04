import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { doc, getDoc } from "firebase/firestore"
import { db } from "./firebase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkUserPlan = async ( userId: string): Promise<boolean> => {
  if(!userId) return false

  try {
    const useRef = doc(db, 'users', userId)
    const userSnap = await getDoc(useRef)

    return userSnap.exists() && userSnap.data().plan === 'premium'
  } catch (error) {
    console.log("Error checking user plan: ", error)
    return false
  }
}

export const formatDate = (timestamp: any): string => {
  if(!timestamp) return '';
  return timestamp.toDate().toLocaleDateString("it-IT"); // Formats time in italian
}