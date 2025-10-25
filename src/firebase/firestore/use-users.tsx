'use client';

import { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  DocumentData,
  FirestoreError,
  DocumentReference,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { type UserProfile } from '@/types';

type WithId<T> = T & { id: string };

interface UseUsersResult {
  users: Record<string, WithId<UserProfile>>;
  isLoading: boolean;
  error: FirestoreError | null;
}

export function useUsers(userIds: string[]): UseUsersResult {
  const firestore = useFirestore();
  const [users, setUsers] = useState<Record<string, WithId<UserProfile>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!firestore || userIds.length === 0) {
      setUsers({});
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      const uniqueUserIds = [...new Set(userIds)];
      const usersData: Record<string, WithId<UserProfile>> = {};
      
      try {
        await Promise.all(
          uniqueUserIds.map(async (id) => {
            if (!id) return;
            // Skip fetching if user data already exists
            if (users[id]) {
                usersData[id] = users[id];
                return;
            }
            const userRef = doc(firestore, 'users', id);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              usersData[id] = { id, ...(userSnap.data() as UserProfile) };
            }
          })
        );
        setUsers(usersData);
      } catch (err) {
        setError(err as FirestoreError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [firestore, JSON.stringify(userIds)]); // Deep comparison for userIds array

  return { users, isLoading, error };
}
